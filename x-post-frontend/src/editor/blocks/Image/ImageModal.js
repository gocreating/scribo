import React, { Component } from 'react'
import { Modal, Form, Button, Menu, Icon } from 'semantic-ui-react'
import SourceTypes from './SourceTypes'

class ImageModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      src: props.block.values.src,
      activePicker: SourceTypes.MANUAL_INPUT,
    }
  }

  handleSrcChange = (e) => {
    this.setState({ src: e.target.value })
  }

  handleConfirm = () => {
    let { onConfirm } = this.props

    onConfirm(this.state.src)
  }

  handleCancel = () => {
    let { block, onCancel } = this.props

    this.setState({ src: block.values.src })
    onCancel()
  }

  handlePickerSelect = (e, { name }) => this.setState({
    activePicker: name,
  })

  render() {
    let { isOpen } = this.props
    let { activePicker, src } = this.state

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
            <Form>
              <Form.Field>
                <label>URL Link to Image</label>
                <input
                  placeholder="URL"
                  value={src}
                  onChange={this.handleSrcChange}
                />
              </Form.Field>
            </Form>
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
