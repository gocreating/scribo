import React, { Component } from 'react'
import { Sticky, Menu as SUIMenu } from 'semantic-ui-react'

let propsToolbar = (config) => (WrappedComponent) => {
  let { Menu, items } = config

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
      let { block, updateValues } = this.props

      return (
        <div ref={this.setRef}>
          <Sticky
            context={this.state.toolbarRef}
            offset={15}
            className="props-toolbar"
          >
            {!block.preview && (
              <div className="props-toolbar-container">
                {Menu && (
                  <Menu
                    config={config}
                    block={block}
                    updateValues={updateValues}
                  />
                )}
                {!Menu && (
                  <SUIMenu inverted icon borderless fluid compact size="mini">
                    {items.map((item, idx) => (
                      <SUIMenu.Item
                        key={item.label}
                        link
                        name={item.label}
                        onClick={this.handleItemClick.bind(this, idx)}
                      />
                    ))}
                  </SUIMenu>
                )}
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
