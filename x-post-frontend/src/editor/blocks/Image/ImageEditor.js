import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import {
  Grid,
  Image as SUIImage,
  Form
} from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import propsToolbar from '../../hoc/propsToolbar'
import withImageHelpers from '../../hoc/withImageHelpers'
import BlockTypes from '../../../constants/BlockTypes'
import Image from './Image'
import ImageMenu from './ImageMenu'
import TextArea from '../../../fields/TextArea'

class ImageEditor extends Component {
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  renderPreview = () => (
    <Image block={this.props.block} />
  )

  renderEditor = () => {
    let {
      block,
      autoUpdateValues,
      // props of withImageHelpers hoc
      imageHelpers,
    } = this.props
    let {
      meta,
      ...helpers
    } = imageHelpers
    let { src, isShowCaption } = block.values

    return (
      <div className="image editor">
        <figure>
          <SUIImage
            src={src}
            centered
            {...helpers}
          />
          {isShowCaption && (
            <Form>
              <Field
                name="caption"
                component={TextArea}
                onChange={autoUpdateValues}
                placeholder="Write caption here"
                rows={1}
                autoHeight
                className="caption web-font"
                onKeyPress={this.handleKeyPress}
              />
            </Form>
          )}
        </figure>
      </div>
    )
  }

  render() {
    let { block } = this.props

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {block.preview && this.renderPreview()}
            {!block.preview && this.renderEditor()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

let enhance = compose(
  xBlock({
    type: BlockTypes.IMAGE,
    defaultValues: {
      src: '',
      isShowCaption: false,
      caption: '',
    },
  }),
  propsToolbar({
    Menu: ImageMenu,
  }),
  reduxForm(),
  withImageHelpers
)
export default enhance(ImageEditor)
