// ApplicationTable.tsx
import api from "@/api/base";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

type Applicant = {
  slug: string;
  name: string;
};
type Chapter = {
  name: { en_GB: string };
};

type Application = {
  slug: string;
  local_id: number;
  status: string;
  submitted: string | null;
  applicant: Applicant;
  chapter: Chapter;
};

export default function ApplicationTable() {
  const [application, setApplications] = useState<Application[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("get_ideas").then((res) => setApplications(res.data));
  }, []);

  return (
    <Card className="p-6 rounded-lg border w-full">
      <CardTitle>Applications</CardTitle>
      <Separator />
      <CardContent>
        <Table className="">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {application.map((app) => (
              <TableRow
                key={app.slug}
                onClick={() => navigate(`/playground/${app.slug}`)}
              >
                <TableCell>{app.slug}</TableCell>
                <TableCell>{app.local_id}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>{app.chapter.name.en_GB}</TableCell>
                <TableCell>{app.applicant.name}</TableCell>
                <TableCell>
                  {app.submitted ? (
                    new Date(app.submitted).toLocaleString()
                  ) : (
                    <span className="text-gray-400 italic">Not submitted</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
