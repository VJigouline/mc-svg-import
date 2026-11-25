# SVG test files

Real SVG files that the tests load. They are unchanged copies, taken at commit `1d3772857e` of three.js.

| Files | What they cover | Source and licence |
| --- | --- | --- |
| `hexagon.svg`, `styled-paths.svg`, `multiple-css-classes.svg`, `style-css-inside-defs.svg`, `emoji.svg`, `lineJoinsAndCaps.svg`, `zero-radius.svg` | Shapes, styles, CSS, joins and caps | The three.js repository (`examples/models/svg`), under its [MIT licence](https://github.com/mrdoob/three.js/blob/dev/LICENSE); no other licence is stated for them. |

`style-css-inside-defs.svg` needs a browser's style sheets, so the tests check it in a browser rather than in Node.

These files keep their own licences. They are test data only, and are not part of the npm package, which includes only `dist`, `Documentation`, `README.md` and `LICENSE`.
