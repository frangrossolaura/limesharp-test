import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { fetchProjects } from './api/projects.js'

async function bootstrap() {
  const projects = await fetchProjects()
  createApp(App, { projects }).mount('#app')
}

bootstrap()
