'use client'

import { toRef, type MediaRef } from '../media'

export type { MediaRef }

const MAX_EDGE = 2000

/**
 * Phone photos are often 4000 px and 5 MB. Shrink them on the phone first so uploads
 * are quick on a village connection; the server then makes the WebP 1200/600/300 sizes.
 */
async function shrink(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height))
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.86))
    return blob ?? file
  } catch {
    return file
  }
}

/** Uploads one photo to Payload's media collection, reporting progress 0–100. */
export async function uploadPhoto(file: File, onProgress: (pct: number) => void): Promise<MediaRef> {
  const blob = await shrink(file)
  const name = blob === file ? file.name : file.name.replace(/\.\w+$/, '') + '.jpg'
  const form = new FormData()
  form.append('file', blob, name)
  form.append('_payload', JSON.stringify({ alt: '' }))
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/media')
    xhr.withCredentials = true
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 95))
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100)
        resolve(toRef(JSON.parse(xhr.responseText).doc))
      } else reject(new Error(xhr.responseText))
    }
    xhr.onerror = () => reject(new Error('network'))
    xhr.send(form)
  })
}
