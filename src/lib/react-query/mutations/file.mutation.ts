import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../query-keys'
import type { RenameInput } from '../../schemas'
import {
  createFileRecord,
  markFileStar,
  renameFile,
  deleteFile,
  moveFileToTrash,
  restoreFile,
} from '#/server/files'
import { createBrowserSupabaseClient } from '../../supabase/client'
import { useAuth } from '@clerk/tanstack-react-start'
import { getCurrentUserId } from '#/server/auth'
import { v4 as uuidv4 } from 'uuid'

export function useMarkFileStar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => markFileStar({ data: fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FILES],
      })
    },
  })
}

export function useRenameFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileDetails: RenameInput) => renameFile({ data: fileDetails }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FILES],
      })
    },
  })
}

export function useUploadFile() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({
      file,
      folderId = null,
    }: {
      file: File
      folderId?: string | null
    }) => {
      const userId = await getCurrentUserId()

      const supabase = createBrowserSupabaseClient(getToken)

      const fileId = uuidv4()

      const extension = file.name.includes('.')
        ? `.${file.name.split('.').pop()}`
        : ''

      const folderPath = folderId ?? 'root'

      const storagePath = `${userId}/${folderPath}/${fileId}${extension}`

      const { data: uploadedFile, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const fileRecord = await createFileRecord({
        data: {
          name: file.name,
          storagePath: uploadedFile.path,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          folderId,
        },
      })

      return fileRecord
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })
    },
  })
}

export function useMoveFileToTrash() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => moveFileToTrash({ data: fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FILES],
      })
    },
  })
}

export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) =>
      deleteFile({
        data: fileId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FILES],
      })
    },
  })
}

export function useRestoreFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => restoreFile({ data: fileId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FILES],
      })
    },
  })
}
