// ref: <https://github.com/kriasoft/react-starter-kit/blob/master/docs/recipes/how-to-integrate-disqus.md>
import React from 'react'
import PropTypes from 'prop-types'
import config from '../config'

const SHORTNAME = config.disqusShortname
const WEBSITE_URL = config.host

function renderDisqus() {
  if (window.DISQUS === undefined) {
    // manually controlled language
    // ref: <https://help.disqus.com/installation/multi-lingual-websites>
    window.disqus_config = function () {
      this.language = 'zh'
    }

    let script = document.createElement('script')
    script.async = true
    script.src = 'https://' + SHORTNAME + '.disqus.com/embed.js'
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}

class DisqusThread extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.id !== nextProps.id ||
      this.props.title !== nextProps.title ||
      this.props.path !== nextProps.path
    )
  }

  componentDidMount() {
    renderDisqus()
  }

  componentDidUpdate() {
    renderDisqus()
  }

  render() {
    let { id, title, path, ...other } = this.props

    if (typeof window !== 'undefined') {
       window.disqus_shortname = SHORTNAME
       window.disqus_identifier = id
       window.disqus_title = title
       window.disqus_url = WEBSITE_URL + path
    }
    return <div {...other} id="disqus_thread" />
  }
}

export default DisqusThread
