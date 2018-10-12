import React from 'react'
import { Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

let PostAbstract = ({ post, onDetele }) => (
  <Segment>
    {post.title}
    <br />
    <Link to={`/user/${post.authorId}/post/${post.id}`}>Read</Link> |
    <Link to={`/post/${post.id}/edit`}>Edit</Link> |
    <Link to="#" onClick={onDetele}>Delete</Link>
  </Segment>
)

export default PostAbstract
