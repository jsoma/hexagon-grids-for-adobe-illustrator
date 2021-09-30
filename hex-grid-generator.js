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
  var isVertical = measurements.height > measurements.width

  hex.position = [-measurements.width / 2, measurements.height / 2]

  for (var col = 0; col <= docMeasurements.columns; col++) {
    for (var row = 0; row <= docMeasurements.rows; row++) {
      var nextPosition = getNextPosition(isVertical, measurements, col, row);
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

function getRowStep(orientation, size) {
  return -size;
}

function getColStep(orientation, width) {
  return width * 0.75
}

function getNextPosition(isVertical, measurements, currentColumn, currentRow) {
  var columnXDistance = getColStep(isVertical, measurements.width);
  var rowYDistance = getRowStep(isVertical, measurements.size);

  if (isVertical) {
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