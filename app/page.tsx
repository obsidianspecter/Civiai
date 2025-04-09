import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Calculator, FileText, Building, Ruler, BookOpen, MessageSquare } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "AI Chatbot",
      description: "Get expert answers to any civil engineering question using LLaMA 3.2",
      href: "/chat",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Project Report Generator",
      description: "Generate professional PDF reports based on your project data",
      href: "/report-generator",
    },
    {
      icon: <Calculator className="h-8 w-8 text-primary" />,
      title: "Structural Load Calculator",
      description: "Calculate loads, bending moments, and shear forces for various structures",
      href: "/load-calculator",
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      title: "Material Estimator",
      description: "Estimate material quantities and costs for your construction projects",
      href: "/material-estimator",
    },
    {
      icon: <Ruler className="h-8 w-8 text-primary" />,
      title: "Soil Bearing Capacity",
      description: "Check soil bearing capacity based on test values and footing size",
      href: "/soil-capacity",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "IS Code Reference",
      description: "Quick access to Indian Standard codes with AI-powered explanations",
      href: "/is-code",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 py-10 sm:py-12 md:py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  CiviAI: Your AI-Powered Civil Engineering Assistant
                </h1>
                <p className="mx-auto max-w-[600px] text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  Simplify mix design, structural analysis, and material estimation with the power of LLaMA 3.2
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-10">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  Powerful Features for Civil Engineers
                </h2>
                <p className="mx-auto max-w-[600px] text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  Designed to streamline your workflow and enhance productivity
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <Link key={index} href={feature.href} className="block h-full">
                  <Card className="h-full transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Why Choose CiviAI?
              </h2>
              <p className="mx-auto max-w-[600px] text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Designed for students, site engineers, and designers
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Time-Saving</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Automate calculations and report generation to focus on what matters most
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Reduce human error with AI-powered calculations and standardized methodologies
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Knowledge Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Instant access to civil engineering expertise and IS code references
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Who Benefits from CiviAI?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    "CiviAI helps me understand complex concepts and prepare better reports for my assignments."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Site Engineers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    "Quick material estimations and load calculations save me hours on the construction site."
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">Design Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    "The IS code reference tool and AI chatbot help me ensure my designs meet all standards."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
