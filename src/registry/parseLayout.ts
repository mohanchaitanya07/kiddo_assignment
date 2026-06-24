import type { LayoutBlock, RawBlock } from '../types/sdui';
import { getBlockDefinition, type BlockDefinition } from './registry';

export interface RenderableBlock {
  id: string;
  block: LayoutBlock;
  Component: BlockDefinition['Component'];
}

const warned = new Set<string>();
function warnOnce(key: string, msg: string): void {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(msg);
}

export function parseLayout(raw: RawBlock[]): RenderableBlock[] {
  if (!Array.isArray(raw)) return [];

  const out: RenderableBlock[] = [];

  for (const node of raw) {
    if (!node || typeof node.type !== 'string') {
      warnOnce('no-type', '[parseLayout] dropped a node with no string "type".');
      continue;
    }

    const def = getBlockDefinition(node.type);
    if (!def) {
      warnOnce(`unknown:${node.type}`, `[parseLayout] dropped unknown block type "${node.type}".`);
      continue;
    }

    const block = def.parse(node);
    if (!block) {
      warnOnce(`bad:${node.type}:${node.id ?? '?'}`, `[parseLayout] dropped corrupt "${node.type}" block.`);
      continue;
    }

    out.push({ id: block.id, block, Component: def.Component });
  }

  return out;
}
