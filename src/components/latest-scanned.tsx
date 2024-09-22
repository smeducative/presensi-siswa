import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type Scan = {
  id: string | number;
  result: string;
  timestamp: Date;
};

export default function LatestScanned({
  recentScans,
}: {
  recentScans?: Scan[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kehadiran Terakhir</CardTitle>
        <CardDescription>10 Daftar kehadiran terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Result</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentScans &&
              recentScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className='max-w-[200px] font-medium truncate'>
                    {scan.result}
                  </TableCell>
                  <TableCell>{scan.timestamp.toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
