import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Music, ArrowUpCircle, Play, Users, BarChart3, ChevronRight, Headphones, Share2 } from "lucide-react"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-purple-300">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Appbar/>
        <Redirect/>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-purple-gradient-light">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-purple-900">
                    Let Your Audience Choose What Plays Next
                  </h1>
                  <p className="max-w-[600px] text-purple-800 md:text-xl">
                    Muzify gives your listeners the power to upvote songs and decide what plays next, creating an
                    interactive music experience everyone will love.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1 bg-purple-600 hover:bg-purple-700">
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    See Demo
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex items-center justify-center">
                <div className="relative h-[450px] w-[300px] rounded-xl bg-gradient-to-b from-purple-300/50 to-purple-400/30 p-2 shadow-xl">
                  <div className="absolute inset-0 rounded-lg border border-purple-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-full flex-col">
                      <div className="border-b p-4">
                        <h3 className="text-lg font-semibold text-purple-900">Now Playing</h3>
                      </div>
                      <div className="flex items-center gap-3 border-b p-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src="/placeholder.svg?height=48&width=48"
                            alt="Album cover"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Summer Vibes</h4>
                          <p className="text-sm text-muted-foreground">Artist Name</p>
                        </div>
                        <Play className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-3 text-lg font-semibold text-purple-900">Vote for Next</h3>
                        <div className="space-y-3">
                          {[
                            { votes: 12, title: "Dance All Night", artist: "DJ Beats" },
                            { votes: 8, title: "Sunset Dreams", artist: "Chill Waves" },
                            { votes: 5, title: "Electric Feel", artist: "Neon Lights" },
                          ].map((song, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 rounded-lg border border-purple-100 p-3 hover:bg-purple-50 transition-colors"
                            >
                              <div className="flex flex-col items-center justify-center">
                                <ArrowUpCircle className="h-6 w-6 text-purple-600" />
                                <span className="text-sm font-bold">{song.votes}</span>
                              </div>
                              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                <Image
                                  src={`/placeholder.svg?height=40&width=40`}
                                  alt="Album cover"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{song.title}</h4>
                                <p className="text-sm text-muted-foreground">{song.artist}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-600 px-3 py-1 text-sm text-white">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Interactive Music Experience</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Muzify transforms passive listening into an engaging experience where your audience feels connected
                  and involved.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <ArrowUpCircle className="h-10 w-10 text-purple-600" />,
                  title: "Democratic Voting",
                  description:
                    "Let your audience vote for the songs they want to hear next, creating a truly democratic playlist.",
                },
                {
                  icon: <Users className="h-10 w-10 text-purple-600" />,
                  title: "Audience Engagement",
                  description:
                    "Keep your listeners engaged and coming back with an interactive music experience they control.",
                },
                {
                  icon: <BarChart3 className="h-10 w-10 text-purple-600" />,
                  title: "Insights & Analytics",
                  description: "Gain valuable insights into your audience's music preferences and listening habits.",
                },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center space-y-3 rounded-lg border bg-background p-6">
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-600 px-3 py-1 text-sm text-white">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple Setup, Powerful Results
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get started in minutes and transform how your audience experiences your music.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <Music className="h-10 w-10 text-purple-600" />,
                  title: "Create Your Library",
                  description: "Upload your music or connect to your existing streaming platforms.",
                },
                {
                  icon: <Share2 className="h-10 w-10 text-purple-600" />,
                  title: "Share With Audience",
                  description: "Invite your audience with a simple link or QR code to join your music session.",
                },
                {
                  icon: <Headphones className="h-10 w-10 text-purple-600" />,
                  title: "Interactive Listening",
                  description: "Your audience votes for songs and the most popular tracks play next automatically.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center space-y-3 rounded-lg border bg-background p-6"
                >
                  <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                    {i + 1}
                  </div>
                  {step.icon}
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-center text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-600 px-3 py-1 text-sm text-white">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for your music needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  title: "Free",
                  price: "$0",
                  description: "Perfect for trying out Muzify",
                  features: [
                    "Up to 50 songs in library",
                    "Up to 25 concurrent listeners",
                    "Basic analytics",
                    "Muzify branding",
                  ],
                },
                {
                  title: "Pro",
                  price: "$19",
                  description: "For growing creators",
                  features: [
                    "Up to 500 songs in library",
                    "Up to 100 concurrent listeners",
                    "Advanced analytics",
                    "Custom branding",
                    "Priority support",
                  ],
                  highlighted: true,
                },
                {
                  title: "Premium",
                  price: "$49",
                  description: "For professional creators",
                  features: [
                    "Unlimited songs in library",
                    "Unlimited concurrent listeners",
                    "Comprehensive analytics",
                    "Custom branding",
                    "Priority support",
                    "API access",
                  ],
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`flex flex-col rounded-lg border ${
                    plan.highlighted ? "border-purple-500 shadow-lg" : "border-border"
                  } bg-background p-6`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <ChevronRight className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={plan.highlighted ? "" : "bg-muted text-muted-foreground hover:bg-muted/80"}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-gradient-light">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to transform your music experience?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of creators who are engaging their audience with Muzify.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button size="lg" className="gap-1">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Music className="h-5 w-5 text-purple-600" />
            <span>Muzify</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Muzify. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

