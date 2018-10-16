import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import { imgurImageCreateApiRequest } from '../../../../ducks/imgur'
import config from '../../../../config'
import './ImgurUploadPublic.scss'

class ImgurUploadPublic extends Component {
  handleFileDrop = async (acceptedFiles, rejectedFiles) => {
    let {
      onStart,
      onUploading,
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

    let result = await imgurImageCreate(acceptedFiles[0], (e) => {
      if (e.direction === 'upload') {
        onUploading({
          total: e.total,
          loaded: e.loaded,
          percent: e.percent,
        })
      }
    })

    if (!result.success) {
      return onError(result.data.error)
    }
    onFinish(result)
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleFileDrop}
        multiple={false}
        accept="image/*"
        maxSize={config.imgur.maxSize}
        className="imgur-dropzone"
        acceptClassName="accept"
        rejectClassName="reject"
      >
        <Segment vertical textAlign="center" padded="very" size="massive">
          Click to Upload or Drag Files Here
        </Segment>
      </Dropzone>
    )
  }
}

export default connect(null, {
  imgurImageCreate: imgurImageCreateApiRequest,
})(ImgurUploadPublic)
