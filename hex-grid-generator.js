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
  return isVertical ? hex.height * 0.75 : hex.height;
}

function getNextPosition(isVertical, rowStep, colStep, currentColumn, currentRow) {
  var xPosition = currentColumn * colStep
  var yPosition = currentRow * -rowStep
  if (isVertical) {
    return {
      x: xPosition + (currentRow % 2 == 1 && colStep * 0.5),
      y: yPosition,
    };
  }

  return {
    x: xPosition,
    y: yPosition + (currentColumn % 2 == 1 && -rowStep * 0.5),
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
  var rowStep = getRowStep(isVertical, hex)
  var colStep = getColStep(isVertical, hex)
  var rowCount = doc.height / rowStep
  var columnCount = doc.width / colStep

  hex.position = [-hex.width / 2, hex.height / 2]

  for (var col = 0; col <= columnCount; col++) {
    for (var row = 0; row <= rowCount; row++) {
      var nextPosition = getNextPosition(isVertical, rowStep, colStep, col, row);
      createNewHex(hex, nextPosition);
    }
  }

  hex.remove();
}

makeHexGrid();