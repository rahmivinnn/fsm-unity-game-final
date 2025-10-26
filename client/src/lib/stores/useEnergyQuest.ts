import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export enum GameState {
  OpeningScene = "opening",
  MainMenu = "menu",
  Level1 = "level1",
  Level2 = "level2",
  Level3 = "level3",
  Level4 = "level4",
  EndingScene = "ending"
}

interface EnergyQuestState {
  gameState: GameState;
  keysCollected: number;
  level1CableSolved: boolean;
  level1TVSolved: boolean;
  level2Efficiency: number;
  level3Bill: number;
  quizProgress: number;
  
  changeState: (newState: GameState) => void;
  addKey: () => void;
  resetProgress: () => void;
  setLevel1CableSolved: (solved: boolean) => void;
  setLevel1TVSolved: (solved: boolean) => void;
  setLevel2Efficiency: (efficiency: number) => void;
  setLevel3Bill: (bill: number) => void;
  setQuizProgress: (progress: number) => void;
  loadProgress: () => void;
  saveProgress: () => void;
}

export const useEnergyQuest = create<EnergyQuestState>()(
  subscribeWithSelector((set, get) => ({
    gameState: GameState.OpeningScene,
    keysCollected: 0,
    level1CableSolved: false,
    level1TVSolved: false,
    level2Efficiency: 100,
    level3Bill: 0,
    quizProgress: 0,
    
    changeState: (newState: GameState) => {
      console.log(`[FSM] State transition: ${get().gameState} → ${newState}`);
      set({ gameState: newState });
      get().saveProgress();
    },
    
    addKey: () => {
      const newCount = get().keysCollected + 1;
      console.log(`[Energy Key] Collected! Total: ${newCount}/3`);
      set({ keysCollected: newCount });
      get().saveProgress();
    },
    
    resetProgress: () => {
      console.log("[Progress] Resetting all progress...");
      set({
        gameState: GameState.OpeningScene,
        keysCollected: 0,
        level1CableSolved: false,
        level1TVSolved: false,
        level2Efficiency: 100,
        level3Bill: 0,
        quizProgress: 0
      });
      localStorage.clear();
    },
    
    setLevel1CableSolved: (solved: boolean) => set({ level1CableSolved: solved }),
    setLevel1TVSolved: (solved: boolean) => set({ level1TVSolved: solved }),
    setLevel2Efficiency: (efficiency: number) => set({ level2Efficiency: efficiency }),
    setLevel3Bill: (bill: number) => set({ level3Bill: bill }),
    setQuizProgress: (progress: number) => set({ quizProgress: progress }),
    
    loadProgress: () => {
      try {
        const saved = localStorage.getItem("energyQuest");
        if (saved) {
          const data = JSON.parse(saved);
          console.log("[Progress] Loading saved progress:", data);
          set({
            gameState: data.gameState || GameState.MainMenu,
            keysCollected: data.keysCollected || 0,
            level1CableSolved: data.level1CableSolved || false,
            level1TVSolved: data.level1TVSolved || false,
            level2Efficiency: data.level2Efficiency || 100,
            level3Bill: data.level3Bill || 0,
            quizProgress: data.quizProgress || 0
          });
        }
      } catch (error) {
        console.error("[Progress] Failed to load:", error);
      }
    },
    
    saveProgress: () => {
      try {
        const state = get();
        const data = {
          gameState: state.gameState,
          keysCollected: state.keysCollected,
          level1CableSolved: state.level1CableSolved,
          level1TVSolved: state.level1TVSolved,
          level2Efficiency: state.level2Efficiency,
          level3Bill: state.level3Bill,
          quizProgress: state.quizProgress
        };
        localStorage.setItem("energyQuest", JSON.stringify(data));
        console.log("[Progress] Saved");
      } catch (error) {
        console.error("[Progress] Failed to save:", error);
      }
    }
  }))
);
