import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faAngleUp, faAngleDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import BlockHandle from './BlockHandle'
import BlockTypes from '../constants/BlockTypes'

const AvailableBlocks = [{
  type: BlockTypes.PLAIN_TEXT,
  label: 'Plain Text',
  insertValues: {
    text: '',
  },
}]

class BlockToolbar extends Component {
  render() {
    let {
      preview,
      onPreviewClick,
      onPrependClick,
      onAppendClick,
      onRemoveClick,
    } = this.props

    return (
      <div className="toolbar">
        <Menu icon borderless fluid vertical compact size="mini">
          <BlockHandle />
          <Menu.Item
            link
            onClick={onPreviewClick}
          >
            <FontAwesomeIcon
              icon={preview ? faEyeSlash : faEye}
            />
          </Menu.Item>
          <Dropdown item icon={
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon
                icon={faPlusSquare}
                transform="shrink-1 up-6"
              />
              <FontAwesomeIcon
                icon={faAngleUp}
                transform="shrink-1 down-6"
              />
            </span>
          }>
            <Dropdown.Menu>
              {AvailableBlocks.map(block => (
                <Dropdown.Item
                  key={block.type}
                  onClick={onPrependClick.bind(
                    this,
                    block.type,
                    block.insertValues
                  )}
                >
                  {block.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item icon={
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon
                icon={faAngleDown}
                transform="shrink-1 up-6"
              />
              <FontAwesomeIcon
                icon={faPlusSquare}
                transform="shrink-1 down-6"
              />
            </span>
          }>
            <Dropdown.Menu>
              {AvailableBlocks.map(block => (
                <Dropdown.Item
                  key={block.type}
                  onClick={onAppendClick.bind(
                    this,
                    block.type,
                    block.insertValues
                  )}
                >
                  {block.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item
            link
            onClick={onRemoveClick}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default BlockToolbar
