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

  var measurements = getHexMeasurements(hex)
  var docMeasurements = getDocumentMeasurements(measurements)
  var orientation = getOrientation(measurements.height, measurements.width);

  var rows = docMeasurements.rows
  var cols = docMeasurements.columns

  hex.position = [-measurements.width / 2, measurements.height / 2]

  var nextPosition;

  for (var col = 0; col <= cols; col++) {
    for (var row = 0; row <= rows; row++) {
      nextPosition = getNextPosition(orientation, measurements, col, row);
      createNewHex(hex, nextPosition);
    }
  }

  hex.remove();
}

function createNewHex(hex, nextPosition) {
  var added = hex.duplicate();
  added.translate(nextPosition.x, nextPosition.y);
  return added;
}

function getDocumentMeasurements(measurements) {
  return {
    rows: doc.height / measurements.size,
    columns: doc.width / (measurements.width * 0.75)
  };
}

function getHexMeasurements(hex) {
  return {
    height: hex.height,
    width: hex.width,
    size: hex.height,
  };
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

function getOrientation(hexHeight, hexWidth) {
  var orientation = "horizontal";
  if (hexHeight > hexWidth) {
    orientation = "vertical";
  }
  return orientation;
}

function getRowStep(orientation, size) {
  return -size;
}

function getColStep(orientation, width) {
  return width * 0.75
}

function getNextPosition(orientation, measurements, currentColumn, currentRow) {
  var columnXDistance = getColStep(orientation, measurements.width);
  var rowYDistance = getRowStep(orientation, measurements.size);

  if (orientation == "vertical") {
    return {
      x: currentColumn * columnXDistance + (currentRow % 2 == 1 ? columnXDistance : 0),
      y: currentRow * rowYDistance
    };
  }

  return {
    x: currentColumn * columnXDistance,
    y: currentRow * rowYDistance + (currentColumn % 2 == 1 ? rowYDistance * 0.5 : 0)
  };
}

makeHexGrid();