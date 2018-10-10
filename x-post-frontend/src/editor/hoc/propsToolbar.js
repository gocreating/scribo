import React, { Component } from 'react'
import { Sticky, Menu } from 'semantic-ui-react'

let propsToolbar = (config) => (WrappedComponent) => {
  let { items } = config

  class PropsToolbar extends Component {
    state = {}

    setRef = toolbarRef => this.setState({ toolbarRef })

    handleItemClick = (idx) => {
      let { block, updateValues } = this.props
      let { propsMap } = items[idx]
      let derivedPropsMap = Object
        .keys(propsMap)
        .reduce((accPropsMap, name) => {
          let p = propsMap[name]

          if (typeof p === 'function') {
            accPropsMap[name] = p(block.values[name])
          } else {
            accPropsMap[name] = p
          }
          return accPropsMap
        }, {})

      updateValues(derivedPropsMap)
    }

    render() {
      let { block } = this.props

      return (
        <div ref={this.setRef}>
          <Sticky
            context={this.state.toolbarRef}
            offset={15}
            className="props-toolbar"
          >
            {!block.preview && (
              <div className="props-toolbar-container">
                <Menu inverted icon borderless fluid compact size="mini">
                  {items.map((item, idx) => (
                    <Menu.Item
                      key={item.label}
                      link
                      name={item.label}
                      onClick={this.handleItemClick.bind(this, idx)}
                    />
                  ))}
                </Menu>
              </div>
            )}
          </Sticky>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }

  return PropsToolbar
}

export default propsToolbar
