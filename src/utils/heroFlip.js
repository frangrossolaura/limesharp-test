export const HERO_TRANSITION_MIN_WIDTH = 376

const heroTransitionMql = `(min-width: ${HERO_TRANSITION_MIN_WIDTH}px)`

export const MOBILE_FLIP_HERO_HEIGHT_PX = 400

const mobileHeroFlipMql = `(max-width: 375px)`

export function shouldRunMobileHeroFlip() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia(mobileHeroFlipMql).matches) return false
  return true
}

export function shouldRunMobileBackTransition() {
  return shouldRunMobileHeroFlip()
}

export function getMobileHeroTargetRect() {
  const cw = document.documentElement.clientWidth
  return {
    left: 0,
    top: 0,
    width: cw,
    height: MOBILE_FLIP_HERO_HEIGHT_PX,
  }
}

export function getHeroTargetRect() {
  const cw = document.documentElement.clientWidth
  return {
    left: 0,
    top: 0,
    width: cw * 0.5 - 12,
    height: window.innerHeight,
  }
}

export function shouldRunHeroFlip() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia(heroTransitionMql).matches) return false
  return true
}

export function shouldRunBackTransition() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (!window.matchMedia(heroTransitionMql).matches) return false
  return true
}

export const BACK_DETAIL_TEXT_FADE_MS = 300
export const BACK_LOGO_DELAY_FROM_CLICK_MS = 500
export const BACK_GRID_DELAY_FROM_CLICK_MS = 700
export const BACK_HOME_LOGO_ANIM_DELAY_MS =
  BACK_LOGO_DELAY_FROM_CLICK_MS - BACK_DETAIL_TEXT_FADE_MS
export const BACK_HOME_GRID_ANIM_DELAY_MS =
  BACK_GRID_DELAY_FROM_CLICK_MS - BACK_DETAIL_TEXT_FADE_MS

const FLIP_DURATION_MS = 800
const FLIP_DELAY_MS = 300
const FLIP_EASING = 'cubic-bezier(0, 0.2, 0.2, 1)'

const LAYOUT_PROPS = ['left', 'top', 'width', 'height']

const innerTf = () =>
  `transform ${FLIP_DURATION_MS}ms ${FLIP_EASING} ${FLIP_DELAY_MS}ms`

export function applyHeroFlip(ghostEl, first, last, options = {}) {
  const holdInnerZoom = !!options.holdInnerZoom
  const { left: L, top: T, width: W, height: H } = last
  const { left: fL, top: fT, width: fW, height: fH } = first

  const tf = `left ${FLIP_DURATION_MS}ms ${FLIP_EASING} ${FLIP_DELAY_MS}ms, top ${FLIP_DURATION_MS}ms ${FLIP_EASING} ${FLIP_DELAY_MS}ms, width ${FLIP_DURATION_MS}ms ${FLIP_EASING} ${FLIP_DELAY_MS}ms, height ${FLIP_DURATION_MS}ms ${FLIP_EASING} ${FLIP_DELAY_MS}ms`

  const inner = ghostEl.querySelector('.hero-flip-ghost-img')

  ghostEl.style.transform = ''
  ghostEl.style.left = `${fL}px`
  ghostEl.style.top = `${fT}px`
  ghostEl.style.width = `${fW}px`
  ghostEl.style.height = `${fH}px`
  ghostEl.style.transition = 'none'

  if (inner) {
    if (holdInnerZoom) {
      inner.style.transformOrigin = 'center center'
      inner.style.transition = 'none'
      inner.style.transform = 'scale(1.1)'
    } else {
      inner.style.transition = ''
      inner.style.transform = ''
      inner.style.transformOrigin = ''
    }
  }

  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      ghostEl.removeEventListener('transitionend', onEnd)
      resolve()
    }
    const onEnd = (e) => {
      if (!LAYOUT_PROPS.includes(e.propertyName)) return
      finish()
    }
    ghostEl.addEventListener('transitionend', onEnd)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ghostEl.style.transition = tf
        ghostEl.style.left = `${L}px`
        ghostEl.style.top = `${T}px`
        ghostEl.style.width = `${W}px`
        ghostEl.style.height = `${H}px`

        if (inner && holdInnerZoom) {
          inner.style.transition = innerTf()
          inner.style.transform = 'scale(1)'
        }
      })
    })

    window.setTimeout(finish, FLIP_DURATION_MS + FLIP_DELAY_MS + 80)
  })
}
