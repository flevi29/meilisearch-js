import { defineConfig } from 'vitest/config'

// @TODO: Coverage reports
export default defineConfig({
  test: {
    include: ['tests/*.test.ts'],
    fileParallelism: false,
  },
})
