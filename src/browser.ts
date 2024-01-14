export * from './types/index.js'
export * from './errors/index.js'
export * from './indexes.js'
import { MeiliSearch } from './clients/browser-client.js'

// @TODO: Read https://rollupjs.org/es-module-syntax/#default-export
export { MeiliSearch, MeiliSearch as Meilisearch }
