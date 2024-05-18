import { expect, test, describe, beforeEach, vi } from 'vitest'
import {
  MeiliSearch,
  MeiliSearchError,
  MeiliSearchApiError,
  MeiliSearchCommunicationError,
  MeiliSearchTimeOutError,
} from '../src/index.js'

const mockedFetch = vi.fn()
globalThis.fetch = mockedFetch

// @TODO
// import.meta.jest.setTimeout(100 * 1000)

describe('Test on updates', () => {
  beforeEach(() => {
    mockedFetch.mockReset()
  })

  test(`Throw MeiliSearchCommunicationError when thrown error is not MeiliSearchApiError`, async () => {
    mockedFetch.mockRejectedValue(new Error('fake error message'))

    const client = new MeiliSearch({ host: 'http://localhost:9345' })
    try {
      await client.health()
    } catch (e: any) {
      expect(e.name).toEqual('MeiliSearchCommunicationError')
    }
  })

  test(`Not throw MeiliSearchCommunicationError when thrown error is MeiliSearchApiError`, async () => {
    mockedFetch.mockRejectedValue(
      new MeiliSearchApiError(
        {
          message: 'Some error',
          code: 'some_error',
          type: 'random_error',
          link: 'a link',
        },
        404
      )
    )

    const client = new MeiliSearch({ host: 'http://localhost:9345' })
    try {
      await client.health()
    } catch (e: any) {
      expect(e.name).toEqual('MeiliSearchApiError')
    }
  })

  test('MeiliSearchApiError can be compared with the instanceof operator', async () => {
    mockedFetch.mockRejectedValue(
      new MeiliSearchApiError(
        {
          message: 'Some error',
          code: 'some_error',
          type: 'random_error',
          link: 'a link',
        },
        404
      )
    )

    const client = new MeiliSearch({ host: 'http://localhost:9345' })
    try {
      await client.health()
    } catch (e: any) {
      expect(e instanceof MeiliSearchApiError).toEqual(true)
    }
  })

  test('MeiliSearchCommunicationError can be compared with the instanceof operator', async () => {
    mockedFetch.mockRejectedValue(new Error('fake error message'))

    const client = new MeiliSearch({ host: 'http://localhost:9345' })
    try {
      await client.health()
    } catch (e: any) {
      expect(e instanceof MeiliSearchCommunicationError).toEqual(true)
    }
  })

  test('MeiliSearchError can be compared with the instanceof operator', () => {
    expect(new MeiliSearchError('message') instanceof MeiliSearchError).toEqual(
      true
    )
  })

  test('MeiliSearchTimeOutError can be compared with the instanceof operator', () => {
    expect(
      new MeiliSearchTimeOutError('message') instanceof MeiliSearchTimeOutError
    ).toEqual(true)
  })
})
