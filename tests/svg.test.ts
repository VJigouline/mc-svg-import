import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { loadSvg, SvgImportError } from '../src/index.js';
import { sample } from './files.js';

describe('SVG', () => {
  it('reads filled and stroked paths in their colours', async () => {
    const r = await loadSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><rect x="0" y="0" width="100" height="50" fill="#ff0000"/><path d="M10 10 L90 40" stroke="#0000ff" stroke-width="2" fill="none"/></svg>');
    expect(r.stats).toMatchObject({ paths: 2, fills: 1, strokes: 1 });
    expect(r.size).toEqual({ width: 100, height: 50 });
    const colors = new Set<string>();
    r.group.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
      if (m) colors.add(m.color.getHexString(THREE.SRGBColorSpace));
    });
    expect([...colors].sort()).toEqual(['0000ff', 'ff0000']);
    // One user unit is a CSS pixel, and y points up.
    expect(r.group.scale.x).toBeCloseTo(0.0254 / 96);
    expect(r.group.scale.y).toBeLessThan(0);
  });

  it('reads a drawing of stroked paths', async () => {
    const r = await loadSvg(sample('lineJoinsAndCaps.svg'));
    expect(r.stats.strokes).toBeGreaterThanOrEqual(6);
    expect(r.stats.triangles).toBeGreaterThan(1000);
  });

  // style-css-inside-defs.svg needs the browser's style sheets, which Node's DOM lacks; it is checked in a browser.
  it('reads every sample', async () => {
    for (const name of ['hexagon.svg', 'styled-paths.svg', 'multiple-css-classes.svg', 'emoji.svg', 'lineJoinsAndCaps.svg', 'zero-radius.svg']) {
      const r = await loadSvg(sample(name));
      expect(r.stats.paths, name).toBeGreaterThan(0);
    }
  });

  it('refuses files that are not SVG', async () => {
    await expect(loadSvg('hello')).rejects.toThrow(SvgImportError);
  });
});
