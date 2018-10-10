import React, { Component } from 'react'
import Prism from 'prismjs'
import Themes from './Themes'
import Languages from './Languages'
import './CodeHighlight.css'

class CodeHighlight extends Component {
  prismBlock = React.createRef()

  componentDidMount = async () => {
    await this.loadTheme()
    await this.loadLanguage()
    this.hightlight()
  }

  loadTheme = async () => {
    let { block } = this.props

    switch (block.values.theme) {
      case Themes.SOLARIZED_LIGHT: return await import('prismjs/themes/prism-solarizedlight.css')
      case Themes.OKAIDIA: return await import('prismjs/themes/prism-okaidia.css')
    }
  }

  loadLanguage = async () => {
    let { block } = this.props
    let lang = block.values.language

    switch (lang) {
      case Languages.JSON: return await import('prismjs/components/prism-json.min.js')
      case Languages.JSX: return await import('prismjs/components/prism-jsx.min.js')
      default: break
    }
  }

  hightlight() {
    Prism.highlightElement(this.prismBlock.current)
  }

  render() {
    let { block } = this.props
    let lang = block.values.language
    let langClass = ''

    if (lang && lang !== Languages.DEFAULT) {
      langClass = `language-${lang.toLowerCase()}`
    }

    return (
      <pre
        className={`code-highlight content ${langClass}`}
      >
        <code ref={this.prismBlock}>{block.values.code}</code>
      </pre>
    )
  }
}

export default CodeHighlight
