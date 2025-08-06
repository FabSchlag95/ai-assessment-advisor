import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Trash2Icon } from 'lucide-react'
import type { Dispatch } from '@/hooks/playgroundReducer'

interface CriterionType {
    name:string
    hint:string
    scale:string
    dispatch:Dispatch
    remove:()=>void
}

export default function Criterion({name, hint, scale,dispatch, remove}:CriterionType) {
  return (
    <>
    <HoverCard openDelay={200}>
     <Card className="w-full">
    <HoverCardTrigger asChild>
      <CardHeader>
        <CardTitle className='flex flex-row justify-between'>
          <Input value={name} onChange={({target:{value}})=>dispatch({type:"CHANGE_CRITERION",key:"name",value,name})} className='pl-0 text-6xl' />
          <Button variant={'ghost'} size={'sm'} onClick={remove}>
            <Trash2Icon/>
          </Button>
        </CardTitle>
        <CardDescription>
            <Textarea className='border-none ml-[-12px]' onChange={({target:{value}})=>dispatch({type:"CHANGE_CRITERION",key:"hint",value,name})} value={hint}/>
        </CardDescription>
      </CardHeader>
    </HoverCardTrigger>
      <CardContent>
        <Textarea onChange={({target:{value}})=>dispatch({type:"CHANGE_CRITERION",key:"scale",value,name})} value={scale}/>
      </CardContent>
    </Card>
    <HoverCardContent className="w-[320px] text-sm" side="left">
        Give the LLM a hint and scale about what you mean by that criterion.
    </HoverCardContent>
    </HoverCard>
    </>
  )
}
