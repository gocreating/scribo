import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import Dropdown from '../../utils/Dropdown'
import Typesettings from './Typesettings'

let typesettingOptions = [{
  value: Typesettings.RAW,
  text: '原始文字',
}, {
  value: Typesettings.HAN,
  text: '最佳化（Beautify Hanzi）',
}, {
  value: Typesettings.PANGU,
  text: '自動填補文字間距（Space Patching）',
}]

class ParagraphMenu extends Component {
  handleTypesettingChange = (e, { value }) => {
    let { updateValues } = this.props

    updateValues({ typesetting: value })
  }

  render() {
    let { block } = this.props

    return (
      <Menu inverted icon borderless size="mini">
        <Dropdown
          item
          header="排版方式"
          placeholder="Typesetting"
          options={typesettingOptions}
          value={block.values.typesetting}
          onChange={this.handleTypesettingChange}
        />
      </Menu>
    )
  }
}

export default ParagraphMenu
