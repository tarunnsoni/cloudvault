import { QUERY_KEYS } from '../query-keys'
import {
  getChildFolders,
  getFolder,
  getFolders,
  getStarredFolders,
  getTrashFolders,
} from '#/server/folders'
import { useQuery } from '@tanstack/react-query'

export function useFolders() {
  return useQuery({
    queryKey: [QUERY_KEYS.FOLDERS],
    queryFn: getFolders,
  })
}

export function useFolder(folderId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.FOLDER, folderId],
    queryFn: () => getFolder({ data: folderId }),
    enabled: !!folderId,
  })
}

export function useStarredFolders() {
  return useQuery({
    queryKey: [QUERY_KEYS.STARRED_FOLDERS],
    queryFn: getStarredFolders,
  })
}

export function useChildFolders(folderId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.FOLDERS, QUERY_KEYS.CHILDREN, folderId],
    queryFn: () => getChildFolders({ data: folderId }),
    enabled: !!folderId,
  })
}

export function useTrashFolders() {
  return useQuery({
    queryKey: [QUERY_KEYS.TRASH_FOLDERS],
    queryFn: getTrashFolders,
  })
}
