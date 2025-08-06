import type { Dispatch, State } from '@/hooks/playgroundReducer'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Textarea } from './ui/textarea'

interface Props {
    name: "furtherHints" | "styleAndTone"
    title:string
    state:State
    hoverText:string
    dispatch:Dispatch
}

export default function Hint({title, name, state, hoverText, dispatch}:Props) {
  return (
    <>
    <HoverCard openDelay={200}>
     <Card className="w-full">
    <HoverCardTrigger asChild>
      <CardHeader>
        <CardTitle className='flex flex-row justify-between'>
          {title}
        </CardTitle>
      </CardHeader>
    </HoverCardTrigger>
      <CardContent>
        <Textarea value={state.formValues[name]} onChange={({target:{value}})=>dispatch({type:"SET_FIELD",field:name, value})}/>
      </CardContent>
    </Card>
    <HoverCardContent className="w-[320px] text-sm" side="left">
        {hoverText}
    </HoverCardContent>
    </HoverCard>
    </>
  )
}
