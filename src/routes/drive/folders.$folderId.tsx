import { Skeleton } from '#/components/ui/skeleton'
import {
  useChildFolders,
  useFolder,
} from '#/lib/react-query/queries/folder.query'
import { useFolderFiles } from '#/lib/react-query/queries/file.query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, FolderOpen, FolderPlus } from 'lucide-react'
import { UploadFileButton } from './-components/upload-file-button'
import CreateFolderDialog from './-components/create-folder-dialog'
import { Button } from '#/components/ui/button'
import FolderCard from './-components/folder-card'
import FileCard from './-components/file-card'
import { toFileCardProps } from '#/utils/file'
import { useState } from 'react'

export const Route = createFileRoute('/drive/folders/$folderId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { folderId } = Route.useParams()

  const [open, setOpen] = useState<boolean>(false)

  const {
    data: folder,
    isLoading: folderLoading,
    isError: folderError,
  } = useFolder(folderId)

  const { data: folders = [], isLoading: foldersLoading } =
    useChildFolders(folderId)

  const { data: files = [], isLoading: filesLoading } = useFolderFiles(folderId)

  const isLoading = folderLoading || foldersLoading || filesLoading

  if (isLoading) {
    return <FolderPageSkeleton />
  }

  if (folderError || !folder) {
    return (
      <main className="flex-1 p-4 sm:p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Folder not found.
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/drive' })}
          >
            <ArrowLeft />
            <span className="sr-only">Back to My Drive</span>
          </Button>

          <div className="flex items-center gap-2">
            <FolderOpen className="size-5 text-muted-foreground" />

            <div>
              <h1 className="text-xl font-semibold">{folder.name}</h1>

              <p className="text-sm text-muted-foreground">
                {folders.length + files.length} items
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setOpen(true)}
          >
            <FolderPlus className="size-4" />

            <span className="hidden sm:inline">New folder</span>

            <span className="sm:hidden">Folder</span>
          </Button>

          <UploadFileButton folderId={folderId} />
        </div>
      </div>

      {folders.length === 0 && files.length === 0 && (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
            <FolderOpen className="size-5 text-muted-foreground" />
          </div>

          <h2 className="font-medium">This folder is empty</h2>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            Create a folder or upload a file to get started.
          </p>
        </div>
      )}

      {(folders.length > 0 || files.length > 0) && (
        <div className="space-y-8">
          {folders.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                Folders
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    id={folder.id}
                    name={folder.name}
                    items={folder.files.length + folder.folders.length}
                    isStarred={folder.is_starred}
                  />
                ))}
              </div>
            </section>
          )}

          {files.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                Files
              </h2>

              <div className="space-y-2">
                {files.map((file) => (
                  <FileCard key={file.id} {...toFileCardProps(file)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <CreateFolderDialog
        open={open}
        onOpenChange={setOpen}
        parentId={folder.id}
      />
    </main>
  )
}

function FolderPageSkeleton() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <Skeleton className="mb-3 h-4 w-20" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <Skeleton className="size-10 rounded-lg" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="mb-3 h-4 w-12" />

          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <Skeleton className="size-11 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
