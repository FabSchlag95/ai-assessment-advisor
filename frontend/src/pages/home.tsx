import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate  = useNavigate();
  return (
    <div className="flex items-center justify-center">
      <div className=" p-4 flex gap-4 border rounded-lg flex-col">
        <Button variant={"outline"} onClick={() => navigate("/good-grants")}>
          GoodGrants Applications
        </Button>
        <Button variant={"outline"} onClick={() => navigate("/upload")}>Upload Custom Applications</Button>
      </div>
    </div>
  );
}
