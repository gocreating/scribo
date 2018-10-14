import React, { Component } from 'react'
import { Modal, Menu, Icon, Dimmer, Loader, Button } from 'semantic-ui-react'
import ManualInput from './pickers/ManualInput'
import ImgurUploadPublic from './pickers/ImgurUploadPublic'
import SourceTypes from './SourceTypes'

class ImageModal extends Component {
  state = {}

  componentDidMount() {
    this.initialize()
  }

  // Modal level member functions

  initialize = () => this.setState({
    src: this.props.block.values.src,
    activePicker: SourceTypes.MANUAL_INPUT,
    isLoading: false,
  })

  handleConfirm = () => {
    let { onConfirm } = this.props

    onConfirm(this.state.src)
  }

  handleCancel = () => {
    let { onCancel } = this.props

    this.initialize()
    onCancel()
  }

  handlePickerSelect = (e, { name }) => this.setState({
    activePicker: name,
  })

  // Image Picker level member functions

  handleManualInputChange = (e) => {
    this.setState({ src: e.target.value })
  }

  handleImgurUploadStart = () => this.setState({
    isLoading: true,
  })

  handleImgurUploadFinish = (result) => {
    let { deletehash, link } = result.data

    this.setState({
      src: link,
      activePicker: SourceTypes.MANUAL_INPUT,
      isLoading: false,
    })
  }

  handleImgurUploadError = (error) => {
    this.setState({ isLoading: false })
    alert(error.message)
  }

  render() {
    let { isOpen } = this.props
    let {
      src,
      activePicker,
      isLoading
    } = this.state

    if (!isOpen) {
      return null
    }

    return (
      <Modal
        open={isOpen}
        onClose={this.handleCancel}
      >
        <Menu
          pointing
          secondary
          style={{ marginBottom: 0 }}
        >
          <Menu.Item header>
            <Icon name="picture" />
            Edit Image
          </Menu.Item>
          <Menu.Item
            content="URL Link"
            name={SourceTypes.MANUAL_INPUT}
            active={activePicker === SourceTypes.MANUAL_INPUT}
            as="a"
            onClick={this.handlePickerSelect}
          />
          <Menu.Item
            content="Upload"
            name={SourceTypes.IMGUR_UPLOAD_PUBLIC}
            active={activePicker === SourceTypes.IMGUR_UPLOAD_PUBLIC}
            as="a"
            onClick={this.handlePickerSelect}
          />
        </Menu>
        <Modal.Content>
          {isLoading && (
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          )}
          {activePicker === SourceTypes.MANUAL_INPUT && (
            <ManualInput
              value={src}
              onChange={this.handleManualInputChange}
            />
          )}
          {activePicker === SourceTypes.IMGUR_UPLOAD_PUBLIC && (
            <ImgurUploadPublic
              onStart={this.handleImgurUploadStart}
              onFinish={this.handleImgurUploadFinish}
              onError={this.handleImgurUploadError}
            />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button primary onClick={this.handleConfirm}>
            <Icon name="checkmark" /> Use This Image
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ImageModal
