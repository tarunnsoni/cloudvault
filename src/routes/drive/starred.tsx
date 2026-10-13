import { createFileRoute } from '@tanstack/react-router'

import FolderCard from './-components/folder-card'
import FileCard from './-components/file-card'

import { useStarredFiles } from '#/lib/react-query/queries/file.query'
import { useStarredFolders } from '#/lib/react-query/queries/folder.query'

import { toFileCardProps } from '#/utils/file'
import { Star } from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'

export const Route = createFileRoute('/drive/starred')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    data: folders = [],
    isLoading: foldersLoading,
    isError: foldersError,
  } = useStarredFolders()

  const {
    data: files = [],
    isLoading: filesLoading,
    isError: filesError,
  } = useStarredFiles()

  const isLoading = foldersLoading || filesLoading
  const hasError = foldersError || filesError

  const isEmpty =
    !isLoading && !hasError && folders.length === 0 && files.length === 0

  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Star className="size-5 fill-amber-400 text-amber-400" />

          <h1 className="text-xl font-semibold">Starred</h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Your starred files and folders.
        </p>
      </div>

      {isLoading && <StarredSkeleton />}

      {!isLoading && hasError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load starred items. Please try again.
        </div>
      )}

      {isEmpty && <EmptyStarred />}

      {!isLoading && !hasError && !isEmpty && (
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
    </main>
  )
}

function EmptyStarred() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
        <Star className="size-5 text-muted-foreground" />
      </div>

      <h2 className="font-medium">No starred items</h2>

      <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
        Star files and folders to quickly find them here.
      </p>
    </div>
  )
}

function StarredSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <Skeleton className="mb-3 h-4 w-20" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
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
              className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
            >
              <Skeleton className="size-11 rounded-lg" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>

              <Skeleton className="size-8 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
