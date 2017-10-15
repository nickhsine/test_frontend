/* eslint no-console:0 */
import NotViewSVG from '../../static/viewed.svg'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ViewedSVG from '../../static/not-viewed.svg'
import styled from 'styled-components'

const Container = styled.div`
  background-color: white;
  position: relative;
  margin: 0 auto;
  margin-bottom: 30px;
`

const Content = styled.ul`
  margin: 0 auto;
  width: 80%;
  list-style-type: none;
`

const Item = styled.li`
  font-size: 20px;
  font-weight: 500;
`

const ViewEvent = styled.div`
  left: 1%;
  position: absolute;
  top: 0;
  width: 5%;
  cursor: pointer;
`

export default class EventCard extends Component {
  static propTypes = {
    cameraID: PropTypes.string.isRequired,
    eventID: PropTypes.number.isRequired,
    isViewed: PropTypes.bool,
    onViewing: PropTypes.func.isRequired,
    prediction: PropTypes.string,
    startingTimestamp: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
  }
  static defaultProps = {
    isViewed: false,
    prediction: 'not provided',
    thumbnail: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      isViewed: props.isViewed,
    }
    this.handleViewing = this._handleViewing.bind(this)
  }

  _handleViewing(eventID) {
    const self = this
    console.log('handleViewing...')
    this.props.onViewing(eventID)
      .then(() => {
        console.log('handled')
        self.setState({
          isViewed: true,
        })
      }).catch((error) => {
        // TODO pop up error message
        console.error(`Viewing a event(ID: ${eventID}) occurs error:`, error)
        alert('api is temporarily out of service')
      })
  }

  render() {
    const {
      cameraID, eventID, prediction, startingTimestamp, thumbnail,
    } = this.props
    const { isViewed } = this.state
    return (
      <Container>
        <ViewEvent
          onClick={() => { this.handleViewing(eventID) }}
        >
          { isViewed ?
            <ViewedSVG /> : <NotViewSVG />
          }
        </ViewEvent>
        <Content>
          <Item>EventID: {eventID}</Item>
          <Item>cameraID: {cameraID}</Item>
          <Item>prediction: {prediction}</Item>
          <Item>startingTime: {startingTimestamp}</Item>
          <Item>thumbnail: {thumbnail}</Item>
        </Content>
      </Container>
    )
  }
}
