import { create } from 'zustand';

// de actual plant we identofi
export const usePlantStore = create(set => ({
  plant: {},
  setPlant: (data) => set({ plant: data }),
}));

// de bob (name)
export const useBobStore = create(set => ({
  bob: "",
  setBob: (data) => set({ bob: data }),
}));

// de image list
export const useImgStore = create(set => ({
  meep: null,
  setMeep: (data) => set({ meep: data }),
}));

// hab part/img pairs (obj)
export const useBubbyStore = create(set => ({
  bubby: [],
  setBubby: (data) => set({ bubby: data }),
}));
