import React, { Component } from 'react'
import { Menu, Checkbox } from 'semantic-ui-react'
import Dropdown from '../../utils/Dropdown'
import ImageModal from './ImageModal'
import ImageSizes from './ImageSizes'

let sizeOptions = [{
  value: ImageSizes.DEFAULT,
  text: '不指定',
}, {
  value: ImageSizes.MINI,
  text: 'Mini',
}, {
  value: ImageSizes.TINY,
  text: 'Tiny',
}, {
  value: ImageSizes.SMALL,
  text: 'Small',
}, {
  value: ImageSizes.MEDIUM,
  text: 'Medium',
}, {
  value: ImageSizes.LARGE,
  text: 'Large',
}, {
  value: ImageSizes.BIG,
  text: 'Big',
}, {
  value: ImageSizes.HUGE,
  text: 'Huge',
}, {
  value: ImageSizes.MASSIVE,
  text: 'Massive',
}]

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

  handleSizeChange = (e, { value }) => {
    let { updateValues } = this.props

    updateValues({ size: value })
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
          name="編輯圖片"
          onClick={this.handleInsertClick}
        />
        <Dropdown
          item
          header="尺寸"
          placeholder="尺寸"
          options={sizeOptions}
          value={block.values.size}
          onChange={this.handleSizeChange}
        />
        <Menu.Item>
          <Checkbox
            label="顯示圖片說明"
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
