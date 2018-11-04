import React, { Component } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import { Field, reduxForm, getFormValues } from 'redux-form'
import { Grid, Button, Form, Sticky } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnet } from '@fortawesome/free-solid-svg-icons'
import slugify from '../../utils/slugify'
import Input from '../../fields/Input'
import FormTypes from '../../constants/FormTypes'
import XEditor from '../../editor/XEditor'
import BlockBucket from '../../editor/BlockBucket'
import AvailableBlocks from '../../constants/AvailableBlocks'
import { selectors } from '../../ducks/auth'
import './NewOrEditForm.scss'

class NewOrEditForm extends Component {
  static propTypes = {
    onInitialize: PropTypes.func,
    onSubmit: PropTypes.func,
    initialize: PropTypes.func,
    handleSubmit: PropTypes.func,
  }

  state = {}
  xeditor = React.createRef()
  setBlockBucketRef = blockBucketRef => this.setState({ blockBucketRef })

  componentDidMount() {
    let { onInitialize } = this.props

    if (onInitialize) {
      onInitialize(this.handleInitialize)
    }
  }

  handleInitialize = (post) => {
    let { initialize } = this.props
    let { blocks, ...formValues } = post

    initialize(formValues)
    this.xeditor.current.setBlocks(blocks)
  }

  handleTitleChange = (e) => {
    let { values } = this.props
    let isAutoSlugify = (values.slug === slugify(values.title))

    if (!values.slug || isAutoSlugify) {
      this.setSlug(e.target.value)
    }
  }

  setSlug = (title = '') => {
    let { change } = this.props

    change('slug', slugify(title))
  }

  onDragEnd = (result) => {
    let { source, destination } = result

    // dropped outside the list
    if (!destination) {
      return
    }

    // sort blocks
    if (
      source.droppableId === 'droppable-block-sort' &&
      destination.droppableId === 'droppable-block-sort'
    ) {
      if (result.destination.index === result.source.index) {
        return
      }

      this.xeditor.current.reorderBlocks(
        result.source.index,
        result.destination.index
      )
    }

    // insert a new block
    if (
      source.droppableId === 'droppable-block-bucket' &&
      destination.droppableId === 'droppable-block-sort'
    ) {
      let { createBlock, insertBlockBeforeIndex } = this.xeditor.current
      let selectedBlock = AvailableBlocks[source.index]
      let block = createBlock(
        selectedBlock.type,
        selectedBlock.insertValues
      )
      insertBlockBeforeIndex(destination.index, block)
    }
  };

  handleSubmit = (targetConsumerFn) => (data) => {
    let blocks = this.xeditor.current
      .getBlocks()
      .map(block => ({
        id: block.id,
        type: block.type,
        values: block.values,
      }))

    targetConsumerFn({
      ...data,
      blocks,
    })
  }

  render() {
    let {
      onCreate,
      onSave,
      onUpdate,
      handleSubmit,
      values,
      loggedUser,
    } = this.props
    let isAutoSlugify = (values.slug === slugify(values.title))

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Form as="div" className="post form">
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <Field
                    name="slug"
                    component={Input}
                    type="text"
                    label={{
                      content: `https://gocreating.github.io/x-post/#/@${loggedUser.username}/`,
                      color: 'grey',
                    }}
                    placeholder="slug"
                    size="mini"
                    action={{
                      icon: (
                        <>
                          <FontAwesomeIcon icon={faMagnet} />
                          {'　'}
                        </>
                      ),
                      onClick: () => this.setSlug(values.title),
                      content: 'Apply from title',
                      size: 'mini',
                      color: 'grey',
                      disabled: isAutoSlugify,
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Field
                    name="title"
                    component={Input}
                    onChange={this.handleTitleChange}
                    type="text"
                    placeholder="Title"
                    size="massive"
                  />
                </Form.Field>
                <Form.Field>
                  <Field
                    name="subtitle"
                    component={Input}
                    type="text"
                    placeholder="Subtitle"
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={14}>
                <Form.Field width={16}>
                  <div ref={this.setBlockBucketRef}>
                    <XEditor ref={this.xeditor} />
                  </div>
                </Form.Field>
              </Grid.Column>
              <Grid.Column width={2}>
                <Sticky
                  offset={20}
                  context={this.state.blockBucketRef}
                >
                  <BlockBucket />
                </Sticky>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                {process.env.NODE_ENV === 'development' && (
                  <Button basic onClick={() => {
                    console.log(
                      this.xeditor.current.getBlocks()
                    )
                  }}>
                    Debug
                  </Button>
                )}
                {onCreate && (
                  <Button basic onClick={handleSubmit(this.handleSubmit(onCreate))}>
                    Create
                  </Button>
                )}
                {onSave && (
                  <Button basic onClick={handleSubmit(this.handleSubmit(onSave))}>
                    Save
                  </Button>
                )}
                {onUpdate && (
                  <Button basic onClick={handleSubmit(this.handleSubmit(onUpdate))}>
                    Update
                  </Button>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </DragDropContext>
    )
  }
}

let enhance = compose(
  reduxForm({
    form: FormTypes.POST_NEW_OR_EDIT,
    initialValues: {
      title: '',
    },
  }),
  connect(state => ({
    values: getFormValues(FormTypes.POST_NEW_OR_EDIT)(state),
    loggedUser: selectors.getLoggedUser(state.auth),
  }))
)

export default enhance(NewOrEditForm)
