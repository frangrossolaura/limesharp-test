# limesharp-test

Showcase de proyectos con interfaz tipo portafolio: hero fijo, cuadrícula de tarjetas y vista detalle con transiciones (incluye animación “flip” entre lista y detalle). Los datos se cargan desde una API simulada en desarrollo y preview.

## Tecnologías

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 8**
- **JavaScript** (ES modules)

## Características

- Diseño en dos columnas (hero + contenido) y layout adaptable
- Catálogo de proyectos en cuadrícula con selección y vista detalle
- Middleware de Vite que expone `GET /api/projects` con JSON de ejemplo (mismo comportamiento en `vite preview`)
- Build estática lista para desplegar en cualquier hosting de archivos estáticos

## Requisitos

- [Node.js](https://nodejs.org/) **18+** (recomendado LTS)

## Instalación y uso en local

```bash
# Clonar (sustituye la URL por la de tu repo)
git clone <URL_DEL_REPOSITORIO>
cd limesharp-test

# Dependencias
npm install

# Servidor de desarrollo (recarga en caliente)
npm run dev
```

Abre en el navegador la URL que muestre la terminal (por defecto suele ser **http://localhost:5173**).

### Otros comandos

| Comando        | Descripción                                      |
| -------------- | ------------------------------------------------ |
| `npm run dev`  | Desarrollo con Vite                              |
| `npm run build`| Genera la carpeta `dist/` para producción        |
| `npm run preview` | Sirve `dist/` localmente (útil para probar el build) |

## Estructura del proyecto (resumen)

```
limesharp-test/
├── src/
│   ├── api/           # Cliente de fetch hacia /api/projects
│   ├── components/    # AppHeader, ProjectGrid, ProjectCard, ProjectDetail
│   ├── data/          # DTO y rutas de assets de proyectos
│   ├── utils/         # Lógica de animación hero / flip
│   ├── assets/        # Imágenes
│   ├── App.vue
│   └── main.js
├── vite.config.js     # Vue plugin + middleware mock /api/projects
└── package.json
```

## API mock

En **desarrollo** y **`vite preview`**, `GET /api/projects` devuelve el listado definido en `src/data/projects.dto.js`.

## Despliegue

1. Ejecuta `npm run build`.
2. Sube el contenido de la carpeta **`dist/`** a tu proveedor (Netlify, Vercel, Cloudflare Pages, S3, etc.).
3. Configura el servidor para que las rutas de SPA redirijan a `index.html` si tu hosting lo requiere.

> **Nota:** El endpoint `/api/projects` es solo del servidor de Vite en dev/preview. En producción puramente estática necesitarás un backend real, un proxy o empaquetar los datos en el build según tu estrategia.

## Licencia

Privado — ver `package.json` (`"private": true`).
