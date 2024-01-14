import type { Config } from '../types/index.js'
import { Client } from './client.js'

class MeiliSearch extends Client {
  constructor(config: Config) {
    super(config)
  }
}

export { MeiliSearch }
