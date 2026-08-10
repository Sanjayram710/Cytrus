import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemStore {
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItemStore[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItemStore, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      couponDiscount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
          );

          const quantityToAdd = newItem.quantity || 1;

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantityToAdd;
            return { items: updated, isOpen: true };
          } else {
            return {
              items: [
                ...state.items,
                {
                  ...newItem,
                  quantity: quantityToAdd,
                },
              ],
              isOpen: true,
            };
          }
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: '', couponDiscount: 0 });
      },

      clearCart: () => {
        set({ items: [], couponCode: '', couponDiscount: 0 });
      },

      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getCartItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'cytrus_cart_storage',
    }
  )
);
