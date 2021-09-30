var doc = app.activeDocument;

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

function getColStep(isVertical, hex) {
  return isVertical ? hex.width : hex.width * 0.75;
}

function getRowStep(isVertical, hex) {
  return isVertical ? -hex.height * 0.75 : -hex.height;
}

function getNextPosition(isVertical, hex, currentColumn, currentRow) {
  var columnXDistance = getColStep(isVertical, hex);
  var rowYDistance = getRowStep(isVertical, hex);

  if (isVertical) {
    return {
      x:
        currentColumn * columnXDistance +
        (currentRow % 2 == 1 ? columnXDistance * 0.5 : 0),
      y: currentRow * rowYDistance,
    };
  }

  return {
    x: currentColumn * columnXDistance,
    y:
      currentRow * rowYDistance +
      (currentColumn % 2 == 1 ? rowYDistance * 0.5 : 0),
  };
}

function createNewHex(hex, nextPosition) {
  var added = hex.duplicate();
  added.translate(nextPosition.x, nextPosition.y);
  return added;
}

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

  var isVertical = hex.height > hex.width

  var rowCount = doc.height / (isVertical ? hex.height * 0.75 : hex.height)
  var columnCount = doc.width / (isVertical ? hex.width : hex.width * 0.75)

  hex.position = [-hex.width / 2, hex.height / 2]

  for (var col = 0; col <= columnCount; col++) {
    for (var row = 0; row <= rowCount; row++) {
      var nextPosition = getNextPosition(isVertical, hex, col, row);
      createNewHex(hex, nextPosition);
    }
  }

  hex.remove();
}

makeHexGrid();