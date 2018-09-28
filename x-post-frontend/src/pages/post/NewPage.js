import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import AppLayout from '../../layouts/AppLayout'
import XEditor from '../../editor/XEditor'

let NewPage = () => (
  <AppLayout>
    <Segment basic compact>
      <Header>
        New Post
      </Header>
    </Segment>
    <XEditor />
  </AppLayout>
)

export default NewPage
