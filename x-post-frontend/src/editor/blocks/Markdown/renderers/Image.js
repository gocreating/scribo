import React from 'react'
import ImageBlock from '../../Image/Image'
import SourceTypes from '../../Image/SourceTypes'

let Image = (props) => {
  let { alt, src } = props
  let block = {
    values: {
      src,
      sourceType: SourceTypes.MANUAL_INPUT,
      alt,
    },
  }

  return (
    <ImageBlock block={block} />
  )
}

export default Image
