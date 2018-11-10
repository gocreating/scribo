import React from 'react'
import ImageBlock from '../../Image/Image'
import SourceTypes from '../../Image/SourceTypes'

let Image = (props) => {
  let { alt, src, title } = props
  let block = {
    values: {
      src,
      sourceType: SourceTypes.MANUAL_INPUT,
      alt,
      isShowCaption: Boolean(title),
      caption: title,
    },
  }

  return (
    <ImageBlock block={block} />
  )
}

export default Image
