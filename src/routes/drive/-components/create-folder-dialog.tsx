import { useState } from 'react'
import { Loader2, FolderPlus } from 'lucide-react'

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

import { useCreateFolder } from '#/lib/react-query/mutations/folder.mutation'

type CreateFolderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId?: string | null
}

export default function CreateFolderDialog({
  open,
  onOpenChange,
  parentId = null,
}: CreateFolderDialogProps) {
  const [name, setName] = useState('')

  const createFolderMutation = useCreateFolder()

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const folderName = name.trim()

    if (!folderName) return

    createFolderMutation.mutate(
      {
        name: folderName,
        parentId,
      },
      {
        onSuccess: () => {
          setName('')
          onOpenChange(false)
        },
      },
    )
  }

  const handleOpenChange = (value: boolean) => {
    if (!createFolderMutation.isPending) {
      onOpenChange(value)
    }

    if (!value) {
      setName('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
              <FolderPlus className="size-5 text-muted-foreground" />
            </div>

            <DialogTitle>New folder</DialogTitle>

            <DialogDescription>
              Create a new folder to organize your files.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5">
            <label
              htmlFor="folder-name"
              className="mb-2 block text-sm font-medium"
            >
              Folder name
            </label>

            <Input
              id="folder-name"
              placeholder="e.g. Projects"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              disabled={createFolderMutation.isPending}
            />

            {createFolderMutation.isError && (
              <p className="mt-2 text-sm text-destructive">
                {createFolderMutation.error instanceof Error
                  ? createFolderMutation.error.message
                  : 'Failed to create folder'}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createFolderMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || createFolderMutation.isPending}
            >
              {createFolderMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {createFolderMutation.isPending ? 'Creating...' : 'Create folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
