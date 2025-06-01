export function WrapperContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex bg-gray-50 font-[family-name:var(--font-geist-sans)]`}>
      {children}
    </div>
  );
}
