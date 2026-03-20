<template>
  <ProjectDetail
    v-if="activeProject"
    :project="activeProject"
    :fixed-overlay="!!flipPhase || detailEntranceHold"
    :suppress-aside-image="!!flipPhase"
    :play-entrance="detailEntranceHold"
    :exiting-back="exitingBack"
    :exiting-back-mobile="exitingBackMobile"
    :show-home-hero-on-exit="showHomeHeroOnExit"
    @back="onBack"
  />
  <div
    v-show="!selectedProject"
    class="layout"
    :style="homeBackAnimationVars"
    :class="{
      'layout--flip-exit': flipPhase,
      'layout--home-back-enter': homeBackEnter,
    }"
  >
    <aside class="layout__left">
      <img src="./assets/images/Fixed-image.webp" alt="Fixed hero image" />
    </aside>
    <main class="layout__right">
      <AppHeader />
      <div class="layout__home-body">
        <div class="layout__spacer"></div>
        <div class="layout__content">
          <h2 class="layout__heading">
            <span class="layout__heading-lead">Redefining the future of</span>
            <span class="layout__heading-emphasis">Digital Commerce</span>
          </h2>
          <ProjectGrid
            :projects="projects"
            :hold-zoom-project-id="holdZoomProjectId"
            :flip-focus-project-id="flipFocusProjectId"
            @select="onSelectProject"
          />
        </div>
      </div>
    </main>
  </div>
  <Teleport to="body">
    <div
      v-if="flipPhase"
      ref="ghostRef"
      class="hero-flip-ghost-wrap"
      :style="ghostFirstStyle"
    >
      <img
        class="hero-flip-ghost-img"
        :src="flipPhase.project.image"
        alt=""
      />
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true,
  },
})
import ProjectDetail from './components/ProjectDetail.vue'
import AppHeader from './components/AppHeader.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import {
  applyHeroFlip,
  BACK_DETAIL_TEXT_FADE_MS,
  BACK_HOME_GRID_ANIM_DELAY_MS,
  BACK_HOME_LOGO_ANIM_DELAY_MS,
  getHeroTargetRect,
  getMobileHeroTargetRect,
  shouldRunBackTransition,
  shouldRunHeroFlip,
  shouldRunMobileBackTransition,
  shouldRunMobileHeroFlip,
} from './utils/heroFlip.js'

const DETAIL_ENTRANCE_MS = 1850
const HOME_BACK_ENTER_HOLD_MS = BACK_HOME_GRID_ANIM_DELAY_MS + 500 + 80

const selectedProject = ref(null)
const flipPhase = ref(null)
const ghostRef = ref(null)
const detailEntranceHold = ref(false)
const exitingBack = ref(false)
const exitingBackMobile = ref(false)
const showHomeHeroOnExit = ref(false)
const homeBackEnter = ref(false)
let detailEntranceTimer = 0
let backTransitionTimer = 0
let homeBackEnterTimer = 0

function clearDetailEntranceTimer() {
  if (detailEntranceTimer) {
    window.clearTimeout(detailEntranceTimer)
    detailEntranceTimer = 0
  }
}

function clearBackTransitionTimers() {
  if (backTransitionTimer) {
    window.clearTimeout(backTransitionTimer)
    backTransitionTimer = 0
  }
  if (homeBackEnterTimer) {
    window.clearTimeout(homeBackEnterTimer)
    homeBackEnterTimer = 0
  }
  exitingBack.value = false
  exitingBackMobile.value = false
  showHomeHeroOnExit.value = false
  homeBackEnter.value = false
  document.body.classList.remove('hero-back-active')
}

async function onBack() {
  clearDetailEntranceTimer()
  detailEntranceHold.value = false

  if (!selectedProject.value || flipPhase.value) return

  const runDesktopBack = shouldRunBackTransition()
  const runMobileBack = !runDesktopBack && shouldRunMobileBackTransition()

  if (!runDesktopBack && !runMobileBack) {
    clearBackTransitionTimers()
    selectedProject.value = null
    return
  }

  if (exitingBack.value) return

  exitingBack.value = true
  if (runMobileBack) exitingBackMobile.value = true
  document.body.classList.add('hero-back-active')

  backTransitionTimer = window.setTimeout(() => {
    showHomeHeroOnExit.value = true
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          selectedProject.value = null
          exitingBack.value = false
          exitingBackMobile.value = false
          showHomeHeroOnExit.value = false
          backTransitionTimer = 0
          document.body.classList.remove('hero-back-active')
          homeBackEnter.value = true
          homeBackEnterTimer = window.setTimeout(() => {
            homeBackEnter.value = false
            homeBackEnterTimer = 0
          }, HOME_BACK_ENTER_HOLD_MS)
        })
      })
    })
  }, BACK_DETAIL_TEXT_FADE_MS)
}

const activeProject = computed(
  () => selectedProject.value ?? flipPhase.value?.project ?? null
)

const holdZoomProjectId = computed(() => {
  const fp = flipPhase.value
  return fp?.holdZoom ? fp.project.id : undefined
})

const flipFocusProjectId = computed(
  () => flipPhase.value?.project?.id ?? undefined
)

