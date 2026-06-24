import { create } from 'zustand';

interface CartLine {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  lines: Record<string, CartLine>;
  count: number;
  addItem: (item: { id: string; name: string; price: number }) => void;
  reset: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: {},
  count: 0,
  addItem: (item) =>
    set((state) => {
      const existing = state.lines[item.id];
      const nextQty = (existing?.qty ?? 0) + 1;
      return {
        lines: { ...state.lines, [item.id]: { ...item, qty: nextQty } },
        count: state.count + 1,
      };
    }),
  reset: () => set({ lines: {}, count: 0 }),
}));

export const useCartCount = (): number => useCartStore((s) => s.count);

export const useItemQty = (id: string): number =>
  useCartStore((s) => s.lines[id]?.qty ?? 0);
