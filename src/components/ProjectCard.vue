<template>
  <div
    ref="cardEl"
    class="card"
    :class="{
      'card--hold-zoom': holdHoverZoom || preHoldZoom,
      'card--flip-dim': flipDimFull,
    }"
    @pointerdown="onPointerDown"
    @pointerleave="onPointerLeave"
    @click="onSelect"
  >
    <div ref="imageWrapperEl" class="card__image-wrapper">
      <img :src="image" :alt="title" class="card__image" />
    </div>
    <div
      class="card__text"
      :class="{ 'card__text--flip-dim': flipDimTextOnly }"
    >
      <span class="card__title">{{ title }}</span>
      <span class="card__date">{{ date }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: String,
  date: String,
  image: String,
  holdHoverZoom: Boolean,
  flipDimFull: Boolean,
  flipDimTextOnly: Boolean,
})

const emit = defineEmits(['select'])
const cardEl = ref(null)
const imageWrapperEl = ref(null)
const preHoldZoom = ref(false)
let preHoldClearTimer = 0

watch(
  () => props.holdHoverZoom,
  (v) => {
    if (v) preHoldZoom.value = false
  }
)

function onPointerDown(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  preHoldZoom.value = cardEl.value?.matches(':hover') ?? false
  if (preHoldClearTimer) {
    window.clearTimeout(preHoldClearTimer)
    preHoldClearTimer = 0
  }
  preHoldClearTimer = window.setTimeout(() => {
    preHoldZoom.value = false
    preHoldClearTimer = 0
  }, 600)
}

function onPointerLeave(e) {
  if (e.buttons === 0) preHoldZoom.value = false
}

function onSelect() {
  if (preHoldClearTimer) {
    window.clearTimeout(preHoldClearTimer)
    preHoldClearTimer = 0
  }
  const wrap = imageWrapperEl.value
  if (!wrap) return
  const fromHover =
    (cardEl.value?.matches(':hover') ?? false) || preHoldZoom.value
  emit('select', wrap.getBoundingClientRect(), fromHover)
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  aspect-ratio: 348 / 291;
  cursor: pointer;
}
.card__image-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
}
.card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card__text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  color: #000000;
}

.card__title {
  font-family: var(--font-sans);
  font-size: var(--type-sans-sm-size);
  line-height: var(--type-sans-sm-lh);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card__date {
  font-family: var(--font-serif);
  font-size: var(--type-serif-sm-size);
  line-height: var(--type-serif-sm-lh);
  font-style: normal;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
}

.card__image {
  transition: transform 1s cubic-bezier(0, 0.2, 0.2, 1);
}

.card:hover .card__image {
  transform: scale(1.1);
}

.card.card--hold-zoom .card__image {
  transform: scale(1.1);
  transition: none;
}

.card--flip-dim {
  opacity: 0;
  transition: opacity 0.3s linear;
  pointer-events: none;
}

.card__text--flip-dim {
  opacity: 0;
  transition: opacity 0.3s linear;
}
</style>