const homeBackAnimationVars = computed(() => ({
  '--home-back-logo-delay': `${BACK_HOME_LOGO_ANIM_DELAY_MS}ms`,
  '--home-back-grid-delay': `${BACK_HOME_GRID_ANIM_DELAY_MS}ms`,
}))

const ghostFirstStyle = computed(() => {
  const r = flipPhase.value?.firstRect
  if (!r) return {}
  return {
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  }
})

function copyRect(rect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
}

async function onSelectProject(project, firstRect, fromHover = false) {
  clearBackTransitionTimers()

  if (!firstRect) {
    selectedProject.value = project
    return
  }

  const runDesktopFlip = shouldRunHeroFlip()
  const runMobileFlip = !runDesktopFlip && shouldRunMobileHeroFlip()

  if (!runDesktopFlip && !runMobileFlip) {
    selectedProject.value = project
    return
  }
  if (flipPhase.value) return

  clearDetailEntranceTimer()
  detailEntranceHold.value = true
  detailEntranceTimer = window.setTimeout(() => {
    detailEntranceHold.value = false
    detailEntranceTimer = 0
  }, DETAIL_ENTRANCE_MS)

  flipPhase.value = {
    project,
    firstRect: copyRect(firstRect),
    holdZoom: !!fromHover,
  }
  document.body.classList.add('hero-flip-active')

  await nextTick()
  const ghost = ghostRef.value
  if (!ghost || !flipPhase.value) {
    document.body.classList.remove('hero-flip-active')
    flipPhase.value = null
    clearDetailEntranceTimer()
    detailEntranceHold.value = false
    return
  }

  const targetRect = runDesktopFlip
    ? getHeroTargetRect()
    : getMobileHeroTargetRect()

  try {
    await applyHeroFlip(ghost, flipPhase.value.firstRect, targetRect, {
      holdInnerZoom: flipPhase.value.holdZoom,
    })
  } finally {
    document.body.classList.remove('hero-flip-active')
  }

  if (!flipPhase.value) return

  selectedProject.value = flipPhase.value.project
  flipPhase.value = null
}
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  background: #ffffff;
  color: #000000;
}
body.hero-flip-active,
body.hero-back-active {
  overflow: hidden;
}

.hero-flip-ghost-wrap {
  position: fixed;
  z-index: 60;
  overflow: hidden;
  margin: 0;
  padding: 0;
  pointer-events: none;
}

.hero-flip-ghost-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
}

.layout--flip-exit .layout__left,
.layout--flip-exit .layout__right > .app-header,
.layout--flip-exit .layout__spacer,
.layout--flip-exit .layout__heading {
  opacity: 0;
  transition: opacity 0.3s linear;
}

.layout__left {
  position: sticky;
  top: 0;
  width: calc(50% - 12px);
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  transition: height 0.3s ease;
}

.layout__left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.layout__right {
  width: calc(50% + 12px);
  min-width: 0;
  min-height: 100vh;
  padding: 24px 24px 96px 24px;
  display: flex;
  flex-direction: column;
}

.layout__home-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
}

@keyframes home-back-rise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.layout--home-back-enter {
  --home-back-rise-dur: 0.5s;
  --home-back-rise-ease: cubic-bezier(0, 0.2, 0.2, 1);
}

@media (min-width: 376px) {
  .layout--home-back-enter .app-header {
    animation: home-back-rise var(--home-back-rise-dur) var(--home-back-rise-ease)
      var(--home-back-logo-delay, 0.2s) both;
  }

  .layout--home-back-enter .layout__home-body {
    animation: home-back-rise var(--home-back-rise-dur) var(--home-back-rise-ease)
      var(--home-back-grid-delay, 0.4s) both;
  }
}

@media (max-width: 375px) {
  .layout--home-back-enter .app-header {
    animation: home-back-rise var(--home-back-rise-dur) var(--home-back-rise-ease)
      var(--home-back-logo-delay, 0.2s) both;
  }

  .layout--home-back-enter .layout__home-body {
    animation: home-back-rise var(--home-back-rise-dur) var(--home-back-rise-ease)
      var(--home-back-grid-delay, 0.4s) both;
  }
}

.layout__spacer {
  height: clamp(96px, calc(96px + (258 - 96) * ((100vw - 375px) / (1512 - 375))), 258px);
  flex-shrink: 0;
}

.layout__content {
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
}

.layout__heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #000000;
  font-weight: 400;
}

.layout__heading-lead {
  font-family: var(--font-sans);
  font-size: var(--type-sans-lg-size);
  line-height: var(--type-sans-lg-lh);
}

.layout__heading-emphasis {
  font-family: var(--font-serif);
  font-size: var(--type-serif-lg-size);
  line-height: var(--type-serif-lg-lh);
  font-style: italic;
  font-weight: 400;
}

.layout__right {
  transition: padding 0.3s ease;
}

@media (max-width: 768px) {
  .layout__right {
    padding: 24px 24px 96px 24px;
  }
}

@media (max-width: 375px) {
  .layout {
    flex-direction: column;
  }

  .layout__left {
    position: relative;
    width: 100%;
    height: 400px;
  }

  .layout__right {
    width: 100%;
    min-height: unset;
    padding: 24px 24px 96px 24px;
  }
}
</style>
