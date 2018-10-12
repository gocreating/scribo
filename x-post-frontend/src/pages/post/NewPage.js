import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import shortid from 'shortid'
import { selectors } from '../../ducks/auth'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import BlockTypes from '../../constants/BlockTypes'
import { postCreateApiRequest } from '../../ducks/post'

class NewPage extends Component {
  static propTypes = {
    postCreate: PropTypes.func,
    push: PropTypes.func,
  }

  handleInitialize = (cb) => {
    cb({
      title: '新文章',
      blocks: [
        {
          id: shortid.generate(),
          type: BlockTypes.HEADER,
          preview: false,
          values: {
            text: 'Header Example',
            level: 2,
          },
        },
        {
          id: shortid.generate(),
          type: BlockTypes.PLAIN_TEXT,
          preview: false,
          values: {
            text: 'lorem ipsum',
          },
        },
        {
          id: shortid.generate(),
          type: BlockTypes.CODE_HIGHLIGHT,
          preview: false,
          values: {
            theme: CodeHighlightThemes.SOLARIZED_LIGHT,
            code: '',
          },
        },
      ],
    })
  }

  handleCreate = async (data) => {
    let {
      postCreate,
      userId,
      push,
    } = this.props
    let result = await postCreate(userId, data)

    if (result.error) {
      return alert(result.error.message)
    }
    push('/')
  }

  render() {
    return (
      <AppLayout placeholder>
        <NewOrEditForm
          onCreate={this.handleCreate}
          onInitialize={this.handleInitialize}
        />
      </AppLayout>
    )
  }
}

export default connect(({ auth }) => ({
  userId: selectors.getLoggedUserId(auth),
}), {
  postCreate: postCreateApiRequest,
  push,
})(NewPage)
