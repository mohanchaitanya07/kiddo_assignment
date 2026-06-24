import '../src/components/blocks';
import { handleAction } from '../src/actions/dispatcher';
import { PAYLOADS } from '../src/data/payloads';
import { parseLayout } from '../src/registry/parseLayout';
import { useCartStore } from '../src/store/cartStore';

describe('SDUI contracts', () => {
  test('drops unknown and corrupt blocks while preserving valid siblings', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const blocks = parseLayout(PAYLOADS.default.layout);
    const ids = blocks.map((item) => item.id);

    expect(ids).toContain('hero-1');
    expect(ids).toContain('grid-toys');
    expect(ids).not.toContain('future-1');
    expect(ids).not.toContain('broken-1');

    warnSpy.mockRestore();
  });

  test('products carry declarative ADD_TO_CART actions from the payload', () => {
    const blocks = parseLayout(PAYLOADS.default.layout);
    const grid = blocks.find((item) => item.id === 'grid-snacks');

    expect(grid?.block.type).toBe('PRODUCT_GRID_2X2');
    if (grid?.block.type !== 'PRODUCT_GRID_2X2') return;

    expect(grid.block.data.products[0].addAction).toEqual({
      type: 'ADD_TO_CART',
      payload: { id: 'p1', name: 'Fruit Puffs', price: 89 },
    });
  });

  test('dispatcher updates cart state through the central action path', () => {
    useCartStore.getState().reset();

    handleAction({
      type: 'ADD_TO_CART',
      payload: { id: 'p-test', name: 'Test Product', price: 42 },
    });

    expect(useCartStore.getState().count).toBe(1);
    expect(useCartStore.getState().lines['p-test']?.qty).toBe(1);

    useCartStore.getState().reset();
  });
});
