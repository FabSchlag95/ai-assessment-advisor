import { useState } from "react"
import Assessment from "./components/assessment"
import Ideas from "./components/Ideas"
import Playground from "./components/Playground"
import api from "./api/base"

function App() {
  const [ideaData, setIdeaData] = useState(null)

  const fetchIdeaData = (slug:string) => {
    api.get("get_idea",{params:{slug}}).then(res=>setIdeaData(res.data)).catch(err=>console.error(err))
  }

  console.log(ideaData)

  return (
    <div className="layout">
    {/* <IdeaForm onSubmit={(data)=>{console.log(data)}}/> */}
    {/* <Assessment/> */}
      {!ideaData && <Ideas fetchIdeaData={fetchIdeaData}/>}
      {!!ideaData && <Playground ideaData={ideaData}/>}
    </div>
  )
}

export default App
