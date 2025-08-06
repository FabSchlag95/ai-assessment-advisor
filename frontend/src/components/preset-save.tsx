import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function PresetSave({onSave}:{onSave:(name:string)=>void}) {
  const [name, setName] = useState("")
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Save as...</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>New preset</DialogTitle>
          <DialogDescription>
            This will save the current playground state as a new preset which you
            can access later or share with others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input onChange={e=>setName(e.target.value)} id="name" autoFocus />
          </div>
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button onClick={()=>onSave(name)} type="submit">Create</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}