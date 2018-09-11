import React from 'react'
import { Loader, Dimmer, Segment } from 'semantic-ui-react'
import AppLayout from '../layouts/AppLayout'

let PageLoading = () => (
  <AppLayout>
    <Segment basic>
      <Dimmer active inverted>
        <Loader inverted content='Loading' />
      </Dimmer>
    </Segment>
  </AppLayout>
)

export default PageLoading
