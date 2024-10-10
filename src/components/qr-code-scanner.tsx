import { useState, useRef, useEffect } from "react";
// import { Html5Qrcode } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LatestScanned from "./latest-scanned";
import ScannerControls from "./qr-code-scanner-controls";
// import ScanResult from "./qr-code-results";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function QRCodeScanner() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  // const [recentScanssetRecentScans] = useState<Scan[]>([]);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [selectedCamera, setSelectedCamera] = useState("");
  const scannerRef = useRef<any | null>(null);

  const queryClient = useQueryClient();

  const scanning = useMutation({
    mutationFn: (result: string) => sendToServer(result),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recentScans"],
      });
    },
  });

  const { data: recentScansData, isLoading } = useQuery({
    queryKey: ["recentScans"],
    queryFn: () =>
      api
        .get("/api/attendance/apel/latest")
        .then((res) => res.data.attendances.data),
  });

  // useEffect(() => {
  //   return () => {
  //     // if (scannerRef.current) {
  //     //   scannerRef.current.clear();
  //     // }
  //   };
  // }, []);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        }
      } catch (err) {
        console.error("Error getting cameras", err);
        setError("Failed to get camera list. Please check camera permissions.");
      }
    };

    getCameras();
  }, []);

  const sendToServer = async (result: string) => {
    return api
      .post("/api/attendance/apel/store", {
        nis: result,
      })
      .then((res) => {
        if (res.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Selamat Datang!!",
            text: res.data.message,
            // timer for 5 seconds
            timer: 3000,
            // auto close
            showConfirmButton: false,
            // no button
          }).then(() => {
            // resume scanning
            resumeScanning();
            // clear result
            setScanResult("");
          });

          console.log(res.data);
        }

        return res.data;
      })
      .catch((err) => {
        console.log(err);

        if (err.response.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.message,
            // timer for 5 seconds
            timer: 3000,
            // auto close
            showConfirmButton: false,
            // no button
          }).then(() => {
            setTimeout(() => {
              resumeScanning();
              setScanResult("");
            }, 2000);
          });
        }
      });
  };

  const startScanning = async () => {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      scannerRef.current.clear();

      setIsScanning(true);
      setError("");
      setScanResult("");

      await scanner.start(
        { deviceId: selectedCamera },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (err: unknown) {
      setError(
        "Failed to start scanner. Please check camera permissions." + err
      );
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setIsScanning(false);
      });
    }
  };

  const pauseScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.pause();
      setIsScanning(false);
    }
  };

  const resumeScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.resume();
      setIsScanning(true);
    }
  };

  const onScanSuccess = (decodedText: string) => {
    if (scanResult !== decodedText) {
      setScanResult(decodedText);
      // addRecentScan(decodedText);

      pauseScanning();

      scanning.mutate(decodedText);
    }
  };

  // @ts-expect-error ignore for now
  const onScanFailure = (error: any) => {
    // Ignore scan errors
  };

  // const addRecentScan = (result: string) => {
  //   const newScan: Scan = {
  //     id: Date.now(),
  //     result: result,
  //     timestamp: new Date(),
  //   };
  //   // setRecentScans((prevScans) => [newScan, ...prevScans.slice(0, 9)]);
  // };

  return (
    <div className='mx-auto p-4 max-w-6xl container'>
      <div className='gap-4 grid md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Presensi</CardTitle>
            <CardDescription>
              Scan QR Code untuk melakukan Presensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div id='reader' className='mb-4' style={{ width: "100%" }}></div>

            <div className='mb-4'>
              <Label htmlFor='camera-select'>Select Camera</Label>
              <Select
                value={selectedCamera}
                onValueChange={setSelectedCamera}
                disabled={isScanning}>
                <SelectTrigger id='camera-select' className='w-full'>
                  <SelectValue placeholder='Select a camera' />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ScannerControls
              isScanning={isScanning}
              startScanning={startScanning}
              stopScanning={stopScanning}
            />

            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertCircle className='w-4 h-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* <ScanResult 
              scanResult={scanResult}
              resetScan={() => {
                setScanResult("");
                setError("");
              }}
            />
                */}
          </CardContent>
        </Card>

        <LatestScanned recentScans={recentScansData} isLoading={isLoading} />
      </div>
    </div>
  );
}
