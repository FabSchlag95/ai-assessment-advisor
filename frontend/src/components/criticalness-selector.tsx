"use client"


import type { Dispatch, State } from "@/hooks/playgroundReducer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"

interface CriticalnessSelectorProps {
  state:State,
  dispatch: Dispatch
}

export function CriticalnessSelector({
  state,
  dispatch
}: CriticalnessSelectorProps) {

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="criticalness">Criticalness</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {[state.formValues.toolSettings.criticalness]}
              </span>
            </div>
            <Slider
              id="criticalness"
              max={3}
              min={0}
              value={[state.formValues.toolSettings.criticalness]}
              step={1}
              onValueChange={(value)=>dispatch({type:"SET_TOOL_SETTINGS",field:"criticalness",value:value[0]})}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Criticalness"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Controls how critical the model's respond is. But consider that this is not deterministic and different models may react differently to this property.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}