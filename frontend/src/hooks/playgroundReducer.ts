import { criteria, type Criterion } from '@/data/criteria'
import { models } from '@/data/models'
import type { Preset } from '@/data/presets'
import { useEffect, useReducer } from 'react'

export type State = {
  formValues: FormValues
  presets: Preset[]
  selectedPresetId?: string
  errors: Errors
}

type Action =
  | { type: 'ADD_CRITERION'; value: Criterion }
  | { type: 'CHANGE_CRITERION'; name:string, value:string, key:"hint"|"scale"|"name" }
  | { type: 'REMOVE_CRITERION'; idx: number }
  | { type: 'SET_TOOL_SETTINGS'; field: keyof FormValues["toolSettings"]; value: string | number | boolean }
  | { type: 'SET_FIELD'; field: keyof FormValues; value: string }
  | { type: 'VALIDATE' }
  | { type: 'LOAD_PRESETS'; payload: Preset[] }
  | { type: 'ADD_PRESET'; payload: Preset }
  | { type: 'SELECT_PRESET'; payload: string }
  | { type: 'DELETE_PRESET'; payload: string }
  | { type: 'RESET_ERRORS' }

const defaultForm: FormValues = {
    criteria,
    styleAndTone:"- Be precise, factual, and critical.\n- Keep argument texts concise, clear and readable, and free of jargon.",
    furtherHints:"",
    toolSettings:{
        cot:false,
        criticalness:0,
        model:models[0].id,
    }
}
export type Dispatch = React.ActionDispatch<[action: Action]>

const localStorageKey = 'presets'

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.field]: action.value,
        },
      }

    case 'SET_TOOL_SETTINGS':
      return {
        ...state,
        formValues: {
          ...state.formValues,
          toolSettings: {
                ...state.formValues.toolSettings,
              [action.field]: action.value,
          }
        },
      }

    case 'ADD_CRITERION':
      return {
        ...state,
        formValues: {
          ...state.formValues,
          criteria: [
                ...state.formValues.criteria,
              action.value,
          ]
        },
      }

      case 'CHANGE_CRITERION':{
        const temp = state.formValues.criteria.find(({name})=>name==action.name)
        if (!temp) return {...state}
        temp[action.key] = action.value
        return {
          ...state,
          formValues: {
            ...state.formValues,
          },
        }}

    case 'REMOVE_CRITERION':
      return {
        ...state,
        formValues: {
          ...state.formValues,
          criteria: [...state.formValues.criteria.slice(0,action.idx),...state.formValues.criteria.slice(action.idx+1)]
        },
      }

    case 'VALIDATE': {
      const result = formSchema.safeParse(state.formValues)
      if (!result.success) {
        const newErrors: Errors = {}
        result.error.issues.forEach(err => {
          const field = err.path[0] as keyof FormValues
          newErrors[field] = err.message
        })
        return { ...state, errors: newErrors }
      }
      return { ...state, errors: {} }
    }

    case 'RESET_ERRORS':
      return { ...state, errors: {} }

    case 'LOAD_PRESETS':
      return { ...state, presets: action.payload }

    case 'ADD_PRESET': {
      const existing = state.presets.find(pr=>pr.id == action.payload.id)
      if (existing) {
        existing.values = {...existing.values, ...action.payload.values} 
        return {...state}}
      const updatedPresets = [...state.presets, action.payload]
      localStorage.setItem(localStorageKey, JSON.stringify(updatedPresets))
      return { ...state, presets: updatedPresets }
    }

    case 'SELECT_PRESET': {
      const preset = state.presets.find(p => p.id === action.payload)
      if (!preset) return state
      return {
        ...state,
        selectedPresetId: action.payload,
        formValues: preset.values,
        errors: {},
      }
    }

    case 'DELETE_PRESET': {
      const updatedPresets = state.presets.filter(p => p.id !== action.payload)
      localStorage.setItem(localStorageKey, JSON.stringify(updatedPresets))
      return {
        ...state,
        presets: updatedPresets,
        selectedPresetId:
          state.selectedPresetId === action.payload ? undefined : state.selectedPresetId,
      }
    }

    default:
      return state
  }
}

export function useFormReducer(defaultPresets: Preset[]) {
  const [state, dispatch] = useReducer(reducer, {
    formValues: defaultForm,
    errors: {},
    presets: [],
    selectedPresetId: undefined,
  })

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey)
    if (stored) {
      dispatch({ type: 'LOAD_PRESETS', payload: JSON.parse(stored) })
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify(defaultPresets))
      dispatch({ type: 'LOAD_PRESETS', payload: defaultPresets })
    }
  }, [defaultPresets])

  return { state, dispatch }
}


/** VALIDATION
 * ############################################################
 */
import { z } from 'zod'
const formSchema = z.object({
  criteria: z.array(z.object({
    name: z.string().min(1,"Cannot be empty."),
    hint: z.string().min(1, "Cannot be empty."),
    scale: z.string().min(1, "Cannot be empty.")
  })).min(1, 'At least one criterion must be specified'),
  styleAndTone: z.string().min(1, 'Cannot be empty.'),
  furtherHints: z.string(),
  toolSettings: z.object({
        cot:z.boolean(),
        criticalness:z.number(),
        model:z.enum(["gpt-3.5-turbo","gpt-4.1"])
  }),
})

export type FormValues = z.infer<typeof formSchema>
type Errors = Partial<Record<keyof FormValues, string>>
