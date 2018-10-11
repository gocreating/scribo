/**
 * Stop Using Uncontrollable Dynamic Import for Fixed CSS Files
 *
 * Problem
 *   For prism, plugin's style overwrites theme's style. Therefore, there are priorities between css files of plugin and theme.
 *
 *   So this works:
 *     (loadTheme(A) -> loadPlugin(A))
 *     <style>ThemeA</style>
 *     <style>PluginA</style>
 *
 *   But this does not work:
 *     (loadTheme(A) -> loadPlugin(A)) -> (loadTheme(B) -> loadPlugin(A)) -> (loadTheme(A) -> loadPlugin(A))
 *     <style>ThemeA</style>
 *     <style>PluginA</style>
 *     <style>ThemeB</style>
 *
 * Related Work
 *   Firstly, I think the imported module is cached. However, `delete require.cache[require.resolve('module/path')]` does not work!
 *   If you inspect the imported styles with devtool, you will find that import('xxx.css') actually injects an anonymous <style> tag inside <head>. Once the tag is injected, it will not be injected again, even when the tag is manually removed during componentWillUnmount().
 *
 * Method
 *   Use libraries that are able to automatically manage/remove imported resources.
 *
 * Experiment
 *   Helmet works!
 *
 * Conclusion
 *   You should load prism's css files with `helmet` instead of dynamic import() function.
 */
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Prism from 'prismjs'
import Themes from './Themes'
import Languages from './Languages'
import './CodeHighlight.css'

class CodeHighlight extends Component {
  prismBlock = React.createRef()

  componentDidMount = async () => {
    await this.loadLanguage()
    await this.loadPlugins()
    this.hightlight()
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

  loadPlugins = async () => {
    let { block } = this.props
    let { highlightLines } = block.values

    if (Boolean(highlightLines)) {
      await import('prismjs/plugins/line-highlight/prism-line-highlight.js')
    }
  }

  hightlight() {
    Prism.highlightElement(this.prismBlock.current)
  }

  renderLink(path) {
    return (
      <link
        rel="stylesheet"
        type="text/css"
        href={`${process.env.PUBLIC_URL}${path}`}
      />
    )
  }

  render() {
    let { block } = this.props
    let { theme, highlightLines } = block.values
    let lang = block.values.language
    let langClass = ''

    if (lang && lang !== Languages.DEFAULT) {
      langClass = `language-${lang.toLowerCase()}`
    }

    return [(
      <Helmet key="helmet">
        {theme === Themes.SOLARIZED_LIGHT && (
          this.renderLink('/prismjs/themes/prism-solarizedlight.css')
        )}
        {theme === Themes.OKAIDIA && (
          this.renderLink('/prismjs/themes/prism-okaidia.css')
        )}
        {Boolean(highlightLines) && (
          this.renderLink('/prismjs/plugins/line-highlight/prism-line-highlight.css')
        )}
      </Helmet>
    ), (
      <pre
        key="code-highlight"
        className={`code-highlight content ${langClass}`}
        data-line={highlightLines}
      >
        <code
          ref={this.prismBlock}
          className={langClass}
        >{block.values.code}</code>
      </pre>
    )]
  }
}

export default CodeHighlight
