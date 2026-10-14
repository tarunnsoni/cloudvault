import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

import { UserButton, useUser } from '@clerk/tanstack-react-start'

import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'

export default function DriveHeader() {
  const navigate = useNavigate()
  const { isLoaded } = useUser()

  const { search = '' } = useSearch({
    from: '/drive',
  })

  const [inputValue, setInputValue] = useState(search)

  useEffect(() => {
    setInputValue(search)
  }, [search])

  const handleSearch = () => {
    const value = inputValue.trim()

    navigate({
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        search: value,
      }),
    })
  }

  const handleClear = () => {
    setInputValue('')

    navigate({
      //@ts-ignore
      search: (prev) => ({
        ...prev,
        search: '',
      }),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <SidebarTrigger className="shrink-0" />

        <Separator orientation="vertical" className="hidden h-5 sm:block" />

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span className="font-semibold">CloudVault</span>

          <span className="text-muted-foreground">/</span>

          <span className="text-muted-foreground">My Drive</span>
        </div>

        <div className="relative ml-auto w-full max-w-sm">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search files..."
            className="h-9 border-border/60 bg-muted/40 pr-9 text-sm shadow-none focus-visible:bg-background"
          />

          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
            >
              <X className="size-4" />

              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <Button type="button" onClick={handleSearch}>
          <Search />

          <span className="hidden lg:inline">Search</span>
        </Button>

        <Separator orientation="vertical" className="h-5" />

        {isLoaded ? (
          <UserButton />
        ) : (
          <Avatar>
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  )
}
