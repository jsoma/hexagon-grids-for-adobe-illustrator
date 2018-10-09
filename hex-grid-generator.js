var doc = app.activeDocument

// Fill color for completed hexagons
var fillColor = new RGBColor()
fillColor.red = 230
fillColor.blue = 60
fillColor.green = 60

// Stroke color for completed hexagons
var strokeColor = new RGBColor()
strokeColor.red = 30
strokeColor.blue = 30
strokeColor.green = 30

// Is a single thing selected?
if (doc.selection.length !== 1) {
  // If not, panic and yell at them
  var text = doc.textFrames.add()
  text.move(doc, ElementPlacement.PLACEATBEGINNING)
  text.contents = "Draw and select a single hexagon!\nHold down the shape tooland pick the\npolygon. Click and drag while holding down the shift key.\nRotate it 90 degrees if you want it pointy at the top."
  text.left = 40
  text.top = -100
  text.textRange.characterAttributes.size = 30
} else {
  // If yes, we'll just assume it's a hexagon.
  var hex = doc.selection[0]
  var hexHeight = hex.height / 2
  var hexWidth = hex.width / 2
  var orientation = 'horizontal'
  if (hexHeight > hexWidth) {
    orientation = 'vertical'
  }

  hex.translate(-hex.left - hexWidth, -hex.top + hexHeight)

  // This is all horrifying magic numbers
  // I am so sorry
  // I blame the terrible environment I had to work in
  var size = hexHeight / 2
  var rows = doc.height / (size * 1)
  var cols = doc.width / (size * 3)

  var rowStep, colStep
  if (orientation == 'vertical') {
    rowStep = -size * 1.5 * 2
    colStep = size * 1.73 * 2
  } else {
    rowStep = -size * 2 * 2
    colStep = size * 1.73 * 2
  }
  var offset = 1.73 * -size * 2

  var tooFarRight = false
  var tooFatDown = false
  var previouslyTooFarRight = false

  for (var colCount = 0; colCount <= cols; colCount++) {
    for (var rowCount = 0; rowCount <= rows; rowCount++) {
      previouslyTooFarRight = false
      var added = hex.duplicate()
      added.fillColor = fillColor
      added.strokeColor = strokeColor
      added.opacity = 75.0
      added.strokeWidth = 0.5
      if (orientation == 'vertical') {
        added.translate(colCount * colStep + (rowCount % 2 == 1 ? colStep * 0.5 : 0), rowCount * rowStep)
      } else {
        added.translate(colCount * colStep, rowCount * rowStep + (colCount % 2 == 1 ? rowStep * 0.5 : 0))
      }
      // Let's see if it's off of the artboard
      tooFarRight = Math.abs(added.left) > doc.width
      tooFarDown = Math.abs(added.top) > doc.height
      if (tooFarDown) {
        // if it is, remove the hexagon we just added and exit the loop
        added.remove()
        break
      }
      if (tooFarRight) added.remove()
      if (tooFarRight && previouslyTooFarRight) break
    }
    // If two in a row are too far right, time to escape
    if (tooFarRight && previouslyTooFarRight) {
      break
    }
  }
  // Remove the original hexagon
  hex.remove()
}