import { SignUpButton, useAuth } from '@clerk/tanstack-react-start'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import HeaderUser from '#/integrations/clerk/header-user'
import { Link } from '@tanstack/react-router'

export default function Header() {
  const { isSignedIn } = useAuth()

  return (
    <header className="relative z-50 w-full px-3 pt-3 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 rounded-2xl border border-border/60 bg-background/95 px-3 shadow-lg shadow-black/5 backdrop-blur sm:h-20 sm:px-7">
        <Link to='/' className="min-w-0 shrink-0">
          <span
            className="
              text-lg font-semibold tracking-tight
              sm:text-2xl
            "
          >
            CloudVault
            <span className="ml-1 inline-block size-1.5 rounded-full bg-primary sm:size-2" />
          </span>
        </Link>

        <div
          className="
            flex min-w-0 shrink-0
            items-center
            gap-0.5
            sm:gap-3
          "
        >
          <HeaderUser />

          {!isSignedIn && (
            <SignUpButton mode="modal">
              <Button className="h-8 shrink-0 rounded-full px-2.5 text-xs font-medium shadow-sm sm:h-10 sm:px-6 sm:text-sm">
                <span className="sm:hidden">Get Started</span>
                <span className="hidden sm:inline">Get Started Free</span>
                <ArrowRight
                  className="
                  ml-1
                  size-3.5
                  sm:ml-2
                  sm:size-4
                "
                />
              </Button>
            </SignUpButton>
          )}
        </div>
      </div>
    </header>
  )
}
