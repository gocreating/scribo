import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import BlockHandle from './BlockHandle'

class BlockToolbar extends Component {
  render() {
    return (
      <div className="toolbar">
        <Menu icon borderless fluid vertical compact size="mini">
          <BlockHandle />
          <Menu.Item
            link
            onClick={this.props.onPrependClick}
          >
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
          </Menu.Item>
          <Menu.Item
            link
            onClick={this.props.onAppendClick}
          >
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
          </Menu.Item>
          <Menu.Item
            link
            onClick={this.props.onRemoveClick}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default BlockToolbar
