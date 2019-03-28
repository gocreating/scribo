import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import Prompt from '../../components/Prompt'
import BlockTypes from '../../constants/BlockTypes'
import Typesettings from '../../editor/blocks/Paragraph/Typesettings'
import { postCreateApiRequest } from '../../ducks/post'

const DEFAULT_INIT_POST = {
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
}

let NewPage = ({ isPending, isFulfilled, postCreate }) => (
  <AppLayout
    placeholder={false}
    container={false}
    title="撰寫新文章"
  >
    {!isFulfilled && (
      <Prompt message="您可能有內容尚未儲存，是否確定要離開？" />
    )}
    <NewOrEditForm
      seriesPostEditable={false}
      isCreating={isPending}
      onCreate={data => postCreate(data, null, (result) => {
        alert(result.error.message)
      })}
      onInitialize={cb => cb(DEFAULT_INIT_POST)}
    />
  </AppLayout>
)

NewPage.propTypes = {
  isPending: PropTypes.bool,
  isFulfilled: PropTypes.bool,
  postCreate: PropTypes.func,
}

export default connect(({ posts }) => {
  let ctx = postSelectors.getCreateContext(posts)

  return {
    isPending: ctx.isPending,
    isFulfilled: ctx.isFulfilled,
  }
}, {
  postCreate: postCreateApiRequest,
})(NewPage)
