import React from 'react'
import { Link } from 'react-router-dom'

let Navigation = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/post/new">New Post</Link>
    </li>
  </ul>
)

export default Navigation
