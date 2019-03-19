import React, { Component } from 'react'
import { Modal, Menu, Dimmer, Loader, Button } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faUpload, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import ManualInput from './pickers/ManualInput'
import ImgurUploadPublic from './pickers/ImgurUploadPublic'
import SourceTypes from './SourceTypes'

class ImageModal extends Component {
  state = {
    activePicker: SourceTypes.MANUAL_INPUT,
    isLoading: false,
    blockValues: {},
    isUploadError: false,
    loadingText: 'Loading',
  }
  
  componentDidMount() {
    this.snapshotBlockValues()
  }

  componentDidUpdate(prevProps) {
    if (this.props.block.values !== prevProps.block.values) {
      this.snapshotBlockValues()
    }
  }

  // Modal level member functions

  snapshotBlockValues = () => this.setState({
    blockValues: {
      ...this.props.block.values,
    },
  })

  handleConfirm = () => {
    let { onConfirm } = this.props

    onConfirm(this.state.blockValues)
  }

  handleCancel = () => {
    let { onCancel } = this.props

    this.snapshotBlockValues()
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
        closeOnDimmerClick={false}
      >
        <Menu
          pointing
          secondary
          style={{ marginBottom: 0 }}
        >
          <Menu.Item header>
            <FontAwesomeIcon icon={faImage} />
            {'　編輯圖片'}
          </Menu.Item>
          <Menu.Item
            name={SourceTypes.MANUAL_INPUT}
            active={activePicker === SourceTypes.MANUAL_INPUT}
            as="a"
            onClick={this.handlePickerSelect}
          >
            <FontAwesomeIcon icon={faLink} />
            {'　超連結'}
          </Menu.Item>
          <Menu.Item
            name={SourceTypes.IMGUR_UPLOAD_PUBLIC}
            active={activePicker === SourceTypes.IMGUR_UPLOAD_PUBLIC}
            as="a"
            onClick={this.handlePickerSelect}
          >
            <FontAwesomeIcon icon={faUpload} />
            {'　上傳'}
          </Menu.Item>
        </Menu>
        <Modal.Content>
          {isLoading && (
            <Dimmer active inverted>
              <Loader inverted>{loadingText}</Loader>
            </Dimmer>
          )}
          {activePicker === SourceTypes.MANUAL_INPUT && (
            <ManualInput
              value={blockValues.src || ''}
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
          <Button onClick={this.handleCancel}>取消</Button>
          <Button primary onClick={this.handleConfirm}>
            <FontAwesomeIcon icon={faCheck} />
            {'　確定'}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ImageModal
