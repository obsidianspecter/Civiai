"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "AI Chat" },
    { href: "/report-generator", label: "Report Generator" },
    { href: "/load-calculator", label: "Load Calculator" },
    { href: "/material-estimator", label: "Material Estimator" },
    { href: "/soil-capacity", label: "Soil Capacity" },
    { href: "/is-code", label: "IS Code" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center space-x-4 sm:space-x-0">
        <div className="flex items-center gap-2 mr-4">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-lg sm:text-xl">CiviAI</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-center">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === route.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
          <Button 
            variant="outline" 
            size="icon" 
            className="md:hidden h-8 w-8" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <nav className="flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
