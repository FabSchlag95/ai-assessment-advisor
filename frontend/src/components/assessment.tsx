'use client'

import { AwardIcon } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../api/base.ts"
import type { ToolOutput } from "../types.ts"
import { Card, CardContent, CardHeader } from "./ui/card.tsx"
import { scrollToElementById } from "@/helper/helper.ts"

const gradeColorMapping:Record<number,string> = {
  1:"#FF1414",
  2:"#FF8E14",
  3:"#FFC014",
  4:"#E8FF14",
  5:"#71FF12"
}

export default function Assessment() {

  const [toolOutput,setToolOutput] = useState<ToolOutput|null>(null)
  const [currentEvidenceState, setCurrentEvidenceState] = useState({
    activeSegmentId:"",
    localEvidenceIdx:0,
    argumentsEvidence:[0],
    argument:""
  })

  const handleArgumentClick = (argument:string,evidenceIdxs:number[]) => {
   let activeSegmentId =""
   let localEvidenceIdx = 0
   const argumentsEvidence = evidenceIdxs
    if (argument != currentEvidenceState.argument) {
       activeSegmentId = `segment-${evidenceIdxs[localEvidenceIdx]}`
    } else {
      
       localEvidenceIdx = currentEvidenceState.localEvidenceIdx<(evidenceIdxs.length-1)?currentEvidenceState.localEvidenceIdx+1:0
       activeSegmentId = `segment-${evidenceIdxs[localEvidenceIdx]}`
      }
    setCurrentEvidenceState({argument, localEvidenceIdx, activeSegmentId,argumentsEvidence})
    scrollToElementById(activeSegmentId)
  }

  useEffect(()=>{
    api.get("/dummy").then(res=>{
      let data:ToolOutput = res.data
      data = {...data,idea_fields: data.idea_fields.filter(field=>field.field_name!="slug")}
      setToolOutput(data)
    }).catch(err=>console.log(err))
  },[])

  return <div className="h-full max-h-[88vh] flex">

     {/* left side: Assessment */}
     <div className="h-full overflow-y-auto flex flex-col gap-4 p-4 w-1/2">
      {toolOutput&&Object.entries(toolOutput.assessment ?? {}).map(([criterion, evaluation])=>{
        return <Card key={criterion}>
            <CardHeader className="flex justify-between" >
              <h3 className="text-xl font-bold">{criterion}</h3>
              <div className="flex p-2 rounded-md opacity-90" style={{
                backgroundColor:gradeColorMapping[evaluation.rating]
              }}>
                <p className="font-bold">{evaluation.rating}</p>
                <AwardIcon/>
              </div>
            </CardHeader>
            <CardContent className="relative flex flex-col">
              <ol>
                {evaluation.arguments.map((arg,i)=><span key={arg.text+i}>
                  <span className="hover:bg-amber-300 cursor-pointer" onClick={()=>{
                    handleArgumentClick(arg.text, arg.evidence)
                  }} >{arg.text}</span>
                  {" "}
                  </span>
                )}
              </ol>
              <div className="ml-auto right-4 bottom-0 font-semibold text-sm h-2 opacity-80">
                {evaluation.arguments.map(a=>a.text).includes(currentEvidenceState.argument)?currentEvidenceState.argumentsEvidence.length?<span>
                {currentEvidenceState.localEvidenceIdx+1}/{currentEvidenceState.argumentsEvidence.length+" evidence"}
                </span>:
                "no evidence":""}
                </div>
            </CardContent>
          </Card>
      })}

     </div>

     {/* right side: Idea Text */}
     <div className="h-full overflow-y-auto flex flex-col gap-4 p-4 w-1/2">
      {toolOutput&&toolOutput.idea_fields.map(({field_name,first_index,segments})=>{
        return <Card key={field_name} className={"border-0 rounded-none shadow-none border-b-2 "}>
            <CardHeader className="flex" >
              <h3 className={"font-bold "+(field_name.toLowerCase()=="title"?"text-2xl":"text-xl")}>{
                field_name.toLowerCase()=="title"?
                "Title: "+segments.join():
                field_name.charAt(0).toUpperCase()+field_name.slice(1)
              }</h3>
            </CardHeader>
            <CardContent className="flex gap-2">
              <p className="whitespace-pre-wrap">
                {
                  field_name.toLowerCase()!="title"&&
                  segments.map((segment,i)=>{
                  const id = `segment-${first_index+i}`
                  const isInCurrentEvidence = currentEvidenceState.argumentsEvidence.includes(first_index+i)
                  return <span style={{backgroundColor:currentEvidenceState.activeSegmentId==id?"#ffd230":isInCurrentEvidence?"lightgrey":""}} key={first_index+i} id={id}>{segment+"\n"}</span>})
                }
              </p>
            </CardContent>
          </Card>
      })}
     </div>
  </div>
}


