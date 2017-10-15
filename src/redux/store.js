
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(history, initialState) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)
  const middlewares = [reduxRouterMiddleware, thunkMiddleware]

  const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default //eslint-disable-line
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
