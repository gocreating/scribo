import React from 'react'
import { Image as SUIImage } from 'semantic-ui-react'
import ImageZoom from 'react-medium-image-zoom'
import withImageHelpers from '../../hoc/withImageHelpers'
import './Image.scss'

let Image = (props) => {
  let {
    block,
    // props of withImageHelpers hoc
    imageHelpers,
  } = props
  let {
    meta: {
      isImageLoadError,
      imgNotAvailable,
    },
    ...helpers
  } = imageHelpers
  let { src, isShowCaption, caption } = block.values

  return (
    <figure className="image content">
      {isImageLoadError ? (
        <SUIImage
          src={imgNotAvailable}
          centered
        />
      ) : (
        <ImageZoom
          image={{
            src: src,
            className: 'ui centered image',
            ...helpers,
          }}
          defaultStyles={{
            zoomContainer: {
              zIndex: 999,
            }
          }}
        />
      )}
      {isShowCaption && (
        <figcaption className="caption web-font">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default withImageHelpers(Image)
