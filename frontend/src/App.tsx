import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Assessment from "@/pages/assessment";
import Ideas from "@/pages/goodGrantsIdeas";
import Playground from "@/pages/playground";
import Home from "@/pages/home";
import Upload from "@/pages/uploadIdeas";
import UploadedIdeas from "@/pages/viewUploadedIdeas";
import { ArrowLeft, HomeIcon, List } from "lucide-react";
import { Button } from "./components/ui/button";
import { createContext, useState } from "react";
import type { Row } from "./types";

type AppContextType = {
  ideas?: Row[];
  setIdeas?: (ideas: Row[]) => void;
};

export const AppContext = createContext<AppContextType>({});

function App() {
  const [ideas, setIdeas] = useState<Row[]>([]);

  return (
    <AppContext.Provider value={{ ideas, setIdeas }}>
      <Router>
        <Header />
        <div className="layout">
          <Routes>
            {/*main screen */}
            <Route path="/" element={<Home />} />
            {/*upload screen */}
            <Route path="/upload" element={<Upload />} />
            <Route path="/uploaded-ideas" element={<UploadedIdeas />} />
            {/* List of ideas page */}
            <Route path="/good-grants" element={<Ideas />} />

            {/* Playground page */}
            <Route path="/playground/:slug" element={<Playground />} />

            {/* Assessment Page */}
            <Route
              path="/playground/:slug/assessment"
              element={<Assessment />}
            />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <header
      className={
        "flex w-screen fixed top-0 left-0 border bg-muted p-4 z-10 items-center -translate-y-4/5 hover:translate-y-0 transition-transform " +
        (pathname === "/" ? "translate-y-0" : "")
      }
    >
      {pathname.includes("playground") && (
        <Button variant={"ghost"} onClick={() => navigate("/uploaded-ideas")}>
          <ArrowLeft />
          <List/>
        </Button>
      )}
      <Button variant={"ghost"} onClick={() => navigate("/")}>
        <HomeIcon />
      </Button>
      <h1>AI-Assessment-Advisor</h1>
    </header>
  );
};
