import { QUERY_KEYS } from '../query-keys'
import { useQuery } from '@tanstack/react-query'
import {
  getFiles,
  getFolderFiles,
  getStarredFiles,
  getTrashFiles,
} from '#/server/files'

export function useFiles() {
  return useQuery({
    queryKey: [QUERY_KEYS.FILES],
    queryFn: getFiles,
  })
}

export function useStarredFiles() {
  return useQuery({
    queryKey: [QUERY_KEYS.STARRED_FILES],
    queryFn: getStarredFiles,
  })
}

export function useFolderFiles(folderId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.FILES, QUERY_KEYS.FOLDER, folderId],
    queryFn: () => getFolderFiles({ data: folderId }),
    enabled: !!folderId,
  })
}

export function useTrashFiles() {
  return useQuery({
    queryKey: [QUERY_KEYS.TRASH_FILES],
    queryFn: getTrashFiles,
  })
}
