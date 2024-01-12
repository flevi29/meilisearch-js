export * from './types'
export * from './errors'
export * from './indexes'
export * from './enqueued-task'
export * from './task'
import { MeiliSearch } from './clients/node-client'

// @TODO: Read https://rollupjs.org/es-module-syntax/#default-export
export { MeiliSearch, MeiliSearch as Meilisearch }
