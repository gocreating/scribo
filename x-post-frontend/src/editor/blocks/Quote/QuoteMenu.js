import React, { Component } from 'react'
import { Menu, Dropdown, Checkbox, Input } from 'semantic-ui-react'

class QuoteMenu extends Component {
  handleShowCiteChange = (e, { checked }) => {
    let { updateValues } = this.props

    updateValues({ isShowCite: checked })
  }

  render() {
    let { block } = this.props

    return (
      <Menu inverted icon borderless size="mini">
        <Menu.Item>
          <Checkbox
            label="Show cite"
            className="white"
            checked={block.values.isShowCite}
            onChange={this.handleShowCiteChange}
          />
        </Menu.Item>
      </Menu>
    )
  }
}

export default QuoteMenu
