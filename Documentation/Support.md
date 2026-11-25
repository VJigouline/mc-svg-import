# Formats and support

mc-svg-import reads SVG with three.js's SVGLoader.

## What is read

- Paths, rectangles, circles, ellipses, lines, polylines and polygons, with their transforms.
- Fills (with holes) and strokes (with widths, joins and caps), in their colours and opacities.
- Styles from attributes, `style` and CSS classes.
- The drawing's size from its viewBox, or its width and height.

## Orientation and units

SVG's y axis points down; the group flips it so the drawing is the right way up, facing +Z. One user unit is a CSS pixel (1/96 inch) unless you pass `unitScale`.

## Limits

Text, embedded images, gradients and patterns are not drawn as such: gradients and patterns are drawn in solid colours, with warnings. three.js reads SVG with DOMParser, so in Node a DOM implementation must be provided; the tests use happy-dom.
