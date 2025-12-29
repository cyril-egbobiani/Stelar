export type ConversationPhase =
  | "opening"
  | "explore"
  | "deepen"
  | "reflect"
  | "closure";

interface PhaseDefinition {
  id: ConversationPhase;
  label: string;
  minMessages: number;
}

export const phases: PhaseDefinition[] = [
  { id: "opening", label: "Opening", minMessages: 0 },
  { id: "explore", label: "Explore", minMessages: 4 },
  { id: "deepen", label: "Deepen", minMessages: 8 },
  { id: "reflect", label: "Reflect", minMessages: 12 },
  { id: "closure", label: "Insights", minMessages: 16 },
];

export const getPhaseFromMessageCount = (count: number): ConversationPhase => {
  // Work backwards to find the highest phase we've reached
  for (let i = phases.length - 1; i >= 0; i--) {
    if (count >= phases[i].minMessages) {
      return phases[i].id;
    }
  }
  return "opening";
};

export const getPhaseIndex = (phase: ConversationPhase): number => {
  return phases.findIndex((p) => p.id === phase);
};
