# Getting started

## Install

```sh
npm install three github:VJigouline/mc-svg-import
```

## Open a file

`loadSvg` takes the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files. Zip archives among them are opened. It returns a promise of the model.

```ts
import * as THREE from 'three';
import { loadSvg } from 'mc-svg-import';

const input = document.querySelector<HTMLInputElement>('input[type=file]')!;
input.addEventListener('change', async () => {
  const result = await loadSvg(input.files![0]!);
  scene.add(result.group);
  for (const warning of result.warnings) console.warn(warning);
});
```

## What you get

- **`group`:** a `THREE.Group` holding the model, named after the file.
- **`stats`:** counts of what was read.
- **`warnings`:** anything that couldn't be read or was left out.

SVG's y axis points down; the group flips it so the drawing is the right way up, facing +Z. One user unit is a CSS pixel (1/96 inch) unless you pass `unitScale`.

## Options

- **`main`** (default the first .svg file): The .svg file to open, if several are given.
- **`unitScale`** (default 1/96 inch): Metres per SVG user unit.
- **`fills`** (default true): Draws fills.
- **`strokes`** (default true): Draws strokes.
- **`curveSegments`** (default 12): Segments per curve.

See the [API](API.md) for every field of the result.
