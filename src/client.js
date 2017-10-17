/* eslint no-console:0 */
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './redux/store'
import createRoutes from './routes'
import { Provider } from 'react-redux'
import { Router, match, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

if (window.WebSocket) {
  global.socket = new WebSocket('ws://localhost:8080/v1/ws')
} else {
  console.log('WebSocket is not provided')
}

let reduxState
if (window.__REDUX_STATE__) {
  reduxState = window.__REDUX_STATE__
}

const store = configureStore(browserHistory, reduxState)

const history = syncHistoryWithStore(browserHistory, store)

const routes = createRoutes(history)

// calling `match` is simply for side effects of
// loading route/component code for the initial location
// https://github.com/ReactTraining/react-router/blob/v3/docs/guides/ServerRendering.md#async-routes
match({ history, routes }, (error, redirectLocation, renderProps) => {
  console.log(renderProps)
  ReactDOM.hydrate(
    (
      <Provider store={store}>
        <Router {...renderProps} />
      </Provider>
    ), document.getElementById('root'),
  )
})
