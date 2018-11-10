import React, { Component } from 'react'
import { Modal, Menu, Icon, Dimmer, Loader, Button } from 'semantic-ui-react'
import ManualInput from './pickers/ManualInput'
import ImgurUploadPublic from './pickers/ImgurUploadPublic'
import SourceTypes from './SourceTypes'

class ImageModal extends Component {
  state = {
    isUploadError: false,
  }

  componentDidMount() {
    this.initialize()
  }

  // Modal level member functions

  initialize = () => this.setState({
    blockValues: {
      ...this.props.block.values,
    },
    activePicker: SourceTypes.MANUAL_INPUT,
    isLoading: false,
    loadingText: 'Loading',
  })

  handleConfirm = () => {
    let { onConfirm } = this.props

    onConfirm(this.state.blockValues)
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
    this.setState({
      blockValues: {
        ...this.state.blockValues,
        sourceType: SourceTypes.MANUAL_INPUT,
        src: e.target.value,
        meta: {},
      },
    })
  }

  handleImgurUploadStart = () => this.setState({
    isLoading: true,
    isUploadError: false,
    loadingText: 'Your image is uploading...',
  })

  handleImgurUploading = ({ percent }) => {
    let { isUploadError } = this.state

    this.setState({
      isLoading: true && !isUploadError,
      loadingText: `Your image is uploading...${parseInt(percent)}%`,
    })
  }

  handleImgurUploadFinish = (result) => {
    let {
      width,
      height,
      deletehash,
      link,
    } = result.data

    this.setState({
      blockValues: {
        ...this.state.blockValues,
        src: link,
        sourceType: SourceTypes.IMGUR_UPLOAD_PUBLIC,
        meta: {
          width,
          height,
          deletehash,
        }
      },
      activePicker: SourceTypes.MANUAL_INPUT,
      isLoading: false,
      isUploadError: false,
    })
  }

  handleImgurUploadError = (error) => {
    this.setState({
      isLoading: false,
      isUploadError: true,
    })
    alert(error.message)
  }

  render() {
    let { isOpen } = this.props
    let {
      blockValues,
      activePicker,
      isLoading,
      loadingText,
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
              <Loader inverted>{loadingText}</Loader>
            </Dimmer>
          )}
          {activePicker === SourceTypes.MANUAL_INPUT && (
            <ManualInput
              value={blockValues.src}
              onChange={this.handleManualInputChange}
            />
          )}
          {activePicker === SourceTypes.IMGUR_UPLOAD_PUBLIC && (
            <ImgurUploadPublic
              onStart={this.handleImgurUploadStart}
              onUploading={this.handleImgurUploading}
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
