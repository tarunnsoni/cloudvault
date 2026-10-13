import { useEffect, useState } from 'react'
import { Loader2, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useRenameFile } from '#/lib/react-query/mutations/file.mutation'
import { useRenameFolder } from '#/lib/react-query/mutations/folder.mutation'

type RenameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
  currentName: string
  type: 'file' | 'folder'
}

export function RenameDialog({
  open,
  onOpenChange,
  id,
  currentName,
  type,
}: RenameDialogProps) {
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const renameFileMutation = useRenameFile()
  const renameFolderMutation = useRenameFolder()

  const isPending =
    renameFileMutation.isPending || renameFolderMutation.isPending

  useEffect(() => {
    if (open) {
      setName(currentName)
      setErrorMessage(null)
    }
  }, [open])

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newName = name.trim()

    if (!newName) {
      setErrorMessage('Name is required')
      return
    }

    if (newName === currentName) {
      setErrorMessage('Enter a different name')
      return
    }

    setErrorMessage(null)

    try {
      if (type === 'file') {
        await renameFileMutation.mutateAsync({
          id,
          name: newName,
        })
      } else {
        await renameFolderMutation.mutateAsync({
          id,
          name: newName,
        })
      }

      onOpenChange(false)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : `Failed to rename ${type}`,
      )
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (isPending) return

    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
              <Pencil className="size-5 text-muted-foreground" />
            </div>

            <DialogTitle>Rename {type}</DialogTitle>

            <DialogDescription>
              Enter a new name for this {type}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5">
            <label
              htmlFor="rename-input"
              className="mb-2 block text-sm font-medium"
            >
              New name
            </label>

            <Input
              id="rename-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isPending}
              autoFocus
            />

            {errorMessage && (
              <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}

              {isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
