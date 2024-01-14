export * from './types/index.js'
export * from './errors/index.js'
export * from './indexes.js'
export * from './enqueued-task.js'
export * from './task.js'
import { MeiliSearch } from './clients/node-client.js'

// @TODO: Read https://rollupjs.org/es-module-syntax/#default-export
export { MeiliSearch, MeiliSearch as Meilisearch }
