import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

let PostAbstract = ({ post, onDetele }) => (
  <Segment>
    <Link to={`/@${post.author.username}/${post.slug}`}>
      <Header size="huge">{post.title}</Header>
    </Link>
    {post.subtitle && (
      <Header sub>{post.subtitle}</Header>
    )}
    <br />
    <Link to={`/post/${post.id}/edit`}>Edit</Link> |
    <Link to="#" onClick={onDetele}>Delete</Link>
  </Segment>
)

export default PostAbstract
