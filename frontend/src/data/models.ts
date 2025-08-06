export const types = ["GPT-3", "GPT-4"] as const

export type ModelType = (typeof types)[number]

export interface Model<Type = string> {
  id: "gpt-3.5-turbo" | "gpt-4.1"
  name: string
  description: string
  strengths?: string
  type: Type
}

export const models: Model<ModelType>[] = [
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5-turbo",
    description:
      "Robust GPT-3 model.",
    type: "GPT-3",
    strengths:
      "Cheaper but also powerful.",
  },  
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    description:
      "Capable GPT Model with",
    type: "GPT-4",
    strengths:
      "Capable of CoT and critical decision-making.",
  },
]