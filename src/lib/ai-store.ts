import { create } from 'zustand';

interface EventDraft {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  tags?: string[];
  bannerImage?: string;
}

interface AIStore {
  eventDraft: EventDraft | null;
  setEventDraft: (draft: EventDraft) => void;
  clearEventDraft: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  eventDraft: null,
  setEventDraft: (draft) => set({ eventDraft: draft }),
  clearEventDraft: () => set({ eventDraft: null }),
}));
