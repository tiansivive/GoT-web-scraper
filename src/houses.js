import {
  request
} from './utils'

import {
  baseURL,
  scrapedData
} from '../data/data'

export const getHousesList = () => {
  const uri = `${baseURL}/index.php/Houses_of_Westeros`
  scrapedData.houses = []

  return request(uri)
    .then($ => {
      $('table.navbox-subgroup.collapsed td.navbox-list ul li a')
        .each((id, { attribs }) => scrapedData.houses.push({
          id,
          name: attribs['title'],
          href: attribs['href'],
          source_url: baseURL + attribs['href'],
          details_url: `http://localhost:8888/scrape/house/${id}`
        }))
      return scrapedData.houses
    })
    .catch(error => console.error(error))
}

export const getHouse = id => {
  if (!scrapedData.houses) return Promise.reject(new Error('<a href="/scrape/houses">Load houses first</a>'))

  const house = scrapedData.houses[id]

  return request(`${house.source_url}`)
    .then($ => {
      const data = {}
      const infobox = $('table.infobox')
      data.name = infobox.find('.infobox-above').text().trim()

      infobox.find('tr th').each((i, elem) => {
        if (i === 0) return true

        const $elem = $(elem)
        const key = $elem.text().toLowerCase().replace(/\s/g, '_')

        let val = $elem.next()

        val = val.children('a').length > 1
          ? val.children('a').map((i, { attribs }) => ({
            name: attribs['title'],
            href: attribs['href'],
            source_url: baseURL + attribs['href']
          })).toArray()
          : val.text().trim()

        data[key] = val
      })
      house.data = data

      console.log(`Loaded ${data.name}`)
      return house
    })
    .catch(error => console.error(`\nERROR on house ${house.name}\n${error.toString()}\n`))
}
