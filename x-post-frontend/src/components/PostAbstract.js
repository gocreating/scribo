import React from 'react'
import { Segment } from 'semantic-ui-react'

let PostAbstract = ({ post }) => (
  <Segment>
    {post.title}
  </Segment>
)

export default PostAbstract
