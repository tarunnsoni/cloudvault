import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Product Showcase', href: '#showcase' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '#hero' },
      { label: 'Get Started', href: '#hero' },
    ],
  },
  {
    title: 'Support',
    links: [{ label: 'Help Center', href: '#help' }],
  },
]

export default function Footer() {
  return (
    <footer className="w-full px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        className="
          mx-auto w-full max-w-7xl
          rounded-3xl
          bg-primary
          px-6 py-8
          text-primary-foreground
          shadow-xl shadow-primary/10
          sm:px-10 sm:py-10
          lg:px-12
        "
      >
        <div
          className="
            flex flex-col gap-10
            lg:flex-row lg:justify-between
          "
        >
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center">
              <span className="text-xl font-semibold tracking-tight sm:text-2xl">
                CloudVault
                <span className="ml-1 inline-block size-2 rounded-full bg-green-300" />
              </span>
            </Link>

            <p className="mt-3 text-sm leading-6 text-primary-foreground/70">
              Simple and secure cloud storage for your files, documents, and
              memories.
            </p>

            <div
              className="
                mt-5 inline-flex items-center gap-2
                rounded-full border border-primary-foreground/20
                bg-primary-foreground/10
                px-3 py-1.5
                text-xs text-primary-foreground/90
              "
            >
              <span className="size-1.5 rounded-full bg-green-300" />
              CloudVault is available for everyone
            </div>
          </div>

          <div
            className="
              grid grid-cols-2 gap-x-10 gap-y-8
              sm:grid-cols-3 sm:gap-x-14
            "
          >
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold">{group.title}</h3>

                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="
                          text-sm
                          text-primary-foreground/65
                          transition-colors
                          hover:text-primary-foreground
                        "
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/15 pt-5">
          <div
            className="
              flex flex-col gap-4
              text-xs text-primary-foreground/60
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <p>© {new Date().getFullYear()} CloudVault. All rights reserved.</p>

            <div className="flex items-center gap-5">
              <a
                href="#privacy"
                className="transition-colors hover:text-primary-foreground"
              >
                Privacy
              </a>

              <a
                href="#terms"
                className="transition-colors hover:text-primary-foreground"
              >
                Terms
              </a>

              <a
                href="mailto:xyz@cloudvault.com"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary-foreground"
              >
                <Mail className="size-3.5" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
