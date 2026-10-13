import { useTrashFiles } from '#/lib/react-query/queries/file.query'
import { useTrashFolders } from '#/lib/react-query/queries/folder.query'
import { createFileRoute } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import FolderCard from './-components/folder-card'
import FileCard from './-components/file-card'
import { toFileCardProps } from '#/utils/file'
import { Skeleton } from '#/components/ui/skeleton'

export const Route = createFileRoute('/drive/trash')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: folders = [], isLoading: foldersLoading } = useTrashFolders()
  const { data: files = [], isLoading: filesLoading } = useTrashFiles()

  const isPending = foldersLoading || filesLoading
  const isEmpty = folders.length === 0 && files.length === 0

  if (isPending) {
    return <TrashPageSkeleton />
  }

  // Empty
  if (isEmpty) {
    return (
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
            <Trash2 className="size-7 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold">Trash is empty</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Items you move to trash will appear here.
          </p>
        </div>
      </main>
    )
  }

  // Main content
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Trash2 className="size-5 text-muted-foreground" />

          <h1 className="text-xl font-semibold">Trash</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Items you've moved to trash.
        </p>
      </div>

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
                  items={0}
                  isStarred={folder.is_starred}
                  variant="trash"
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
                <FileCard
                  key={file.id}
                  {...toFileCardProps(file)}
                  variant="trash"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export function TrashPageSkeleton() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-6 w-20" />
        </div>

        <Skeleton className="mt-2 h-4 w-52" />
      </div>

      <div className="space-y-8">
        <section>
          <Skeleton className="mb-3 h-4 w-16" />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-md" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>

                  <Skeleton className="size-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="mb-3 h-4 w-12" />

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Skeleton className="size-10 rounded-md" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>

                <Skeleton className="h-4 w-16" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export function TrashEmptyState() {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
        <Trash2 className="size-7 text-muted-foreground" />
      </div>

      <h2 className="text-lg font-semibold">Trash is empty</h2>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Items you move to trash will appear here.
      </p>
    </div>
  )
}
