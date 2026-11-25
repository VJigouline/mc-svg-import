# API

## `loadSvg(input, options?)`

Reads `.svg` and returns a promise of a `SvgLoadResult`.

`input` is the file's contents (`ArrayBuffer`, `Uint8Array` or string), a browser `File`, `{ name, data }`, or an iterable of files. Zip archives among them are opened.

It throws `SvgImportError` for input that isn't SVG.

### Options

| Option | Default | Meaning |
| --- | --- | --- |
| `main` | the first .svg file | The .svg file to open, if several are given. |
| `unitScale` | 1/96 inch | Metres per SVG user unit. |
| `fills` | true | Draws fills. |
| `strokes` | true | Draws strokes. |
| `curveSegments` | 12 | Segments per curve. |

### `SvgLoadResult`

| Field | Type | Meaning |
| --- | --- | --- |
| `group` | `THREE.Group` | The model. |
| `size` | `{ width, height } \| null` | The drawing's size in user units. |
| `warnings` | `string[]` | Problems that didn't stop the import. |
| `stats` | object | Counts of meshes, triangles and the like. |

See the package's `index.d.ts` for every exported type and helper.
