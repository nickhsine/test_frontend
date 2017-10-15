import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: grey;
  width: 100%;
  text-align: center;
`

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        this is a root component
      </Container>
    )
  }
}
