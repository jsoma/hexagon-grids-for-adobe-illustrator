var doc = app.activeDocument;

function makeHexGrid() {
  if (!IsSingleItemSelected(doc.selection)) {
    warnUser("Select exactly one path");
    return;
  }

  if (!IsAHexagonSelected(doc.selection)) {
    warnUser("The selected shape is not a hexagon");
    return;
  }

  var hex = doc.selection[0];

  var measurements = {
    height: hex.height / 2,
    width: hex.width / 2,
    size: hex.height / 4,
  }

  var docMeasurements = {
    rows: doc.height / measurements.size,
    columns: doc.width / (measurements.size * 3)
  }
  
  var orientation = getOrientation(measurements.height, measurements.width);

  var rows = docMeasurements.rows
  var cols = docMeasurements.columns
  
  var rowStep, colStep;

  if (orientation == "vertical") {
    rowStep = -measurements.size * 1.5 * 2;
    colStep = measurements.size * 1.73 * 2;
  } else {
    rowStep = -measurements.size * 2 * 2;
    colStep = measurements.size * 1.73 * 2;
  }
  var offset = 1.73 * -measurements.size * 2;

  var tooFarRight = false;
  var tooFarDown = false;
  var previouslyTooFarRight = false;

  moveHexToTopLeftCorner(hex, measurements);

  for (var colCount = 0; colCount <= cols; colCount++) {
    for (var rowCount = 0; rowCount <= rows; rowCount++) {
      previouslyTooFarRight = false;
      var nextPosition = getNextPosition(orientation, colCount, colStep, rowCount, rowStep);
      var added = createNewHex(hex, nextPosition);
      // Let's see if it's off of the artboard
      tooFarRight = Math.abs(added.left) > doc.width;
      tooFarDown = Math.abs(added.top) > doc.height;
      if (tooFarDown) {
        // if it is, remove the hexagon we just added and exit the loop
        added.remove();
        break;
      }
      if (tooFarRight)
        added.remove();
      if (tooFarRight && previouslyTooFarRight)
        break;
    }
    // If two in a row are too far right, time to escape
    if (tooFarRight && previouslyTooFarRight) {
      break;
    }
  }
  // Remove the original hexagon
  hex.remove();
}

function moveHexToTopLeftCorner(hex, measurements) {
  hex.translate(-hex.left - measurements.width, -hex.top + measurements.height);
}

function getOrientation(hexHeight, hexWidth) {
  var orientation = "horizontal";
  if (hexHeight > hexWidth) {
    orientation = "vertical";
  }
  return orientation;
}

function IsSingleItemSelected(selection) {
  return selection.length === 1;
}

function IsAHexagonSelected(selection) {
  return selection[0].pathPoints.length === 6;
}

function warnUser(message) {
  var text = doc.textFrames.add();
  text.move(doc, ElementPlacement.PLACEATBEGINNING);
  text.contents = message;
  text.left = 40;
  text.top = -100;
  text.textRange.characterAttributes.size = 30;
}

function createNewHex(hex, nextPosition) {
  var added = hex.duplicate();
  setPropertiesOfNewHex(added, hex);
  added.translate(nextPosition.x, nextPosition.y);
  return added;
}

function getNextPosition(orientation, colCount, colStep, rowCount, rowStep) {
  if (orientation == "vertical") {
    return {
      x: colCount * colStep + (rowCount % 2 == 1 ? colStep * 0.5 : 0),
      y: rowCount * rowStep
    };
  }

  return {
    x: colCount * colStep,
    y: rowCount * rowStep + (colCount % 2 == 1 ? rowStep * 0.5 : 0)
  };
}

function setPropertiesOfNewHex(added, hex) {
  added.fillColor = hex.fillColor;
  added.strokeColor = hex.strokeColor;
  added.opacity = hex.opacity
  added.strokeWidth = hex.strokeWidth;
}

makeHexGrid();