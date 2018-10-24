import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowsAlt,
  faEye,
  faEyeSlash,
  faAngleUp,
  faAngleDown,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import BlockTypes from '../constants/BlockTypes'
import CodeHighlightThemes from './blocks/CodeHighlight/Themes'

const AvailableBlocks = [{
  type: BlockTypes.PARAGRAPH,
  label: 'Paragraph',
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.HEADER,
  label: 'Header',
  insertValues: {
    text: '',
    level: 1,
  },
}, {
  type: BlockTypes.CODE_HIGHLIGHT,
  label: 'Code Highlight',
  insertValues: {
    code: '',
    theme: CodeHighlightThemes.SOLARIZED_LIGHT,
  },
}, {
  type: BlockTypes.MARKDOWN,
  label: 'Markdown',
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.IMAGE,
  label: 'Image',
  insertValues: {
    src: '',
    isShowCaption: false,
    caption: '',
  },
}, {
  type: BlockTypes.QUOTE,
  label: 'Quote',
  insertValues: {
    text: '',
    isShowCite: false,
    cite: '',
  },
}]

class BlockToolbar extends Component {
  render() {
    let {
      dragHandleProps,
      preview,
      onPreviewClick,
      onPrependClick,
      onAppendClick,
      onRemoveClick,
    } = this.props

    return (
      <div className="toolbar">
        <Menu icon borderless fluid vertical compact size="mini">
          <Menu.Item link className="handle" {...dragHandleProps}>
            <FontAwesomeIcon icon={faArrowsAlt} />
          </Menu.Item>
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
