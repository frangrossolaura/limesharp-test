<template>
  <div
    class="grid-wrapper"
    :class="{ 'grid-wrapper--flip-fade': flipFocusProjectId != null }"
  >
    <div class="project-grid">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :title="project.title"
        :date="project.date"
        :image="project.image"
        :hold-hover-zoom="holdZoomProjectId === project.id"
        :flip-dim-full="
          flipFocusProjectId != null && flipFocusProjectId !== project.id
        "
        :flip-dim-text-only="flipFocusProjectId === project.id"
        @select="(rect, fromHover) => emit('select', project, rect, fromHover)"
      />
    </div>
    <a href="#" class="grid__link">Get in Touch</a>
  </div>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: {
    type: Array,
    required: true,
  },
  holdZoomProjectId: Number,
  flipFocusProjectId: Number,
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.grid-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.grid__link {
  display: block;
  width: fit-content;
  text-align: center;
  font-family: var(--font-sans);
  font-size: var(--type-sans-lg-size);
  line-height: var(--type-sans-lg-lh);
  font-weight: 400;
  color: #000000;
  text-decoration: none;
  white-space: nowrap;
  position: relative;
}

.grid__link::after {
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

.grid__link:hover::after {
  transform: scaleX(0);
  transform-origin: right;
}

.grid-wrapper--flip-fade .grid__link {
  opacity: 0;
  transition: opacity 0.3s linear;
  pointer-events: none;
}

@media (max-width: 940px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
