import React from 'react'
import { Menu } from 'semantic-ui-react'
import { SortableHandle } from 'react-sortable-hoc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons'

let BlockHandle = (() => (
  <Menu.Item link className="handle">
    <FontAwesomeIcon icon={faArrowsAlt} />
  </Menu.Item>
))

export default SortableHandle(BlockHandle)
