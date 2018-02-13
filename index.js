import express from 'express'

import {
  getHouse,
  getHousesList
} from './src/houses'

const app = express()

app.get('/', (req, res) => res.send('Web scraping app is up and running!'))
app.get('/scrape', (req, res) => res.send('PONG scrape'))
app.get('/scrape/houses', (req, res) => getHousesList().then(data => res.json(data)))
app.get('/scrape/house/:houseID', (req, res) => getHouse(req.params.houseID).then(data => res.json(data)).catch(error => res.send(error.message)))
app.get('/scrape/houses/details', (req, res) => getHousesList().then(houses => Promise.all(houses.map(({ id }) => getHouse(id)))).then(data => res.json(data)))

app.param('houseID', (req, res, next, id) => {
  req.params.houseID = parseInt(id)
  next()
})

app.listen('8888')
console.log('Magic happens on port 8888')
