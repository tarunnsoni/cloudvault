import { Folder, MoreHorizontal, RotateCcw, Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  useMarkFolderStar,
  useMoveFolderToTrash,
  usePermanentlyDeleteFolder,
  useRestoreFolder,
} from '#/lib/react-query/mutations/folder.mutation'
import { useState } from 'react'
import { RenameDialog } from './rename-dialog'
import { Link } from '@tanstack/react-router'
import type { FolderCardProps } from '#/types'

export default function FolderCard({
  id,
  name,
  items,
  isStarred,
  variant = 'default',
}: FolderCardProps) {
  const [renameOpen, setRenameOpen] = useState(false)

  const markFolderStar = useMarkFolderStar()
  const moveFolderToTrash = useMoveFolderToTrash()
  const deleteFolderPermanently = usePermanentlyDeleteFolder()
  const restoreFolder = useRestoreFolder()

  const handleStarFolder = async () => {
    await markFolderStar.mutateAsync(id)
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <Folder className="size-5 fill-current/10" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-sm font-medium">{name}</p>

          {isStarred && (
            <Star
              className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400"
              aria-label="Starred"
            />
          )}
        </div>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {items} {items === 1 ? 'item' : 'items'}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <MoreHorizontal className="size-4" />

            <span className="sr-only">Folder actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {variant === 'default' && (
            <>
              <DropdownMenuItem asChild>
                <Link to={'/drive/folders/$folderId'} params={{ folderId: id }}>
                  Open
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                Rename
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={markFolderStar.isPending}
                onClick={handleStarFolder}
              >
                {isStarred ? 'Unstar' : 'Star'}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={moveFolderToTrash.isPending}
                onClick={() => moveFolderToTrash.mutate(id)}
                className="text-destructive focus:text-destructive"
              >
                Move to Trash
              </DropdownMenuItem>
            </>
          )}

          {variant === 'trash' && (
            <>
              <DropdownMenuItem
                disabled={restoreFolder.isPending}
                onClick={() => restoreFolder.mutate(id)}
              >
                <RotateCcw />
                Restore
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={deleteFolderPermanently.isPending}
                onClick={() => deleteFolderPermanently.mutate(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 />
                Delete permanently
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        id={id}
        currentName={name}
        type="folder"
      />
    </div>
  )
}
