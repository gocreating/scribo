import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faAngleUp,
  faAngleDown,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import BlockTypes from '../constants/BlockTypes'
import CodeHighlightThemes from './blocks/CodeHighlight/Themes'

let BlockToolbar = ({
  preview,
  onPreviewClick,
  onPrependClick,
  onAppendClick,
  onRemoveClick,
}) => (
  <div className="toolbar">
    <Menu icon borderless fluid vertical compact size="mini">
      <Menu.Item
        link
        onClick={onPreviewClick}
      >
        <FontAwesomeIcon
          icon={preview ? faEyeSlash : faEye}
        />
      </Menu.Item>
      <Menu.Item
        link
        onClick={onRemoveClick}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Menu.Item>
    </Menu>
  </div>
)

export default BlockToolbar
