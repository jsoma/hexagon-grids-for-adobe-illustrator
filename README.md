# Hex Grid Script for Adobe Illustrator

This makes repeating hexagonal grids for hex maps or heat maps or Dungeons and Dragons or D3 or whatever you want. There are [tools like this](https://pitchinteractiveinc.github.io/tilegrams/) but I'm too lazy to read the documentation for them. And hey, we like to use Illustrator to customize our stuff, right?

![Screenshot of using the hex grid script with d3](screenshots/demo.png)

See a demo of hex grids using d3 and turf.js [right here](http://jsoma.github.io/hexagon-grids-for-adobe-illustrator/), or just check out the code in the [`docs/` folder](https://github.com/jsoma/hexagon-grids-for-adobe-illustrator/tree/master/docs)

## Usage

### Step 1. Drawing the template hexagon

Draw a hexagon of the proper size using the Polygon tool (it's under shapes). Hold shift while you draw to keep your hexagon the right proportion!

![Using the polygon tool in Illustrator to draw a hexagon](screenshots/polygon-tool.png)

> **If your hexagon has too many sides,** use the **Shapes** menu to kick it up/down to 6.
>
> ![How to make sure your hexagon has six sides in Illustator](screenshots/six-sides.png)
>
> **If you'd like to rotate** your hexagon to make the pointy side point up, select your hexagon and use **Object > Transform > Rotate**. Pick **90** as your rotation amount.

### Step 2. Running the script

1. Save [hex-grid-generator.js](https://github.com/jsoma/hexagon-grids-for-adobe-illustrator/raw/master/hex-grid-generator.js) to your machine.
2. Use the Selection Tool (press `V`) and **click the hexagon.** *Select only one hexagon!*
3. Now you can **run the script** by selecting **File > Scripts > Other Scripts...** and picking the `.js` file from wherever you downloaded it to.

![A completed hex grid from the tool](screenshots/hex-grid-complete.png)

Tada! If you'd like to install it as a permanent script, see the instructions at the bottom of the page.

### Step 3. Putting hexes in groups

If you want to put your hexagons into groups (which maybe you do, it helps for coloring and organizing and outlining), here's how I suggest doing it:

1. Select a series of hexagons: either hold shift and click to select multiples, or use the lasso tool and then press `V`. I like the lasso technique, but it can be finnicky.
2. `Ctrl+G` to place the hexagons into a group together, then change the color.
3. Repeat until you've put everything in a group (or deleted the extra hexagons)
4. Double-click each layer name - for example, Layer `0` - to give it a name. Don't use spaces or anything that isn't a letter of number, they export weird! If you don't have the Layer panel, **Window > Layers** will reveal it.

![Putting your hexagons into layers](screenshots/layered.png)

### Step 4. Using it in D3 (totes optional, of course)

I'm using this to build hex-based cartograms in D3, a.k.a. fancy perfect cool interactive maps. If you'd like to do the same, **start by saving your file as an SVG**.

> See a demo of the completed technique [right here](http://jsoma.github.io/hexagon-grids-for-adobe-illustrator/), or see the code in the [`docs/` folder](https://github.com/jsoma/hexagon-grids-for-adobe-illustrator/tree/master/docs)

Maybe you have a csv file full of data to associate with each group of hexagons? **Make sure you have a column in your csv that matches with your Illustrator file's layer names**. In this case, `state` is the same as the layer name.

```csv
state,population
California,39.5
Oklahoma,3.93
Iowa,3.14
Florida,20.98
Virginia,8.47
```

Now let's get the D3 part going:

* Read in your **svg** using `d3.xml`, call it `hexFile`.
* Read in your **csv** using `d3.csv`, call it `datapoints`

To associate your csv data with your svg file, you need to do some really weird trickery. The positive side is that if you steal this code, you'll only ever have to change `d.state` to match your csv column name!

Each layer in the Illustrator file becomes a `g` with an id of the layer name. Each hexagon is a `polygon` inside of that layer.

```js
// Get ready to process the hexagon svg file with D3
let imported = d3.select(hexFile).select('svg')

// Remove the stylesheets Illustrator saved
imported.selectAll('style').remove()

// Inject the imported svg's contents into our real svg
svg.html(imported.html())

// Loop through our csv, finding the g for each state.
// Use d3 to attach the datapoint to the group.
// e.g. d3.select("#" + d.abbr) => d3.select("#CA")
datapoints.forEach(d => {
  svg.select("#" + d.state)
    .attr('class', 'hex-group')
    .each(function() {
      d3.select(this).datum(d)
    })
})
```

Instead of the standard `.selectAll` + `.data`, which binds all of the data all at once, we're using `.select` + `.datum` to bind the data one by one.

Once you've done that you can easily use your color scale or whatever on the hexagons - just loop through the groups, find the polygons inside, and use the `d` you added before!

```js
svg.selectAll('.hex-group')
  .each(function(d) {
    var group = d3.select(this)
    group.selectAll('polygon')
      .attr('fill', colorScale(d.population))
  })
```

What does that even look like? Look at [a demo](http://jsoma.github.io/hexagon-grids-for-adobe-illustrator).

> Yes, you can also associate your data with the hexagons themselves so you don't have to do the `.each` thing. If you want to draw outlines and stuff, though, this technique works a lot better.

## Installation instructions

You can just download it and use it like the above, but if you'd like to have it forever and ever, install instructions to make it show up in the Scripts menu...

**Windows**

You'll install it in something that looks like `C:\Program Files\Adobe\Adobe Illustrator CC 2018\Presets\en_US\Scripts`. It might be in `Adobe Illustrator CS6 (64 Bit)` or something else like that, and your language might be `en_GB` or `de_DE` or whatever if you aren't an American, but I trust that you can figure it out.

**OS X**

You should follow [these instructions](https://xinrongding.wordpress.com/2015/12/21/illustrator-cc-install-scripts-on-mac-os/), they're really good and even have screenshots!

> Writing code in the ExtendScript Toolkit seriously broke me. I promise I know how to write JavaScript, really.