import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'

let BlockHandle = ({ dragHandleProps }) => (
  <div
    className="handle"
    {...dragHandleProps}
    tabIndex="-1"
  >
    <FontAwesomeIcon icon={faGripVertical} />
  </div>
)

export default BlockHandle
