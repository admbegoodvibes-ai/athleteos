export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mb-8 text-center">
        <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
          AthleteOS
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inteligência de Performance
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
