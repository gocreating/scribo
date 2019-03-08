import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import shortid from 'shortid'
import { selectors } from '../../ducks/auth'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import BlockTypes from '../../constants/BlockTypes'
import Typesettings from '../../editor/blocks/Paragraph/Typesettings'
import { postCreateApiRequest } from '../../ducks/post'

class NewPage extends Component {
  static propTypes = {
    postCreate: PropTypes.func,
    push: PropTypes.func,
  }

  handleInitialize = (cb) => {
    cb({
      title: '',
      blocks: [
        {
          id: shortid.generate(),
          type: BlockTypes.PARAGRAPH,
          preview: false,
          values: {
            text: '',
            typesetting: Typesettings.RAW,
          },
        },
      ],
    })
  }

  handleCreate = async (data) => {
    let {
      postCreate,
      loggedUser,
      push,
    } = this.props
    let result = await postCreate(loggedUser.id, data)

    if (result.error) {
      return alert(result.error.message)
    }
    push(`/@${loggedUser.username}/${result.slug}`)
  }

  render() {
    return (
      <AppLayout placeholder={false} container={false}>
        <NewOrEditForm
          seriesPostEditable={false}
          onCreate={this.handleCreate}
          onInitialize={this.handleInitialize}
        />
      </AppLayout>
    )
  }
}

export default connect(({ auth }) => ({
  loggedUser: selectors.getLoggedUser(auth),
}), {
  postCreate: postCreateApiRequest,
  push,
})(NewPage)
