import type { FormValues } from "@/hooks/playgroundReducer"
import { criteria } from '@/data/criteria'
import { models } from '@/data/models'

export interface Preset {
  id: string
  name: string
  values: FormValues
}

export const presets: Preset[] = [
  {
    id: "9cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "Default",
    values:{
        criteria,
        styleAndTone:"- Be precise, factual, and critical.\n- Keep argument texts concise, clear and readable, and free of jargon.",
        furtherHints:"",
        toolSettings:{
            cot:false,
            criticalness:0,
            model:models[0].id,
        }
    }
  },
]