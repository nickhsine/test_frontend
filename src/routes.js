// polyfill webpack require.ensure for node environment
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

import React from 'react'
import { IndexRoute, Route, Router, browserHistory } from 'react-router'

function loadRoute(cb) {
  return (module) => {
    cb(null, module.default || module)
  }
}

function errorLoading(err) {
  console.error('Err to load module:', err) //eslint-disable-line
}

/**
 * createRoutes
 * Code splitting and dynamic loading bundles by webpack require.ensure.
 * require.ensure is defined only in webpack, so the first line in this file is a polyfill for node environment.
 *
 * The following `import` in the `getComponent` function will be transpiled to `require.ensure` by babel
 * through `babel-plugin-system-import-transformer` plugin.
 *
 * @param {object} history default is react-router.browserHistory
 * @returns {object} React Router component
 */
export default function createRoutes(history = browserHistory) {
  return (
    <Router history={history} >
      <Route path="/">
        <IndexRoute
          getComponent={(location, cb) => {
            import('./containers/events').then(loadRoute(cb)).catch(errorLoading)
          }}
        />
      </Route>
    </Router>
  )
}
