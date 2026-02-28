export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-md min-h-screen bg-base-100 shadow-xl relative">
        {children}
      </div>
    </div>
  );
}
