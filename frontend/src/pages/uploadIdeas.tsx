import { AppContext } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Row } from "@/types";
import { UploadIcon } from "lucide-react";
import Papa from "papaparse";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();
  const { setIdeas } = useContext(AppContext);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Row>(file, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      complete: (res: { data: Row[] }) => {
        const rows = (res.data as Row[]) || [];
        if (setIdeas) setIdeas(rows);
        if (rows.length) navigate("/uploaded-ideas");
      },
    });
  }

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 flex">
            <UploadIcon />{" "}
            <Input type="file" accept=".csv" onChange={handleFile} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
