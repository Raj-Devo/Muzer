"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music, ArrowUpCircle, Play, Users, BarChart3, ChevronRight, Headphones, Share2 } from "lucide-react"
export function Appbar () {
const session = useSession();

    return <div >
                <div className=" bg-purple-400 container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Music className="h-6 w-6 text-purple-600" />
            <span>Muzify</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              {session.data?.user && <Button className="gap-1 bg-purple-600 hover:bg-purple-700" onClick={()=> signOut()}>Logout</Button> }
              {!session.data?.user && <Button className="gap-1 bg-purple-600 hover:bg-purple-700" onClick={()=> signIn()}>Signin</Button> }
            </nav>
          </div>
        </div>
    </div>
}


