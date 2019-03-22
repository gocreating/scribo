import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import shortid from 'shortid'
import { selectors } from '../../ducks/auth'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import Prompt from '../../components/Prompt'
import BlockTypes from '../../constants/BlockTypes'
import Typesettings from '../../editor/blocks/Paragraph/Typesettings'
import { postCreateApiRequest } from '../../ducks/post'

class NewPage extends Component {
  static propTypes = {
    postCreate: PropTypes.func,
    push: PropTypes.func,
  }

  state = {
    shouldPreventTransition: true,
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
    await this.setState({ shouldPreventTransition: false })
    setImmediate(() => {
      push(`/@${loggedUser.username}/${result.slug}`)
    })
  }

  render() {
    let { shouldPreventTransition } = this.state

    return (
      <AppLayout
        placeholder={false}
        container={false}
        title="撰寫新文章"
      >
        <Prompt
          whenTransition={shouldPreventTransition}
          message="您可能有內容尚未儲存，是否確定要離開？"
        />
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
