/* eslint no-console: 0 */
import Express from 'express'
import Html from 'helpers/html'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import compression from 'compression'
import configureStore from './redux/store'
import createRoutes from './routes'
import fs from 'fs'
import get from 'lodash.get'
import http from 'http'
import path from 'path'
import httpProxy from 'http-proxy'
import { Provider } from 'react-redux'
import { RouterContext, match, createMemoryHistory } from 'react-router'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { createEvent } from './redux/actions/index'
import { syncHistoryWithStore } from 'react-router-redux'

// defines global variable
global.__SERVER__ = true

// lodash
const _ = {
  get,
}

const app = new Express()
const server = new http.Server(app)

// compress http response
app.use(compression())

// serve static files
app.use('/static', Express.static(path.join(__dirname, '..', 'static')))
app.use('/dist', Express.static(path.join(__dirname, '..', 'dist')))

const scripts = []

if (process.env.NODE_ENV === 'production') {
  // load webpack bundle
  fs.readdirSync(__dirname).forEach((file) => {
    const re = /main\..+\.bundle\.js/
    const found = file.match(re)
    if (found !== null) {
      scripts.push(`dist/${file}`)
    }
  })
} else {
  const proxy = httpProxy.createProxyServer({
    // webpack dev server
    target: 'http://localhost:5000',
  })
  // proxy request to webpack dev server
  app.use('/dist', (req, res) => {
    proxy.web(req, res)
  })
  // load dev webpack bundle
  scripts.push('dist/main.dev.bundle.js')
}

// server dynamic request
app.use((req, res) => {
  const memoryHistory = createMemoryHistory(req.originalUrl)
  const store = configureStore(memoryHistory)
  const history = syncHistoryWithStore(memoryHistory, store)
  const routes = createRoutes(history)

  match({ history, routes, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      console.error('Internal server error: ', error)
      res.status(500).send('Internal server error')
    } else if (renderProps == null) {
      res.status(404).send('Not found')
    } else {
      const getReduxPromise = () => {
        const params = _.get(renderProps, 'params', {})
        let comp = renderProps.components[renderProps.components.length - 1]
        comp = comp.WrappedComponent || comp
        const promise = comp.fetchData ?
          comp.fetchData({ params, store }) :
          Promise.resolve()

        return promise
      }

      getReduxPromise().then(() => {
        const sheet = new ServerStyleSheet()
        const jsx = (
          <Provider store={store} >
            <StyleSheetManager sheet={sheet.instance}>
              { <RouterContext {...renderProps} /> }
            </StyleSheetManager>
          </Provider>
        )
        const content = ReactDOMServer.renderToString(jsx)

        const html = ReactDOMServer.renderToStaticMarkup(<Html
          store={store}
          scripts={scripts}
          content={content}
          styleTags={sheet.getStyleTags()}
        />)
        res.status(200)
        res.send(`<!doctype html>${html}`)
      }, (err) => {
        console.log('err:', err)
        throw err
      }).catch((err) => {
        console.error('Internal server error:', err)
        res.status(500).send('Internal server error')
      })
    }
  })
})

server.listen(3000, (err) => {
  if (err) {
    console.error(err)
  }
  console.info('==> 💻   Open http://%s:%s in a browser to view the app.', 'localhost', 3000)
})


// THIS IS ONLY FOR TEST //
// AUTO CREATE EVENT FRO TESTING //
let counter = 0
const createEventCron = () => {
  createEvent({
    camera_id: `camera_id_${counter}`,
    is_viewed: false,
    prediction: `prediction_${counter}`,
    starting_timestamp: Math.round(Date.now() / 1000),
    thumbnail: `thumbnail_${counter}`,
  }).then(() => {
    counter += 1
  }).catch((error) => {
    console.error('Auto creating events occurs error:', error)
  })
  setTimeout(createEventCron, 10000)
}
setTimeout(createEventCron, 10000)
