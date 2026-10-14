import { Files, Folder, Star, Trash2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { Link } from '@tanstack/react-router'

const mainNavigation = [
  {
    title: 'My Drive',
    icon: Folder,
    href: '/drive',
  },
  {
    title: 'Starred',
    icon: Star,
    href: '/drive/starred',
  },
  {
    title: 'Trash',
    icon: Trash2,
    href: '/drive/trash',
  },
]

export default function DriveSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  const handleCloseSidebarOnNavigation = () => {
    if (isMobile && openMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="CloudVault">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Files className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">CloudVault</span>

                <span className="truncate text-xs text-muted-foreground">
                  Your files
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        onClick={handleCloseSidebarOnNavigation}
                        to={item.href}
                      >
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-xl border border-border/60 bg-muted/40 p-3 group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-medium">CloudVault</p>

          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Simple cloud storage for your files.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
