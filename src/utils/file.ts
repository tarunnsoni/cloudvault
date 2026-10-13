import type { File, FileCardProps, FileType } from '#/types'

function getFileType(mimeType: string): FileType {
  if (mimeType === 'application/pdf') {
    return 'pdf'
  }

  if (mimeType.startsWith('image/')) {
    return 'image'
  }

  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return 'spreadsheet'
  }

  if (
    mimeType.includes('zip') ||
    mimeType.includes('rar') ||
    mimeType.includes('archive')
  ) {
    return 'archive'
  }

  return 'document'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const units = ['Bytes', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

function formatModifiedDate(date: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export function toFileCardProps(file: File): FileCardProps {
  return {
    id: file.id,
    name: file.name,
    type: getFileType(file.mime_type),
    size: formatFileSize(file.size),
    modified: formatModifiedDate(file.updated_at),
    starred: file.is_starred,
  }
}
