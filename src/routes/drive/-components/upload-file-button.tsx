import { useState } from 'react'
import { Loader2, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useUploadFile } from '#/lib/react-query/mutations/file.mutation'

interface UploadFileButtonProps {
  folderId?: string | null
}

export function UploadFileButton({ folderId = null }: UploadFileButtonProps) {
  const uploadMutation = useUploadFile()

  const [isUploading, setIsUploading] = useState(false)

  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
  })

  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? [])

    if (files.length === 0) return

    event.target.value = ''

    setErrors([])
    setIsUploading(true)

    setProgress({
      completed: 0,
      total: files.length,
    })

    const failedFiles: string[] = []
    let completed = 0

    try {
      for (const file of files) {
        try {
          await uploadMutation.mutateAsync({
            file,
            folderId,
          })
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown upload error'

          failedFiles.push(`${file.name}: ${message}`)
        } finally {
          completed++

          setProgress({
            completed,
            total: files.length,
          })
        }
      }

      setErrors(failedFiles)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        id="cloudvault-file-upload"
        type="file"
        multiple
        className="sr-only"
        disabled={isUploading}
        onChange={handleFileChange}
      />

      <Button asChild className="gap-2" disabled={isUploading}>
        <label htmlFor="cloudvault-file-upload" className="cursor-pointer">
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}

          {isUploading
            ? `Uploading ${progress.completed}/${progress.total}`
            : 'Upload files'}
        </label>
      </Button>

      {isUploading && (
        <p className="text-sm text-muted-foreground">
          {progress.completed} of {progress.total} files processed
        </p>
      )}

      {errors.length > 0 && (
        <div className="max-w-xs text-right text-sm text-destructive">
          <p className="font-medium">
            {errors.length} file(s) failed to upload:
          </p>

          <ul className="mt-1 space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
