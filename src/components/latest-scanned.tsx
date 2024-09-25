import dayjs from "dayjs";
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
import { Skeleton } from "./ui/skeleton";

export type Scan = {
  id: number;
  attendance_date: string;
  attendance_status: "h" | "i" | "a";
  attendance_type: "apel" | "pulang" | "datang";
  created_at: string;
  rombel: {
    id: string;
    nama: string;
  };
  rombongan_belajar_id: string;
  student: {
    student_id: string;
    fullname: string;
    nipd: string;
  };
  student_id: string;
  updated_at: string;
};

export default function LatestScanned({
  recentScans,
  isLoading,
}: {
  recentScans?: Scan[];
  isLoading: boolean;
}) {
  console.log(recentScans);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kehadiran Terakhir</CardTitle>
        <CardDescription>10 Daftar kehadiran terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className='space-y-2'>
            <Skeleton className='w-[250px] h-4' />
            <Skeleton className='w-[200px] h-4' />
          </div>
        )}

        {!isLoading && !recentScans?.length && (
          <p className='text-center text-muted-foreground'>
            Belum ada data kehadiran
          </p>
        )}

        {!isLoading && recentScans!?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentScans &&
                recentScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className='max-w-[200px] font-medium truncate'>
                      <div>{scan.student.fullname}</div>
                    </TableCell>
                    <TableCell>{scan.rombel.nama}</TableCell>
                    <TableCell>
                      {dayjs(scan.created_at)
                        .locale("id")
                        .format("HH:mm, DD MMMM")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
