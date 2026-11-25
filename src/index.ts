import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { countModel, ImportFiles, type ImportInput, type ImportStats } from './common.js';

export { ImportFiles, countModel } from './common.js';
export type { ImportInput, ImportFile, ImportData, ImportStats } from './common.js';

export interface SvgOptions {
  /** The .svg file to open, if several are given. By default, the first. */
  main?: string;
  /** Metres per SVG user unit. The default treats one unit as a CSS pixel, 1/96 inch. */
  unitScale?: number;
  /** Draws fills. Default true. */
  fills?: boolean;
  /** Draws strokes. Default true. */
  strokes?: boolean;
  /** Segments per curve. Default 12. */
  curveSegments?: number;
}

export interface SvgLoadResult {
  /** The drawing as flat shapes in the XY plane, facing +Z, in metres, the right way up. */
  group: THREE.Group;
  /** Size in user units, from the viewBox or width and height; null if the file gives neither. */
  size: { width: number; height: number } | null;
  warnings: string[];
  stats: SvgStats;
}

export interface SvgStats extends ImportStats {
  /** SVG paths read. */
  paths: number;
  fills: number;
  strokes: number;
}

export class SvgImportError extends Error {
  override name = 'SvgImportError';
}

const PIXEL = 0.0254 / 96;

/** Reads an SVG drawing into filled and stroked shapes. */
export async function loadSvg(input: ImportInput, options: SvgOptions = {}): Promise<SvgLoadResult> {
  const files = await ImportFiles.from(input, 'drawing.svg');
  const main = files.main(['svg'], options.main) ?? files.files[0];
  if (!main) throw new SvgImportError('There is no .svg file to open');
  const text = files.text(main);
  if (!/<svg[\s>]/i.test(text)) throw new SvgImportError(`${main.name} is not an SVG file`);
  const data = new SVGLoader().parse(text);
  const warnings: string[] = [];
  const drawing = new THREE.Group();
  const segments = options.curveSegments ?? 12;
  const stats = { paths: data.paths.length, fills: 0, strokes: 0 };
  const materials = new Map<string, THREE.MeshBasicMaterial>();
  const material = (color: THREE.Color, opacity: number) => {
    const key = `${color.getHexString()}/${opacity}`;
    let m = materials.get(key);
    if (!m) {
      m = new THREE.MeshBasicMaterial({ name: `#${color.getHexString()}`, color, opacity, transparent: opacity < 1, side: THREE.DoubleSide, depthWrite: opacity >= 1 });
      materials.set(key, m);
    }
    return m;
  };
  let order = 0;
  for (const path of data.paths) {
    const style = (path.userData?.style ?? {}) as Record<string, string | number>;
    const fill = style.fill as string | undefined;
    if ((options.fills ?? true) && fill && fill !== 'none' && fill !== 'transparent') {
      const color = new THREE.Color().setStyle(fill);
      const opacity = Number(style.fillOpacity ?? 1) * Number(style.opacity ?? 1);
      for (const shape of SVGLoader.createShapes(path)) {
        const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape, segments), material(color, opacity));
        // Later paths are drawn over earlier ones.
        mesh.renderOrder = order;
        mesh.position.z = order * 1e-3;
        mesh.name = (path.userData?.node as Element | undefined)?.id || 'fill';
        drawing.add(mesh);
        stats.fills++;
      }
      order++;
    }
    const stroke = style.stroke as string | undefined;
    if ((options.strokes ?? true) && stroke && stroke !== 'none' && stroke !== 'transparent') {
      const color = new THREE.Color().setStyle(stroke);
      const opacity = Number(style.strokeOpacity ?? 1) * Number(style.opacity ?? 1);
      for (const sub of path.subPaths) {
        const geometry = SVGLoader.pointsToStroke(sub.getPoints(segments), style as never);
        if (!geometry) continue;
        const mesh = new THREE.Mesh(geometry, material(color, opacity));
        mesh.renderOrder = order;
        mesh.position.z = order * 1e-3;
        mesh.name = (path.userData?.node as Element | undefined)?.id || 'stroke';
        drawing.add(mesh);
        stats.strokes++;
      }
      order++;
    }
  }
  if (/<text[\s>]/i.test(text)) warnings.push('Text is not drawn');
  if (/<image[\s>]/i.test(text)) warnings.push('Embedded images are not drawn');
  if (/<(linearGradient|radialGradient|pattern)[\s>]/i.test(text)) warnings.push('Gradients and patterns are drawn in solid colours');

  // SVG's y axis points down; three.js's up.
  const viewBox = /<svg\b[^>]*\bviewBox\s*=\s*"([^"]+)"/i.exec(text)?.[1]?.trim().split(/[\s,]+/).map(Number);
  const width = Number(/<svg\b[^>]*\bwidth\s*=\s*"([\d.]+)/i.exec(text)?.[1]);
  const height = Number(/<svg\b[^>]*\bheight\s*=\s*"([\d.]+)/i.exec(text)?.[1]);
  const size = viewBox && viewBox.length === 4 && viewBox.every(Number.isFinite) ? { width: viewBox[2]!, height: viewBox[3]! } : Number.isFinite(width) && Number.isFinite(height) ? { width, height } : null;
  const name = main.name.replace(/\\/g, '/').split('/').pop()!.replace(/\.svg$/i, '');
  const group = new THREE.Group();
  group.name = name;
  const scale = options.unitScale ?? PIXEL;
  group.scale.set(scale, -scale, scale);
  group.add(drawing);
  return { group, size, warnings, stats: { ...countModel(group), ...stats } };
}
