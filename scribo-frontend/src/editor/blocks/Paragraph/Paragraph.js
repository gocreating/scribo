import React, { Component } from 'react'
import pangu from 'pangu'
import Typesettings from './Typesettings'
import 'han-css/dist/han.min.css'
import './Paragraph.css'

class Paragraph extends Component {
  paragraphRef = React.createRef()

  componentDidMount() {
    let { block } = this.props
    let { typesetting } = block.values

    if (typeof window !== 'undefined' && typesetting === Typesettings.HAN) {
      const Han = require('han-css')
      Han(this.paragraphRef.current).render()
    }
  }

  render() {
    let { block, children } = this.props
    let { typesetting } = block.values

    // render markdown's paragraph
    if (!block.values.text) {
      return (
        <span className="paragraph content web-font">
          {children}
        </span>
      )
    }

    // render paragraph block
    switch(typesetting) {
      case Typesettings.RAW: {
        return (
          block.values.text
            .split('\n')
            .map((line, idx) => {
              return (
                <span className="paragraph content web-font" key={`${idx}-${line}`}>
                  {line}
                  <br/>
                </span>
              )
            })
        )
      }

      case Typesettings.HAN: {
        return (
          <div ref={this.paragraphRef}>
            {block.values.text
              .split('\n')
              .map((line, idx) => {
                return (
                  <span className="paragraph content web-font" key={`${idx}-${line}`}>
                    {line}
                    <br/>
                  </span>
                )
              })}
          </div>
        )
      }

      case Typesettings.PANGU: {
        return (
          block.values.text
            .split('\n')
            .map((line, idx) => {
              return (
                <span className="paragraph content web-font" key={`${idx}-${line}`}>
                  {pangu.spacing(line)}
                  <br/>
                </span>
              )
            })
        )
      }

      default: {
        return (
          <span className="paragraph content web-font">
            {children}
          </span>
        )
      }
    }
  }
}

Paragraph.defaultProps = {
  block: {
    values: {
      typesetting: Typesettings.RAW,
    },
  }
}

export default Paragraph
