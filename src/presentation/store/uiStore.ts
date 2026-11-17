import { create } from 'zustand';

interface UIState {
  isSideMenuOpen: boolean;
  isReceiptModalOpen: boolean;
  selectedReceiptUrl: string | null;
  theme: 'light' | 'dark' | 'system';
  
  openSideMenu: () => void;
  closeSideMenu: () => void;
  toggleSideMenu: () => void;
  openReceiptModal: (url: string) => void;
  closeReceiptModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSideMenuOpen: false,
  isReceiptModalOpen: false,
  selectedReceiptUrl: null,
  theme: 'system',

  openSideMenu: () => set({ isSideMenuOpen: true }),
  closeSideMenu: () => set({ isSideMenuOpen: false }),
  toggleSideMenu: () => set((state) => ({ isSideMenuOpen: !state.isSideMenuOpen })),
  openReceiptModal: (url) => set({ isReceiptModalOpen: true, selectedReceiptUrl: url }),
  closeReceiptModal: () => set({ isReceiptModalOpen: false, selectedReceiptUrl: null }),
  setTheme: (theme) => set({ theme }),
}));