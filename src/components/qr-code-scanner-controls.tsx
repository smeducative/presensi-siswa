import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";

interface ScannerControlsProps {
  isScanning: boolean;
  startScanning: () => void;
  stopScanning: () => void;
}

const ScannerControls = ({
  isScanning,
  startScanning,
  stopScanning,
}: ScannerControlsProps) => {
  return (
    <>
      {!isScanning && (
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
    </>
  );
};

export default ScannerControls;
