import { Button } from "@/components/ui/button";

interface ScanResultProps {
  scanResult: string;
  resetScan: () => void;
}

const ScanResult = ({ scanResult, resetScan }: ScanResultProps) => {
  if (!scanResult) return null;

  return (
    <div className='bg-muted p-4 rounded-md'>
      <h3 className='mb-2 font-semibold'>Scanned Result:</h3>
      <p className='break-all'>{scanResult}</p>
      <Button onClick={resetScan} className='mt-4 w-full'>
        Scan Another Code
      </Button>
    </div>
  );
};

export default ScanResult;
