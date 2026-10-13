import { createServerFn } from '@tanstack/react-start'
import { createClient } from '#/lib/supabase/server'
import type { File } from '#/types/index'
import { createFileSchema, getFileUrlSchema, renameSchema } from '#/lib/schemas'
import { getCurrentUserId } from './auth'
import z from 'zod'

const getFiles = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data: files, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .is('folder_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return files as Array<File>
})

const getStarredFiles = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data: files, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', userId)
    .eq('is_starred', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return files as Array<File>
})

const getFolderFiles = createServerFn({ method: 'GET' })
  .validator(z.uuid())
  .handler(async ({ data: folderId }) => {
    const userId = await getCurrentUserId()
    const supabase = await createClient()

    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .eq('folder_id', folderId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false,
      })

    if (error) throw new Error(error.message)

    return files as Array<File>
  })

const getTrashFiles = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await getCurrentUserId()
  const supabase = await createClient()

  const { data: files, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', userId)
    .not('deleted_at', 'is', null)
    .order('deleted_at', {
      ascending: false,
    })

  if (error) throw new Error(error.message)

  return files as Array<File>
})

const createFileRecord = createServerFn({ method: 'POST' })
  .validator(createFileSchema)
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()

    const supabase = await createClient()

    const { mimeType, name, size, storagePath, folderId } = data

    const { data: driveFile, error } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        name,
        mime_type: mimeType,
        storage_path: storagePath,
        size,
        folder_id: folderId ?? null,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return driveFile
  })

const markFileStar = createServerFn({ method: 'POST' })
  .validator(z.uuid())
  .handler(async ({ data: fileId }) => {
    const userId = await getCurrentUserId()

    const supabase = await createClient()

    const { data: file, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', userId)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (!file || !file.id) {
      throw new Error('File not found')
    }

    const { error: updateFileError, data: updatedFile } = await supabase
      .from('files')
      .update({
        is_starred: !file.is_starred,
      })
      .eq('id', file.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateFileError) {
      throw new Error(updateFileError.message)
    }

    return updatedFile
  })

const renameFile = createServerFn({
  method: 'POST',
})
  .validator(renameSchema)
  .handler(async ({ data }) => {
    console.log(1)

    const userId = await getCurrentUserId()

    const supabase = await createClient()

    const { data: file, error } = await supabase
      .from('files')
      .update({
        name: data.name,
      })
      .eq('id', data.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (!file) {
      throw new Error('File not found')
    }

    return file
  })

const moveFileToTrash = createServerFn({ method: 'POST' })
  .validator(z.uuid())
  .handler(async ({ data: fileId }) => {
    const userId = await getCurrentUserId()

    const supabase = await createClient()

    const { data: file, error } = await supabase
      .from('files')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', fileId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (!file) {
      throw new Error('File not found')
    }

    return file
  })

const deleteFile = createServerFn({ method: 'POST' })
  .validator(z.uuid())
  .handler(async ({ data: fileId }) => {
    const userId = await getCurrentUserId()
    const supabase = await createClient()

    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('id, storage_path')
      .eq('user_id', userId)
      .eq('id', fileId)
      .not('deleted_at', 'is', null)
      .single()

    if (fileError || !file) throw new Error('File not found')

    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([file.storage_path])

    if (storageError) throw new Error(storageError.message)

    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', userId)

    if (deleteError) throw new Error(deleteError.message)

    return {
      success: true,
      fileId: file.id,
    }
  })

const restoreFile = createServerFn({ method: 'POST' })
  .validator(z.uuid())
  .handler(async ({ data: fileId }) => {
    const userId = await getCurrentUserId()
    const supabase = await createClient()

    const { data: file, error } = await supabase
      .from('files')
      .update({
        deleted_at: null,
      })
      .eq('user_id', userId)
      .eq('id', fileId)
      .not('deleted_at', 'is', null)
      .single()

    if (error) throw new Error(error.message)

    return file
  })

const getFileUrl = createServerFn({ method: 'GET' })
  .validator(getFileUrlSchema)
  .handler(async ({ data }) => {
    const userId = await getCurrentUserId()
    const supabase = await createClient()

    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('id, storage_path, mime_type, name')
      .eq('id', data.fileId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single()

    if (fileError || !file) {
      throw new Error('File not found or access denied')
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from('documents')
        .createSignedUrl(file.storage_path, 60, {
          download: file.name
        })

    if (signedUrlError) {
      throw new Error('Failed to generate file URL')
    }

    return {
      signedUrl: signedUrlData.signedUrl,
      mimeType: file.mime_type,
    }
  })

export {
  getFiles,
  getStarredFiles,
  getFolderFiles,
  getTrashFiles,
  createFileRecord,
  markFileStar,
  renameFile,
  moveFileToTrash,
  deleteFile,
  restoreFile,
  getFileUrl,
}
