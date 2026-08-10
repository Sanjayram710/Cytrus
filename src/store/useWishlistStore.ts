import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItemStore {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  comparePrice?: number | null;
  category?: string;
}

interface WishlistStore {
  items: WishlistItemStore[];
  toggleWishlist: (item: WishlistItemStore) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== item.productId),
          }));
        } else {
          set((state) => ({
            items: [...state.items, item],
          }));
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'luxewear_wishlist_storage',
    }
  )
);
