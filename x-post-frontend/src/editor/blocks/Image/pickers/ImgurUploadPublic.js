import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { imgurImageCreateApiRequest } from '../../../../ducks/imgur'

class ImgurUploadPublic extends Component {
  handleFileDrop = async (acceptedFiles, rejectedFiles) => {
    let {
      onStart,
      onFinish,
      onError,
      imgurImageCreate,
    } = this.props

    if (acceptedFiles.length === 0) {
      return onError({
        message: 'Invalid file',
      })
    }
    onStart()

    let result = await imgurImageCreate(acceptedFiles[0])

    if (!result.success) {
      return onError(result.data.error)
    }
    onFinish(result)
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleFileDrop}
        accept="image/*"
      >
        <p>Try dropping some files here, or click to select files to upload.</p>
      </Dropzone>
    )
  }
}

export default connect(null, {
  imgurImageCreate: imgurImageCreateApiRequest,
})(ImgurUploadPublic)
