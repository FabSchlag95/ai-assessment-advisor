import type { Dispatch, State } from "@/hooks/playgroundReducer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"


export function ToggleCoT({state, dispatch}:{state:State, dispatch:Dispatch}) {
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Chain-of-Thought</Label>
            </div>
            <Switch
              onCheckedChange={()=>dispatch({type:"SET_TOOL_SETTINGS", field:"cot", value:!state.formValues.toolSettings.cot})}
              checked={state.formValues.toolSettings.cot}
              id="cot"
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Temperature"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Toggle Chain-of-Thought: Easy prompt-based reasoning that may elicit deeper understanding of the task.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}