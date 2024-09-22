import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Camera, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LatestScanned from "./latest-scanned";
import type { Scan } from "./latest-scanned";

export default function QRCodeScanner() {
  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanResult("");
    }, 5000);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      clearInterval(interval);
    };
  }, []);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;
      setIsScanning(true);
      setError("");
      setScanResult("");

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 25,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (err) {
      setError("Failed to start scanner. Please check camera permissions.");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
        })
        .catch((err) => {
          console.error("Failed to stop scanner", err);
        });
    }
  };

  const onScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    addRecentScan(decodedText);
    // stopScanning();
  };

  //   @ts-ignore dont console the scan
  const onScanFailure = (error: any) => {
    // console.warn(`Code scan error = ${error}`);
  };

  const addRecentScan = (result: string) => {
    const newScan: Scan = {
      id: Date.now(),
      result: result,
      timestamp: new Date(),
    };
    setRecentScans((prevScans) => [newScan, ...prevScans.slice(0, 9)]);
  };

  //   const clearRecentScans = () => {
  //     setRecentScans([]);
  //   };

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

            {!isScanning && !scanResult && (
              <Button onClick={startScanning} className='mb-4 w-full'>
                <Camera className='mr-2 w-4 h-4' /> Start Scanning
              </Button>
            )}

            {isScanning && (
              <Button
                onClick={stopScanning}
                variant='destructive'
                className='mb-4 w-full'>
                <X className='mr-2 w-4 h-4' /> Stop Scanning
              </Button>
            )}

            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertCircle className='w-4 h-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {scanResult && (
              <div className='bg-muted p-4 rounded-md'>
                <h3 className='mb-2 font-semibold'>Scanned Result:</h3>
                <p className='break-all'>{scanResult}</p>
                <Button
                  onClick={() => {
                    setScanResult("");
                    setError("");
                  }}
                  className='mt-4 w-full'>
                  Scan Another Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <LatestScanned recentScans={recentScans} />
      </div>
    </div>
  );
}
