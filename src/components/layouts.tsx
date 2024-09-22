import { ModeToggle } from "./mode-toggle";

export default function Layouts({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='flex justify-between items-center mx-auto p-4 container'>
        <div className='flex items-center'>
          <img
            src='https://smeduverse.smkdiponegoropekalongan.sch.id/dist/images/logo.png'
            alt='Logo'
            className='mr-3 w-14 h-14'
          />
          <h1 className='font-bold text-2xl'>SMK Diponegoro Karanganyar</h1>
        </div>
        <ModeToggle />
      </header>
      <main className='flex flex-col flex-grow justify-center items-center'>
        {children}
      </main>
      <footer className='mx-auto p-4 text-center container'>
        <p className='text-muted-foreground text-sm'>
          <strong>Smeducative</strong> is part of{" "}
          <span>SMK Diponegoro Karanganyar</span>
        </p>
      </footer>
    </div>
  );
}
