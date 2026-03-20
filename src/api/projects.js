import { projectsDto } from '../data/projects.dto.js'
import { resolveProjectImageUrl } from '../data/projectAssets.js'

function mapDtoToProjects(dtoList) {
  return dtoList.map((p) => ({
    id: p.id,
    title: p.title,
    date: p.date,
    image: resolveProjectImageUrl(p.imageFile),
  }))
}

export async function fetchProjects() {
  try {
    const res = await fetch('/api/projects', {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) return mapDtoToProjects(data)
    }
  } catch {
  }
  return mapDtoToProjects(projectsDto)
}
