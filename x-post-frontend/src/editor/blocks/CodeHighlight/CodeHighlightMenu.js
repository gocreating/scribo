import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import Themes from './Themes'
import Languages from './Languages'

let themeOptions = [{
  value: Themes.SOLARIZED_LIGHT,
  text: 'Solarized Light',
}, {
  value: Themes.OKAIDIA,
  text: 'Okaidia',
}]

let languageOptions = [{
  value: Languages.DEFAULT,
  text: 'Don\'t set language',
}, {
  value: Languages.MARKUP,
  text: 'Markup',
}, {
  value: Languages.CSS,
  text: 'CSS',
}, {
  value: Languages.C_LIKE,
  text: 'C-like',
}, {
  value: Languages.JAVASCRIPT,
  text: 'Javascript',
}, {
  value: Languages.JSON,
  text: 'Json',
}, {
  value: Languages.JSX,
  text: 'React JSX',
}]

class CodeHighlightMenu extends Component {
  handleThemeChange = (e, { value }) => {
    let { updateValues } = this.props

    updateValues({ theme: value })
  }

  handleLanguageChange = (e, { value }) => {
    let { updateValues } = this.props

    updateValues({ language: value })
  }

  render() {
    let { config, block } = this.props

    return (
      <Menu inverted icon borderless fluid size="mini">
        <Dropdown
          item
          header="Theme"
          placeholder="Theme"
          options={themeOptions}
          value={block.values.theme}
          onChange={this.handleThemeChange}
        />
        <Dropdown
          item
          header="Language"
          placeholder="Language"
          options={languageOptions}
          value={block.values.language}
          onChange={this.handleLanguageChange}
          search
          selection
          scrolling
        />
      </Menu>
    )
  }
}

export default CodeHighlightMenu
