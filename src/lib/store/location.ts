import { create } from "zustand";

interface LocationState {
  locationId: number | null;
  cityLabel: string | null;
  setLocation: (id: number | null, label: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  locationId: null,
  cityLabel: null,
  setLocation: (id, label) => set({ locationId: id, cityLabel: label }),
}));
