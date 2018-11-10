import React, { Component } from 'react'
import imgNotAvailable from '../blocks/Image/image-not-available.png'

let withImageHelpers = (WrappedComponent) => {
  class ImageErrorHandler extends Component {
    state = { isImageLoadError: false }

    handleImageLoad = () => this.setState({
      isImageLoadError: false,
    })

    handleImageError = () => this.setState({
      isImageLoadError: true,
    })

    componentDidUpdate(prevProps) {
      if (this.props.block.values.src !== prevProps.block.values.src) {
        this.setState({
          isImageLoadError: false,
        })
      }
    }

    render() {
      let { isImageLoadError } = this.state
      let imageHelpers = {
        meta: {
          isImageLoadError: isImageLoadError,
          imgNotAvailable: imgNotAvailable,
        },
      }

      if (isImageLoadError) {
        imageHelpers.src = imgNotAvailable
      } else {
        imageHelpers.onLoad = this.handleImageLoad
        imageHelpers.onError = this.handleImageError
      }

      return (
        <WrappedComponent
          imageHelpers={imageHelpers}
          {...this.props}
        />
      )
    }
  }

  return ImageErrorHandler
}

export default withImageHelpers
