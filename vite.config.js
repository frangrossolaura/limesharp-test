import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { projectsDto } from './src/data/projects.dto.js'

function mockProjectsApiMiddleware(req, res, next) {
  const path = req.url?.split('?')[0]
  if (path !== '/api/projects' || req.method !== 'GET') {
    next()
    return
  }
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(projectsDto))
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'mock-get-projects',
      configureServer(server) {
        server.middlewares.use(mockProjectsApiMiddleware)
      },
      configurePreviewServer(server) {
        server.middlewares.use(mockProjectsApiMiddleware)
      },
    },
  ],
})
