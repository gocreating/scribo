import React from 'react'
import { Segment, Container, Divider, Dimmer, Loader } from 'semantic-ui-react'

let PageLoading = ({ active, content }) => (
  active ? (
    <Segment basic>
      <Container>
        <Divider hidden section />
        <Dimmer
          inverted
          active
          style={{ backgroundColor: 'inherit' }}
        >
          <Loader inverted content={content} />
        </Dimmer>
      </Container>
    </Segment>
  ) : (
    null
  )
)

PageLoading.defaultProps = {
  active: false,
  content: '載入中',
}

export default PageLoading
