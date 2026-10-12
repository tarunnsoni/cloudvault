import { FolderPlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

import FolderCard from './folder-card'
import FileCard from './file-card'

import { FileCardSkeleton, FolderCardSkeleton } from './drive-card-skeletons'

import { useFiles, useFolders } from '#/lib/react-query/queries'
import { toFileCardProps } from '#/utils/file'
import CreateFolderDialog from './create-folder-dialog'
import { useState } from 'react'
import { UploadFileButton } from './upload-file-button'

export default function DriveContent({ search }: { search: string }) {
  const [createFolderOpen, setCreateFolderOpen] = useState(false)

  const { data: folders = [], isLoading: foldersLoading } = useFolders()
  const { data: files = [], isLoading: filesLoading } = useFiles()

  const normalizedSearch = search.trim().toLowerCase()

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(normalizedSearch),
  )

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(normalizedSearch),
  )

  const hasResults = filteredFolders.length > 0 || filteredFiles.length > 0

  const isLoading = foldersLoading || filesLoading

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            My Drive
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your files and folders in one place.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setCreateFolderOpen(true)}
          >
            <FolderPlus className="size-4" />

            <span className="hidden sm:inline">New folder</span>

            <span className="sm:hidden">Folder</span>
          </Button>

          <UploadFileButton />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-8 space-y-9">
          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold">Folders</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Your organized spaces
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <FolderCardSkeleton key={index} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-sm font-semibold">Your files</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <FileCardSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      ) : !hasResults ? (
        <EmptySearch />
      ) : (
        <div className="mt-8 space-y-9">
          {filteredFolders.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Folders</h2>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your organized spaces
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {filteredFolders.map((folder) => (
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

          {filteredFiles.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Your files</h2>
                </div>

                <Button variant="ghost" size="sm" className="text-xs">
                  View all
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredFiles.map((file) => (
                  <FileCard key={file.name} {...toFileCardProps(file)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
      />
    </main>
  )
}

function EmptySearch() {
  return (
    <div className="mt-12 flex min-h-90 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
        <Upload className="size-5 text-muted-foreground" />
      </div>

      <h2 className="mt-4 text-sm font-semibold">No files found</h2>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try a different search term or upload a new file to your drive.
      </p>
    </div>
  )
}
