import React, { Component } from 'react'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'

let DragHandle = SortableHandle(() => (
  <span>::</span>
))

let SortableItem = SortableElement(({ value }) => {
  return (
    <li>
      <DragHandle />
      {value}
    </li>
  )
})

let SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={value}
        />
      ))}
    </ul>
  )
})

class SortableComponent extends Component {
  state = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let { items } = this.state

    this.setState({
      items: arrayMove(items, oldIndex, newIndex),
    })
  }

  render() {
    let { items } = this.state

    return (
      <SortableList
        items={items}
        onSortEnd={this.onSortEnd}
        useDragHandle={true}
      />
    )
  }
}

export default SortableComponent
