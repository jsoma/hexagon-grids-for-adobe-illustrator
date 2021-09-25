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

  var tooFarRight = false;
  var tooFarDown = false;
  var nextPosition;

  moveHexToTopLeftCorner(hex, measurements);

  for (var col = 0; col <= cols; col++) {
    for (var row = 0; row <= rows; row++) {
      nextPosition = getNextPosition(orientation, col, colStep, row, rowStep);
      tooFarRight = Math.abs(nextPosition.x) > doc.width;
      tooFarDown = Math.abs(nextPosition.y) > doc.height;

      createNewHex(hex, nextPosition);

      if (tooFarDown) {
        break;
      }
    }
    if (tooFarRight) {
      break;
    }
  }

  hex.remove();
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

function createNewHex(hex, nextPosition) {
  var added = hex.duplicate();
  added.translate(nextPosition.x, nextPosition.y);
  return added;
}

function getNextPosition(orientation, currentColumn, columnXDistance, currentRow, rowYDistance) {
  if (orientation == "vertical") {
    return {
      x: currentColumn * columnXDistance + (currentRow % 2 == 1 ? columnXDistance * 0.5 : 0),
      y: currentRow * rowYDistance
    };
  }

  return {
    x: currentColumn * columnXDistance,
    y: currentRow * rowYDistance + (currentColumn % 2 == 1 ? rowYDistance * 0.5 : 0)
  };
}

makeHexGrid();