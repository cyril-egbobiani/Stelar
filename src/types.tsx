export interface Message {
  id: string;
  text: string;
  sender: "user" | "stelar";
  timestamp: number;
}

export interface Report {
  summary: string;
  reasons: string[];
  insights: string;
}