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

const CloseBT = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
`

const Content = styled.ul`
  cursor: pointer;
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

const Tag = styled.button`
  font-size: 20px;
  background-color: ${props => (props.isToggled ? '#e2e2e2' : '#FFF')}
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
    tagEvent: PropTypes.func.isRequired,
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
      isToggled: true,
      selectedTag: '',
    }
    this.handleViewing = this._handleViewing.bind(this)
    this.handleClick = this._handleClick.bind(this)
    this.handleToggle = this._handleToggle.bind(this)
  }

  _handleToggle() {
    this.setState({
      isToggled: !this.state.isToggled,
    })
  }

  _handleClick(e, tag) {
    e.stopPropagation()
    const setState = () => {
      this.setState({
        isToggled: !this.state.isToggled,
        selectedTag: tag,
      })
    }
    this.props.tagEvent(this.props.eventID, tag)
      .then(setState.bind(this))
  }


  _handleViewing(eventID) {
    const self = this
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
    const { isViewed, isToggled, selectedTag } = this.state

    const tags = ['people', 'auto', 'animal', 'other']

    const tagsJSX = isToggled ? null : tags.map((tag) => {
      return (
        <Tag
          key={tag}
          onClick={(e) => { this.handleClick(e, tag) }}
          isToggled={tag === selectedTag}
        >{tag}
        </Tag>
      )
    })


    return (
      <Container>
        { isToggled ? null : <CloseBT onClick={this.handleToggle}>X</CloseBT> }
        <ViewEvent
          onClick={() => { this.handleViewing(eventID) }}
        >
          { isViewed ?
            <ViewedSVG /> : <NotViewSVG />
          }
        </ViewEvent>
        <Content
          onClick={this.handleToggle}
        >
          <Item>EventID: {eventID}</Item>
          <Item>Tag: {selectedTag}</Item>
          <Item>cameraID: {cameraID}</Item>
          <Item>prediction: {prediction}</Item>
          <Item>startingTime: {startingTimestamp}</Item>
          <Item>thumbnail: {thumbnail}</Item>
          {tagsJSX}
        </Content>
      </Container>
    )
  }
}
