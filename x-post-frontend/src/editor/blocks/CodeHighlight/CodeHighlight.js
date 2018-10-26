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
 *   Firstly, I think the imported module is cached. However, `delete require.cache[require.resolve('module/path')]`[1][1] does not work!
 *   Magic comments of webpack's [code splitting][2] are not working.
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
 *
 * Reference
 *   [1]: https://stackoverflow.com/questions/15666144/how-to-remove-module-after-require-in-node-js "How to remove module after “require” in node.js?"
 *   [2]: https://webpack.js.org/guides/code-splitting/#dynamic-imports "Code Splitting"
 */
import React, { Component } from 'react'
import classNames from 'classnames'
import Prism from 'prismjs'
import Themes from './Themes'
import Languages from './Languages'
import './CodeHighlight.css'

class CodeHighlight extends Component {
  prismBlock = React.createRef()

  componentDidMount = async () => {
    await this.loadTheme()
    await this.loadLanguage()
    await this.loadPlugins()
    this.hightlight()
  }

  loadTheme = async () => {
    let { block } = this.props
    let { theme } = block.values

    switch (theme) {
      case Themes.SOLARIZED_LIGHT: return await import('./prism-styles/themes/modified-prism-solarizedlight.css')
      case Themes.OKAIDIA: return await import('./prism-styles/themes/modified-prism-okaidia.css')
      default: break
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

  loadPlugins = async () => {
    let { block } = this.props
    let {
      isShowLineNumbers,
      highlightLines,
    } = block.values

    if (Boolean(isShowLineNumbers)) {
      await import('./prism-styles/plugins/line-numbers/prism-line-numbers.css')
      await import('prismjs/plugins/line-numbers/prism-line-numbers.min.js')
    }
    if (Boolean(highlightLines)) {
      await import('./prism-styles/plugins/line-highlight/modified-prism-line-highlight.css')
      await import('prismjs/plugins/line-highlight/prism-line-highlight.min.js')
    }
  }

  hightlight() {
    setTimeout(() => {
      // wait for .css files are ready
      // so that .js files will work
      Prism.highlightElement(this.prismBlock.current)
    }, 500)
  }

  renderLink = (path) =>(
    <link
      rel="stylesheet"
      type="text/css"
      href={`${process.env.PUBLIC_URL}${path}`}
    />
  )

  render() {
    let { block } = this.props
    let {
      code,
      theme,
      language,
      isShowLineNumbers,
      highlightLines,
    } = block.values
    let cxLang = (
      language &&
      language !== Languages.DEFAULT
    ) ? `language-${language.toLowerCase()}` : ''
    let cxPre = classNames(
      'code-highlight',
      'content',
      cxLang,
      {
        'line-numbers': isShowLineNumbers,
      }
    )
    let cxCode = classNames(
      cxLang,
      {
        'line-numbers': isShowLineNumbers,
      }
    )
    let cxCustomized = classNames(
      'code-highlight content',
      {
        'theme-solarizedlight': theme === Themes.SOLARIZED_LIGHT,
        'theme-okaidia': theme === Themes.OKAIDIA,
        'x-post-line-highlight': Boolean(highlightLines),
      }
    )

    return (
      <div className={cxCustomized}>
        <pre
          className={cxPre}
          data-line={highlightLines}
        >
          <code
            ref={this.prismBlock}
            className={cxCode}
          >{code}</code>
        </pre>
      </div>
    )
  }
}

export default CodeHighlight
