import {
  createFolder,
  deleteFolder,
  markFolderStar,
  renameFolder,
  restoreFolder,
  moveFolderToTrash,
} from '#/server/folders'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../query-keys'
import type { CreateFolderInput, RenameInput } from '../../schemas'

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderDetails: CreateFolderInput) =>
      createFolder({ data: folderDetails }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLDERS],
      })
    },
  })
}

export function useMarkFolderStar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) => markFolderStar({ data: folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FOLDERS],
      })
    },
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderDetails: RenameInput) =>
      renameFolder({ data: folderDetails }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FOLDERS],
      })
    },
  })
}

export function useRestoreFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) =>
      restoreFolder({
        data: folderId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FILES],
      })
    },
  })
}

export function usePermanentlyDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) =>
      deleteFolder({
        data: folderId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FILES],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLDERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })
    },
  })
}

export function useMoveFolderToTrash() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folderId: string) =>
      moveFolderToTrash({
        data: folderId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FOLDERS],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILES],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FOLDERS],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRASH_FILES],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FILES],
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STARRED_FOLDERS],
      })
    },
  })
}
