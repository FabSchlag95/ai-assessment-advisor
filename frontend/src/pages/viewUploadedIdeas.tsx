import { AppContext } from "@/App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext, type Key } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const { ideas } = useContext(AppContext);
  const navigate = useNavigate();

  if (!ideas || ideas.length === 0) return <p>No data available</p>;

  const columns = Object.keys(ideas[0]).slice(0,7);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col} className="capitalize">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideas.map((row, i: Key | null | undefined) => (
            <TableRow
              key={i}
              onClick={() =>
                navigate(`/playground/${row.Slug??row.ID??Object.values(row)[0]}`, { state: row })
              }
            >
              {columns.map((col) => (
                <TableCell className="whitespace-pre-wrap" key={col+i}>
                  {String(row[col])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
