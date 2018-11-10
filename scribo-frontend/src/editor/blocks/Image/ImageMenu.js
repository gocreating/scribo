import React, { Component } from 'react'
import { Menu, Checkbox } from 'semantic-ui-react'
import ImageModal from './ImageModal'

class ImageMenu extends Component {
  state = {
    isModalOpen: false,
  }

  handleInsertClick = () => {
    this.setState({ isModalOpen: true })
  }

  handleModalConfirm = (values) => {
    let { updateValues } = this.props

    updateValues(values)
    this.setState({ isModalOpen: false })
  }

  handleModalCancel = () => {
    this.setState({ isModalOpen: false })
  }

  handleShowCaptionChange = (e, { checked }) => {
    let { updateValues } = this.props

    updateValues({ isShowCaption: checked })
  }

  render() {
    let { block } = this.props
    let { isModalOpen } = this.state

    return (
      <Menu inverted icon borderless size="mini">
        <ImageModal
          isOpen={isModalOpen}
          onConfirm={this.handleModalConfirm}
          onCancel={this.handleModalCancel}
          block={block}
        />
        <Menu.Item
          link
          name="Edit Image"
          onClick={this.handleInsertClick}
        />
        <Menu.Item>
          <Checkbox
            label="Show caption"
            className="white"
            checked={block.values.isShowCaption}
            onChange={this.handleShowCaptionChange}
          />
        </Menu.Item>
      </Menu>
    )
  }
}

export default ImageMenu
