// Centralized backend URLs — use NEXT_PUBLIC_* at build/runtime
// Defaults point to in-cluster service hostnames so the frontend works when
// deployed inside Kubernetes. Override with NEXT_PUBLIC_* env vars when needed.
export const USERS_URL = process.env.NEXT_PUBLIC_USERS_SERVICE_URL //|| 'http://users-service:8080'
export const PROJECTS_URL = process.env.NEXT_PUBLIC_PROJECTS_SERVICE_URL //|| 'http://projects-service:8080'
export const LABS_URL = process.env.NEXT_PUBLIC_LABS_SERVICE_URL //|| 'http://labs-service:8080'

export const usersPath = (path: string) => `${USERS_URL}${path}`
export const projectsPath = (path: string) => `${PROJECTS_URL}${path}`
export const labsPath = (path: string) => `${LABS_URL}${path}`
