/* eslint no-console:0 */
import concat from 'lodash.concat'
import get from 'lodash.get'
import merge from 'lodash.merge'
import uniq from 'lodash.uniq'
import types from '../action-types'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const _ = {
  concat,
  get,
  merge,
  uniq,
}

/**
 * events is a redux reducer, which handles the redux actions
 *
 * @param {object} state={} store.getState().events
 * @param {object} action={} redux action
 * @returns {obejct} return value will replace store.getState().events
 */
function events(state = {}, action = {}) {
  switch (action.type) {
    case types.START_TO_GET_EVENTS: {
      return _.merge({}, state, {
        error: null,
        isFetching: true,
      })
    }
    case types.ERROR_TO_GET_EVENTS: {
      return _.merge({}, state, {
        error: _.get(action, 'payload.error'),
        isFetching: false,
      })
    }
    case types.GET_EVENTS: {
      console.log('action:', action)
      const newItems = _.get(action, 'payload.items', [])
      let items = _.concat(newItems, state.items || [])
      items = _.uniq(items, 'event_id')
      items.sort((e1, e2) => {
        return e2.starting_timestamp - e1.starting_timestamp
      })
      return _.merge({}, state, {
        error: null,
        isfetching: false,
        items,
        limit: _.get(action, 'payload.limit', 10),
        total: _.get(action, 'payload.total', 0),
      })
    }
    case types.NEW_A_EVENT: {
      const newItem = _.get(action, 'payload.item')
      const items = _.get(state, 'items', [])
      if (newItem) {
        items.unshift(newItem)
      }
      return _.merge({}, state, {
        error: null,
        isfetching: false,
        items,
        limit: _.get(state, 'limit', 10),
        total: _.get(state, 'total', 0) + 1,
      })
    }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  events,
  routing: routerReducer,
})

export default rootReducer
