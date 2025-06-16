import { ComprehensiveBiomarkerDashboard } from "@/components/comprehensive-biomarker-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-0 py-8">
        <ComprehensiveBiomarkerDashboard />
      </main>
      <footer className="w-full bg-gradient-to-r from-blue-100 via-white to-blue-100 border-t border-blue-200 py-6 mt-8">
        <div className="max-w-4xl mx-auto text-center text-sm text-blue-800">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-bold tracking-wide">EcoTown Health Analytics</span>
            <span className="text-xs text-blue-500">v2.1.0</span>
          </div>
          <p>Advanced biomarker intelligence for healthcare professionals and patients. &copy; {new Date().getFullYear()} EcoTown Health.</p>
        </div>
      </footer>
    </div>
  )
}
