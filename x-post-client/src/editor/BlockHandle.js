import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'
import '@fortawesome/fontawesome-free/css/all.css'

let BlockHandle = (() => (
  <i className="handle fas fa-arrows-alt" />
))

export default SortableHandle(BlockHandle)
