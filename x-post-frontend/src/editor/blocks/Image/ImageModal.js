import React, { Component } from 'react'
import { Modal, Menu, Icon, Dimmer, Loader, Button } from 'semantic-ui-react'
import ManualInput from './pickers/ManualInput'
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

  render() {
    let { isOpen } = this.props
    let {
      src,
      activePicker,
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
        </Menu>
        <Modal.Content>
          {activePicker === SourceTypes.MANUAL_INPUT && (
            <ManualInput
              value={src}
              onChange={this.handleManualInputChange}
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
