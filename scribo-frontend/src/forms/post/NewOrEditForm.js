import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import { Field, reduxForm, getFormValues } from 'redux-form'
import {
  Grid,
  Button,
  Form,
  Sticky,
  Container,
  Image,
  Divider,
  Accordion,
  Icon,
} from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnet, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faImage, faSave } from '@fortawesome/free-regular-svg-icons'
import ImageModal from '../../editor/blocks/Image/ImageModal'
import headerImagePlaceholder from '../../editor/blocks/Image/header-image-placeholder.png'
import slugify from '../../utils/slugify'
import Input from '../../fields/Input'
import Datetime from '../../fields/Datetime'
import SeriesPostSelect from '../../fields/SeriesPostSelect'
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
    seriesPostEditable: PropTypes.bool,
  }

  state = {
    isHeaderImageModalOpen: false,
    activeIndex: -1,
    editorMinHeight: undefined,
  }
  xeditor = React.createRef()

  setMainEditorRef = mainEditorRef => this.setState({ mainEditorRef })
  setBlockBucketRef = blockBucketRef => {
    this.blockBucketRef = blockBucketRef
  }

  componentDidMount() {
    let { onInitialize } = this.props

    if (onInitialize) {
      onInitialize(this.handleInitialize)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.blockBucketRef &&
      !this.state.editorMinHeight
    ) {
      this.setEditorHeight()
    }
  }

  setEditorHeight = () => {
    this.setState({
      editorMinHeight: ReactDOM.findDOMNode(this.blockBucketRef).offsetHeight,
    })
  }

  handleInitialize = (post) => {
    let { initialize } = this.props
    let { blocks, ...formValues } = post

    delete formValues.author
    initialize(formValues)
    this.xeditor.current.setBlocks(blocks)
  }

  handleChangeHeaderImageClick = () => {
    this.setState({ isHeaderImageModalOpen: true })
  }

  handleRemoveHeaderImageClick = () => {
    let { change } = this.props

    change('headerImage', {})
  }

  handleHeaderImageModalConfirm = (values) => {
    let { change } = this.props

    change('headerImage', values)
    this.setState({ isHeaderImageModalOpen: false })
  }

  handleHeaderImageModalCancel = () => {
    this.setState({ isHeaderImageModalOpen: false })
  }

  handleTitleChange = (e) => {
    let { values } = this.props
    let isAutoSlugify = (values.slug === slugify(values.title))

    if (!values.slug || isAutoSlugify) {
      this.setSlug(e.target.value)
    }
  }

  handleAccordionClick = (e, { index }) => {
    let { activeIndex } = this.state

    this.setState({
      activeIndex: (activeIndex === index ? -1 : index),
    })
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

    // return a promise to trigger redux-form's `submitting` prop
    return new Promise((resolve, reject) => {
      resolve(targetConsumerFn({
        ...data,
        blocks,
      }))
    })
  }

  render() {
    let {
      seriesPostEditable,
      isCreating,
      isSaving,
      isUpdating,
      onCreate,
      onSave,
      onUpdate,
      loading,
      handleSubmit,
      values,
      loggedUser,
    } = this.props
    let {
      isHeaderImageModalOpen,
      activeIndex,
      editorMinHeight,
    } = this.state
    let headerImage = values.headerImage || {}
    let isAutoSlugify = (values.slug === slugify(values.title))

    if (loading) {
      return null
    }
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Form as="div" className="post form">
          <div className="header-wrapper">
            {isHeaderImageModalOpen && (
              <ImageModal
                isOpen={isHeaderImageModalOpen}
                onConfirm={this.handleHeaderImageModalConfirm}
                onCancel={this.handleHeaderImageModalCancel}
                block={{
                  values: {
                    sourceType: headerImage.sourceType,
                    src: headerImage.src,
                    meta: headerImage.meta,
                  },
                }}
              />
            )}
            <Image
              fluid
              centered
              src={headerImage.src || headerImagePlaceholder}
            />
            <div className="overlay top">
              <Divider hidden />
              <Container>
                <Form.Field>
                  <Field
                    name="slug"
                    component={Input}
                    type="text"
                    label={{
                      content: `https://gocreating.github.io/scribo/#/@${loggedUser.username}/`,
                      color: 'grey',
                    }}
                    placeholder="文章網址"
                    size="mini"
                    action={{
                      icon: (
                        <>
                          <FontAwesomeIcon icon={faMagnet} />
                          {'　'}
                        </>
                      ),
                      onClick: () => this.setSlug(values.title),
                      content: '從目前標題產生',
                      size: 'mini',
                      color: 'grey',
                      disabled: isAutoSlugify,
                    }}
                  />
                </Form.Field>
              </Container>
            </div>
            <div className="overlay bottom">
              <Container>
                <Button.Group>
                  <Button
                    color="grey"
                    onClick={this.handleChangeHeaderImageClick}
                  >
                    <FontAwesomeIcon icon={faImage} />
                    {' 編輯風格照'}
                  </Button>
                  <Button
                    color="grey"
                    disabled={!headerImage.src}
                    onClick={this.handleRemoveHeaderImageClick}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                    {' 移除'}
                  </Button>
                </Button.Group>
                <Divider hidden />
              </Container>
            </div>
          </div>
          <Divider hidden />
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Form.Field>
                    <Field
                      name="title"
                      component={Input}
                      onChange={this.handleTitleChange}
                      type="text"
                      placeholder="標題"
                      size="massive"
                      autoComplete="off"
                    />
                  </Form.Field>
                  <Form.Field>
                    <Field
                      name="subtitle"
                      component={Input}
                      type="text"
                      placeholder="副標題"
                      autoComplete="off"
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column
                  computer={14}
                  tablet={13}
                  mobile={12}
                  style={{
                    // sync min-height with height of block bucket to avoid oscillation
                    // when editor height is smaller than block bucket height
                    minHeight: editorMinHeight,
                  }}
                >
                  <Form.Field width={16}>
                    <div ref={this.setMainEditorRef}>
                      <XEditor ref={this.xeditor} />
                    </div>
                  </Form.Field>
                </Grid.Column>
                <Grid.Column
                  computer={2}
                  tablet={3}
                  mobile={4}
                >
                  <Sticky
                    offset={20}
                    context={this.state.mainEditorRef}
                  >
                    <BlockBucket ref={this.setBlockBucketRef} />
                  </Sticky>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Accordion fluid styled>
                    <Accordion.Title
                      active={activeIndex === 0}
                      index={0}
                      onClick={this.handleAccordionClick}
                    >
                      <Icon name="dropdown" />
                      自訂時間戳記
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                      <Form.Field width={5}>
                        <label>發文時間</label>
                        <Field
                          name="customCreatedAt"
                          component={Datetime}
                          inputProps={{ placeholder: '點擊選擇自訂時間 / 空白時採用預設時間' }}
                        />
                      </Form.Field>
                      <Form.Field width={5}>
                        <label>最後更新時間</label>
                        <Field
                          name="customUpdatedAt"
                          component={Datetime}
                          inputProps={{ placeholder: '點擊選擇自訂時間 / 空白時採用預設時間' }}
                        />
                      </Form.Field>
                    </Accordion.Content>
                    {seriesPostEditable && (
                      <Accordion.Title
                        active={activeIndex === 1}
                        index={1}
                        onClick={this.handleAccordionClick}
                      >
                        <Icon name="dropdown" />
                        系列文章設定
                      </Accordion.Title>
                    )}
                    {seriesPostEditable && (
                      <Accordion.Content active={activeIndex === 1}>
                        <Form.Field>
                          <Field
                            name="seriesPosts"
                            component={SeriesPostSelect}
                          />
                        </Form.Field>
                      </Accordion.Content>
                    )}
                  </Accordion>
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
                      除錯
                    </Button>
                  )}
                  {onCreate && (
                    <Button
                      basic={!isCreating}
                      disabled={isCreating}
                      loading={isCreating}
                      onClick={handleSubmit(this.handleSubmit(onCreate))}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      {' 建立文章'}
                    </Button>
                  )}
                  {onSave && (
                    <Button
                      basic={!isSaving}
                      disabled={isSaving}
                      loading={isSaving}
                      onClick={handleSubmit(this.handleSubmit(onSave))}
                    >
                      <FontAwesomeIcon icon={faSave} />
                      {' 儲存文章'}
                    </Button>
                  )}
                  {onUpdate && (
                    <Button
                      basic={!isUpdating}
                      disabled={isUpdating}
                      loading={isUpdating}
                      onClick={handleSubmit(this.handleSubmit(onUpdate))}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      {' 更新文章'}
                    </Button>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
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
    values: getFormValues(FormTypes.POST_NEW_OR_EDIT)(state) || {},
    loggedUser: selectors.getLoggedUser(state.auth),
  }))
)

export default enhance(NewOrEditForm)
