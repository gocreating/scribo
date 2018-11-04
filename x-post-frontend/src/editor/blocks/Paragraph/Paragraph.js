import React, { Component } from 'react'
import pangu from 'pangu'
import Han from 'han-css'
import Typesettings from './Typesettings'
import 'han-css/dist/han.min.css'
import './Paragraph.css'

class Paragraph extends Component {
  paragraphRef = React.createRef()

  componentDidMount() {
    let { block } = this.props
    let { typesetting } = block.values

    if (typesetting === Typesettings.HAN) {
      Han(this.paragraphRef.current).render()
    }
  }

  render() {
    let { block, children } = this.props
    let { typesetting } = block.values

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
    values: {},
  }
}

export default Paragraph
