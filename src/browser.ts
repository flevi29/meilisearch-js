export * from './types'
export * from './errors'
export * from './indexes'
import { MeiliSearch } from './clients/browser-client'

// @TODO: Read https://rollupjs.org/es-module-syntax/#default-export
export { MeiliSearch, MeiliSearch as Meilisearch }
