import {
  request
} from './utils'

import {
  baseURL,
  scrapedData
} from '../data/data'

export const getCharactersList = () => {
  const uri = `${baseURL}/index.php/List_of_characters`
  scrapedData.characters = []

  return request(uri)
    .then($ => {
      $('#mw-content-text ul li')
        .each((id, elem) => {
          const $elem = $(elem)
          const character = $elem.children('a').first()
          scrapedData.characters.push({
            id,
            name: $elem.text(),
            shortName: character.text(),
            href: character.attr('href'),
            source_url: baseURL + character.attr('href'),
            details_url: `http://localhost:8888/scrape/character/${id}`
          })
        })
      return scrapedData.characters
    })
    .catch(error => console.error(error))
}
