const SIZE = 128

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

export async function renderPlayerHead(skinUrl) {
  try {
    const image = await loadImage(skinUrl)
    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    const context = canvas.getContext('2d')
    context.imageSmoothingEnabled = false
    if (image.naturalHeight >= 64) {
      const inner = Math.round(SIZE * (8 / 9))
      const inset = Math.round((SIZE - inner) / 2)
      context.drawImage(image, 8, 8, 8, 8, inset, inset, inner, inner)
      context.drawImage(image, 40, 8, 8, 8, 0, 0, SIZE, SIZE)
    } else {
      context.drawImage(image, 8, 8, 8, 8, 0, 0, SIZE, SIZE)
    }
    return canvas.toDataURL('image/png')
  } catch {
    return null
  }
}
