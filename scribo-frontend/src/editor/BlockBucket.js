import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AvailableBlocks from '../constants/AvailableBlocks'
import './BlockBucket.css'

class BlockBucket extends Component {
  render() {
    return (
      <Droppable droppableId="droppable-block-bucket" isDropDisabled>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Menu
              borderless
              fluid
              vertical
              compact
              size="mini"
              icon="labeled"
              className="block-bucket"
            >
              {AvailableBlocks.map((block, idx) => (
                <Draggable
                  key={block.type}
                  draggableId={block.type}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <React.Fragment>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Menu.Item link>
                          {block.icon && (
                            <>
                              <FontAwesomeIcon icon={block.icon} />
                              <br />
                            </>
                          )}
                          {block.label}
                        </Menu.Item>
                      </div>
                      {snapshot.isDragging && (
                        <Menu.Item link className="hide-sibling">
                          {block.icon && (
                            <>
                              <FontAwesomeIcon icon={block.icon} />
                              <br />
                            </>
                          )}
                          {block.label}
                        </Menu.Item>
                      )}
                    </React.Fragment>
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
