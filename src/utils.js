import requestPromise from 'request-promise'
import cheerio from 'cheerio'

const transform = body => cheerio.load(body)
export const request = uri => requestPromise({ uri, transform })
