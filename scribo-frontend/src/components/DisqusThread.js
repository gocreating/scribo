import React, { Component } from 'react'
import PropTypes from 'prop-types'
import config from '../config'

const SHORTNAME = config.disqusShortname.replace('#', '')
const WEBSITE_URL = config.host

class DisqusThread extends Component {
  componentDidMount() {
    this.renderDisqus()
  }

  componentDidUpdate() {
    this.renderDisqus()
  }

  renderDisqus = () => {
    const { id, path } = this.props

    if (typeof window !== 'undefined' && id && path) {
      window.disqus_config = function () {
        // manually controlled language
        // ref: <https://help.disqus.com/installation/multi-lingual-websites>
        this.language = 'zh'
        this.page = this.page || {}
        this.page.url = WEBSITE_URL + path
        this.page.identifier = id
      }

      if (typeof window !== 'undefined' && !window.DISQUS) {
        const s = document.createElement('script')
        const mountNode = document.head || document.body

        s.async = true
        s.src = `https://${SHORTNAME}.disqus.com/embed.js`
        s.setAttribute('data-timestamp', +new Date())
        mountNode.appendChild(s)
      } else {
        window.DISQUS.reset({
          reload: true,
        })
      }
    }
  }

  render() {
    const { id, path, ...rest } = this.props

    return (
      <div
        id="disqus_thread"
        {...rest}
      />
    )
  }
}

DisqusThread.propTypes = {
  id: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
}

DisqusThread.defaultProps = {
  id: null,
  path: null,
}

export default DisqusThread
