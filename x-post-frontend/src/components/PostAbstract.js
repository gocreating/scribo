import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

let PostAbstract = ({ post, onDetele }) => (
  <Segment>
    <Link to={`/user/${post.authorId}/post/${post.id}`}>
      <Header size="huge">{post.title}</Header>
    </Link>
    <br />
    <Link to={`/post/${post.id}/edit`}>Edit</Link> |
    <Link to="#" onClick={onDetele}>Delete</Link>
  </Segment>
)

export default PostAbstract
