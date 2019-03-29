import React from 'react'
import PropTypes from 'prop-types'
import { Segment } from 'semantic-ui-react'

let DropZonePlaceholder = ({ text, attached }) => (
  <Segment
    basic
    disabled
    attached={attached}
    textAlign="center"
    style={{ userSelect: 'none' }}
  >
    {text}
  </Segment>
)

DropZonePlaceholder.propTypes = {
  text: PropTypes.string,
  attached: PropTypes.string,
}

DropZonePlaceholder.defaultProps = {
  text: '拖曳元件至此',
  attached: undefined,
}

export default DropZonePlaceholder
