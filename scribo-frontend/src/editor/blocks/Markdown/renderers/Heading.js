import React from 'react'
import Header from '../../Header/Header'

let Heading = (props) => {
  let { level, children } = props
  let block = {
    values: {
      level,
    },
  }

  return (
    <Header block={block}>
      {children}
    </Header>
  )
}

export default Heading
