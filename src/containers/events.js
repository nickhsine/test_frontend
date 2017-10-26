/* global socket */
/* eslint no-console: 0 */
import EventCard from '../components/event-card'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import get from 'lodash.get'
import styled from 'styled-components'
import { CSSTransitionGroup } from 'react-transition-group'
import { connect } from 'react-redux'
import { fetchEvents, newAEvent, viewEvent, tagEvent } from '../redux/actions/index'

const LIMIT = 5
const OFFSET = 0

const _ = {
  get,
}

const Container = styled.div`
  background-color: grey;
  font-size: 30px;
  min-height: 100vh;
`

const More = styled.div`
  width: 100%;
  background-color: #000000;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 30px;
  font-weight: 700;
  padding-bottom: 20px;
  padding-top: 20px;
  text-align: center;
`

const StyledCSSTransitionGroup = styled(CSSTransitionGroup)`
  .effect-enter {
    opacity: 0;
  }

  .effect-enter.effect-enter-active {
    opacity: 1;
    transition: opacity 1s ease-in-out;
  }

  .effect-leave {
    opacity: 1;
  }

  .effect-leave.effect-leave-active {
    opacity: 0;
    transition: opacity 300ms ease-in;
  }
`

class Events extends PureComponent {
  /**
   * fetchData is used on server side, and it pulls data for server-side-rendering
   *
   * @static
   * @param {object} - props
   * @param {object} - props.params, passed by react-router
   * @param {object} - props.store, redux store
   * @returns {object} - a Promise
   */
  static fetchData({ store }) {
    // call action
    return fetchEvents(OFFSET, LIMIT)(store.dispatch)
  }

  constructor(props) {
    super(props)
    this.loadMore = this._loadMore.bind(this)
  }

  componentWillMount() {
    if (_.get(this.props, 'events.items.length', 0) < LIMIT) {
      this.props.fetchEvents(OFFSET, LIMIT)
    }
  }

  componentDidMount() {
    if (socket) {
      // pull data by WebSocket
      const onmessage = (evt) => {
        const data = JSON.parse(evt.data)
        this.props.newAEvent(data)
      }
      socket.onmessage = onmessage.bind(this)
    } else {
      // fallback - polling data periodically
      const _fetchEvents = this.props.fetchEvents

      const fetchEventsPeriodically = () => {
        _fetchEvents()
          .then(() => {
            setTimeout(fetchEventsPeriodically, 1000)
          })
      }

      setTimeout(fetchEventsPeriodically, 1000)
    }
  }

  onMessageReceived = (data) => {
    console.log(data)
  }

  _loadMore() {
    const { events } = this.props
    const count = _.get(events, 'items.length', 0)
    const total = _.get(events, 'total', 0)
    if (count <= total) {
      this.props.fetchEvents(count, LIMIT)
    }
  }

  render() {
    const { events } = this.props
    console.log('render events:', events)
    const items = _.get(events, 'items', [])
    const total = _.get(events, 'total', 0)

    const eventsJSX = items.map((item) => {
      const eventID = _.get(item, 'event_id')
      const cameraID = _.get(item, 'camera_id')
      const isViewed = _.get(item, 'is_viewed')
      const prediction = _.get(item, 'prediction', 'not provided')
      const startingTimestamp = _.get(item, 'starting_timestamp')
      const thumbnail = _.get(item, 'thumbnail', '')

      if (eventID) {
        return (
          <EventCard
            key={eventID}
            eventID={eventID}
            cameraID={cameraID}
            isViewed={isViewed}
            prediction={prediction}
            startingTimestamp={startingTimestamp}
            thumbnail={thumbnail}
            onViewing={this.props.viewEvent}
            tagEvent={this.props.tagEvent}
          />
        )
      }
      return null
    })

    const moreJSX = items.length < total ? (
      <More
        onClick={this.loadMore}
      >
        More
      </More>
    ) : null

    return (
      <Container>
        <StyledCSSTransitionGroup
          key="transition"
          transitionName="effect"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}
        >
          {eventsJSX}
        </StyledCSSTransitionGroup>
        {moreJSX}
      </Container>
    )
  }
}

Events.propTypes = {
  events: PropTypes.object.isRequired,
  fetchEvents: PropTypes.func.isRequired,
  viewEvent: PropTypes.func.isRequired,
  newAEvent: PropTypes.func.isRequired,
}

Events.contextTypes = {
  location: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    events: state.events,
  }
}

export default connect(mapStateToProps, {
  fetchEvents, newAEvent, viewEvent, tagEvent,
})(Events)
