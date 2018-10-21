import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import AvailableBlocks from '../constants/AvailableBlocks'

class BlockBucket extends Component {
  render() {
    return (
      <Droppable droppableId="droppable-block-bucket" isDropDisabled>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Menu borderless fluid vertical compact size="mini">
              {AvailableBlocks.map((block, idx) => (
                <Draggable
                  key={block.type}
                  draggableId={block.type}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Menu.Item link>
                        {block.label}
                      </Menu.Item>
                    </div>
                  )}
                </Draggable>
              ))}
            </Menu>
          </div>
        )}
      </Droppable>
    )
  }
}

export default BlockBucket
