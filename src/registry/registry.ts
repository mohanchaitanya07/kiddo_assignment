import type React from 'react';
import type { LayoutBlock, RawBlock } from '../types/sdui';

export interface BlockDefinition<T extends LayoutBlock = LayoutBlock> {
  type: T['type'];
  parse: (raw: RawBlock) => T | null;
  Component: React.ComponentType<{ block: T }>;
}

const registry = new Map<string, BlockDefinition>();

export function registerBlock<T extends LayoutBlock>(def: BlockDefinition<T>): void {
  if (registry.has(def.type)) {
    console.warn(`[registry] "${def.type}" is already registered; overwriting.`);
  }
  registry.set(def.type, def as unknown as BlockDefinition);
}

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return registry.get(type);
}
