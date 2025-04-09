import Link from "next/link"
import { Bot, FileText, Calculator, Database, Book, Ruler } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">CiviAI</span>
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            Home
          </Link>
          <Link
            href="/openrouter-chat"
            className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full"
          >
            <Bot className="h-4 w-4" />
            CloudBot
          </Link>
          <Link
            href="/report-generator"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Report Generator
          </Link>
          <Link
            href="/load-calculator"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Load Calculator
          </Link>
          <Link
            href="/material-estimator"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Material Estimator
          </Link>
          <Link
            href="/soil-capacity"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            <Ruler className="h-4 w-4" />
            Soil Capacity
          </Link>
          <Link
            href="/is-code"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
          >
            <Book className="h-4 w-4" />
            IS Code
          </Link>
        </nav>
      </div>
    </header>
  )
} 