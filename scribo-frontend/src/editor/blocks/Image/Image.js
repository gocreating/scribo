import React from 'react'
import classNames from 'classnames'
import { Image as SUIImage } from 'semantic-ui-react'
import ImageZoom from 'react-medium-image-zoom'
import withImageHelpers from '../../hoc/withImageHelpers'
import './Image.scss'
import ImageSizes from './ImageSizes';

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
  let { src, size, isShowCaption, caption, alt } = block.values

  size = size || ImageSizes.DEFAULT

  let isSizeAppliable = (size !== ImageSizes.DEFAULT)
  let cx = classNames('ui centered image', {
    [size.toLowerCase()]: isSizeAppliable,
  })
  
  return (
    <figure className="image content">
      {isImageLoadError ? (
        <SUIImage
          src={imgNotAvailable}
          centered
          size={isSizeAppliable? size.toLowerCase(): undefined}
        />
      ) : (
        <ImageZoom
          image={{
            src: src,
            className: cx,
            alt,
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
