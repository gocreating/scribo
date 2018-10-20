import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

let PostAbstract = ({ post }) => (
  <Segment>
    <Link to={`/@${post.author.username}/${post.slug}`}>
      <Header size="huge">{post.title}</Header>
    </Link>
    {post.subtitle && (
      <Header sub>{post.subtitle}</Header>
    )}
  </Segment>
)

export default PostAbstract
