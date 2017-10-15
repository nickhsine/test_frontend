
import concat from 'lodash.concat'
import get from 'lodash.get'
import merge from 'lodash.merge'
import types from '../action-types'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const _ = {
  concat,
  get,
  merge,
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
    case types.GET_LATEST_EVENTS: {
      const latestTimestamp = _.get(state, 'items.0.starting_timestamp', 0)
      let newItems = _.get(action, 'payload.items', [])
      newItems = newItems.filter((item) => {
        return item.starting_timestamp > latestTimestamp
      })
      return _.merge({}, state, {
        error: null,
        isFetching: false,
        items: _.concat(newItems, state.items || []),
        limit: _.get(action, 'payload.limit', 10),
        offset: _.get(action, 'payload.offset', 0),
        total: _.get(action, 'payload.total', 0),
      })
    }
    case types.GET_OLDER_EVENTS: {
      const len = _.get(state, 'items.length', 0)
      let olderItems = _.get(action, 'payload.items', [])
      if (len > 0) {
        const oldestTimestamp = _.get(state, ['items', len - 1, 'starting_timestamp'], 0)
        olderItems = olderItems.filter((item) => {
          return item.starting_timestamp < oldestTimestamp || oldestTimestamp === 0
        })
      }

      return _.merge({}, state, {
        error: null,
        isFetching: false,
        items: _.concat(state.items || [], olderItems),
        limit: _.get(action, 'payload.limit', 10),
        offset: _.get(action, 'payload.offset', 0),
        total: _.get(action, 'payload.total', 0),
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
