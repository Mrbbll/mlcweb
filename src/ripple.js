const RIPPLE_SELECTOR = 'a[href], button, [role="button"], label'

function findTarget(node) {
  if (!(node instanceof Element)) return null
  const target = node.closest(RIPPLE_SELECTOR)
  if (!target || target.hasAttribute('data-no-ripple') || target.disabled) return null
  const display = getComputedStyle(target).display
  if (display === 'inline' || display === 'contents') return null
  return target
}

function spawnRipple(target, event) {
  const style = getComputedStyle(target)
  if (style.position === 'static') target.style.position = 'relative'
  if (style.overflow !== 'hidden') target.style.overflow = 'hidden'
  const rect = target.getBoundingClientRect()
  const size = Math.hypot(rect.width, rect.height)
  const ripple = document.createElement('span')
  ripple.className = 'ripple'
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`
  ripple.addEventListener('animationend', () => ripple.remove())
  target.appendChild(ripple)
}

document.addEventListener('pointerdown', event => {
  if (event.button !== 0) return
  const target = findTarget(event.target)
  if (target) spawnRipple(target, event)
}, { passive: true })
