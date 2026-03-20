<script setup>
import homeHeroImg from '../assets/images/Fixed-image.webp'

defineProps({
  project: Object,
  fixedOverlay: Boolean,
  suppressAsideImage: Boolean,
  playEntrance: Boolean,
  exitingBack: Boolean,
  exitingBackMobile: Boolean,
  showHomeHeroOnExit: Boolean,
})

const emit = defineEmits(['back'])
</script>

<template>
  <div
    class="layout"
    :class="{
      'layout--fixed-overlay': fixedOverlay,
      'layout--entrance': playEntrance,
      'layout--exit-back': exitingBack,
      'layout--exit-back-mobile': exitingBackMobile,
    }"
  >
    <aside
      class="layout__left"
      :class="{
        'layout__left--home-exit-visible':
          showHomeHeroOnExit && exitingBackMobile,
      }"
    >
      <img
        v-if="showHomeHeroOnExit"
        :src="homeHeroImg"
        alt=""
      />
      <img
        v-else-if="!suppressAsideImage"
        :src="project.image"
        :alt="project.title"
      />
    </aside>
    <main class="layout__right">
      <div class="layout__content">
        <div class="detail__top">
          <h2 class="detail__title">{{ project.title }}</h2>
          <span class="detail__date">{{ project.date }}</span>
        </div>
        <p class="detail__description">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam.
        </p>
        <a class="detail__back" href="#" @click.prevent="emit('back')">Go Back</a>
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 100vh;
}

.layout--fixed-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: #ffffff;
}

@keyframes detail-rise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.layout--entrance .detail__top {
  animation: detail-rise 0.5s cubic-bezier(0, 0.2, 0.2, 1) 0.9s both;
}

.layout--entrance .detail__description {
  animation: detail-rise 0.5s cubic-bezier(0, 0.2, 0.2, 1) 1.1s both;
}

.layout--entrance .detail__back {
  animation: detail-rise 0.5s cubic-bezier(0, 0.2, 0.2, 1) 1.3s both;
}

@media (min-width: 376px) {
  .layout--exit-back .layout__content {
    opacity: 0;
    transition: opacity 0.3s linear;
    pointer-events: none;
  }
}

.layout__left {
  position: sticky;
  top: 0;
  width: calc(50% - 12px);
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
}

@media (min-width: 376px) {
  .layout__left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 0;
  }

  .layout__right {
    margin-left: calc(50% - 12px);
    width: calc(50% + 12px);
  }
}

.layout__left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.layout__right {
  width: calc(50% + 12px);
  min-height: 100vh;
  padding: 96px 96px 24px 96px;
  display: flex;
  flex-direction: column;
  transition: padding 0.3s ease;
}

.layout__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.detail__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

.detail__title {
  font-family: var(--font-sans);
  font-size: var(--type-heading-size);
  line-height: var(--type-heading-lh);
  font-weight: 400;
  color: #000000;
}

.detail__date {
  font-family: var(--font-serif);
  font-size: var(--type-serif-lg-size);
  line-height: var(--type-serif-lg-lh);
  font-style: italic;
  font-weight: 400;
  color: #000000;
}

.detail__description {
  align-self: stretch;
  width: 100%;
  max-width: 100%;
  font-family: var(--font-sans);
  font-size: var(--type-sans-lg-size);
  line-height: var(--type-sans-lg-lh);
  font-weight: 400;
  color: #000000;
  text-align: center;
}

.detail__back {
  display: block;
  text-align: center;
  font-family: var(--font-sans);
  font-size: var(--type-sans-lg-size);
  line-height: var(--type-sans-lg-lh);
  font-weight: 400;
  color: #000000;
  text-decoration: none;
  white-space: nowrap;
  position: relative;
  width: fit-content;
  align-self: center;
}

.detail__back::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #000000;
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1);
}

.detail__back:hover::after {
  transform: scaleX(0);
  transform-origin: right;
}

@media (max-width: 768px) {
  .layout__right {
    padding: 96px 64px 24px 64px;
  }
}

@media (max-width: 375px) {
  .layout {
    flex-direction: column;
  }

  .layout--exit-back-mobile .layout__right {
    opacity: 0;
    transition: opacity 0.3s linear;
    pointer-events: none;
  }

  .layout--exit-back-mobile .layout__left:not(.layout__left--home-exit-visible) {
    opacity: 0;
    transition: opacity 0.3s linear;
  }

  .layout__left--home-exit-visible {
    opacity: 1;
    transition: none;
  }

  .layout__left {
    position: relative;
    width: 100%;
    height: 400px;
    transition: height 0.3s ease;
  }

  .layout__right {
    margin-left: 0;
    width: 100%;
    min-height: unset;
    padding: 24px 24px 24px 24px;
  }

  .layout__content {
    height: 100%;
    min-height: calc(100vh - 400px - 48px);
  }
}
</style>
