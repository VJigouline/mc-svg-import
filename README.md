# mc-svg-import

An SVG importer for [three.js](https://threejs.org/), written in TypeScript. It turns SVG drawings into flat three.js shapes: filled areas and stroked outlines in their colours, the right way up, in the XY plane. It was made for [SceneEditor](https://github.com/VJigouline/SceneEditor), and works in any three.js application.

```ts
import { loadSvg } from 'mc-svg-import';

const result = await loadSvg(await file.text());
scene.add(result.group);
console.log(result.warnings);       // anything that couldn't be read
```

## What it reads

- Paths, rectangles, circles, ellipses, lines, polylines and polygons, with their transforms.
- Fills (with holes) and strokes (with widths, joins and caps), in their colours and opacities.
- Styles from attributes, `style` and CSS classes.
- The drawing's size from its viewBox, or its width and height.

Text, embedded images, gradients and patterns are not drawn as such: gradients and patterns are drawn in solid colours, with warnings. three.js reads SVG with DOMParser, so in Node a DOM implementation must be provided; the tests use happy-dom. See [Formats and support](Documentation/Support.md) for the details.

## Install

The package is not on the npm registry. Install it from GitHub:

```sh
npm install github:VJigouline/mc-svg-import
```

`three` (r160 or later) is a peer dependency. The package builds itself on install.

## Documentation

- [Getting started](Documentation/GettingStarted.md)
- [API](Documentation/API.md)
- [Formats and support](Documentation/Support.md)
- [Using it in SceneEditor](Documentation/SceneEditor.md)

## Development

```sh
npm install
npm test           # unit tests, with Vitest
npm run typecheck
npm run build      # dist/
```

The tests load real SVG files, kept in [`tests/samples`](tests/samples/README.md) with their licences. It needs Node.js 22 or later.

## Licence

[MIT](LICENSE)
