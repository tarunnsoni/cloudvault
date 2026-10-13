import {
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  RotateCcw,
  Star,
  Trash2,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import type { FileType, FileCardProps } from '#/types/index'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useDeleteFile,
  useGetFileUrl,
  useMarkFileStar,
  useMoveFileToTrash,
  useRestoreFile,
} from '#/lib/react-query/mutations/file.mutation'
import { useState } from 'react'
import { RenameDialog } from './rename-dialog'

function getFileIcon(type: FileType) {
  const icons: Partial<Record<FileType, LucideIcon>> = {
    pdf: FileText,
    image: FileImage,
    spreadsheet: FileSpreadsheet,
    archive: FileArchive,
  }

  return icons[type] || File
}

function getFileStyle(type: FileType) {
  const styles: Partial<Record<FileType, string>> = {
    pdf: 'bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400',
    image:
      'bg-violet-50 text-violet-500 dark:bg-violet-950/30 dark:text-violet-400',
    spreadsheet:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    archive:
      'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  }

  return styles[type] || 'bg-muted text-muted-foreground'
}

export default function FileCard({
  id,
  name,
  type,
  size,
  modified,
  starred = false,
  variant = 'default',
}: FileCardProps) {
  const [renameOpen, setRenameOpen] = useState(false)

  const Icon = getFileIcon(type)
  const markFileStar = useMarkFileStar()
  const moveFileToTrash = useMoveFileToTrash()
  const deleteFilePermanently = useDeleteFile()
  const restoreFile = useRestoreFile()
  const getFileUrl = useGetFileUrl()

  const handleFileStar = async () => {
    await markFileStar.mutateAsync(id)
  }

  const handleMoveFileToTrash = async () => {
    await moveFileToTrash.mutateAsync(id)
  }

  const handleFileOpen = async () => {
    const newTab = window.open('about:blank', '_blank')

    if (!newTab) {
      return
    }

    try {
      const { signedUrl } = await getFileUrl.mutateAsync(id)
      newTab.location.href = signedUrl
    } catch (error) {
      newTab.close()
      console.error('Failed to open file:', error)
    }
  }

  const handleFileDownload = async () => {
    try {
      const { signedUrl } = await getFileUrl.mutateAsync(id)

      const link = document.createElement('a')
      link.href = signedUrl
      link.download = name

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background p-3 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${getFileStyle(type)}`}
      >
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-sm font-medium">{name}</p>

          {starred && (
            <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
          )}
        </div>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {type.toUpperCase()} · {size} · {modified}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 transition-opacity opacity-100"
          >
            <MoreHorizontal className="size-4" />

            <span className="sr-only">File actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {variant === 'default' && (
            <>
              <DropdownMenuItem
                onClick={handleFileOpen}
                disabled={getFileUrl.isPending}
              >
                Open
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleFileDownload}
                disabled={getFileUrl.isPending}
              >
                Download
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                Rename
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={markFileStar.isPending}
                onClick={handleFileStar}
              >
                {starred ? 'Remove from Starred' : 'Add to Starred'}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleMoveFileToTrash}
                disabled={moveFileToTrash.isPending}
                className="text-destructive focus:text-destructive"
              >
                Move to Trash
              </DropdownMenuItem>
            </>
          )}

          {variant === 'trash' && (
            <>
              <DropdownMenuItem
                disabled={restoreFile.isPending}
                onClick={() => restoreFile.mutate(id)}
              >
                <RotateCcw />
                Restore
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={deleteFilePermanently.isPending}
                onClick={() => deleteFilePermanently.mutate(id)}
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
        id={id}
        type="file"
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={name}
      />
    </div>
  )
}
