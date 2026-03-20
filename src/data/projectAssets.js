const modules = import.meta.glob('../assets/images/Fixed-image-*.webp', {
  eager: true,
  import: 'default',
})

const urlByFileName = Object.create(null)
for (const path of Object.keys(modules)) {
  const name = path.slice(path.lastIndexOf('/') + 1)
  urlByFileName[name] = modules[path]
}

export function resolveProjectImageUrl(imageFile) {
  const url = urlByFileName[imageFile]
  if (import.meta.env.DEV && !url) {
    console.warn(`[projectAssets] Unknown imageFile: ${imageFile}`)
  }
  return url ?? ''
}
