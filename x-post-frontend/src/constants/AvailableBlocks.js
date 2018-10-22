import BlockTypes from './BlockTypes'
import CodeHighlightThemes from '../editor/blocks/CodeHighlight/Themes'

export default [{
  type: BlockTypes.PARAGRAPH,
  label: 'Paragraph',
  icon: 'paragraph',
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.HEADER,
  label: 'Header',
  icon: 'header',
  insertValues: {
    text: '',
    level: 1,
  },
}, {
  type: BlockTypes.CODE_HIGHLIGHT,
  label: 'Code',
  icon: 'code',
  insertValues: {
    code: '',
    theme: CodeHighlightThemes.SOLARIZED_LIGHT,
  },
}, {
  type: BlockTypes.MARKDOWN,
  label: 'Markdown',
  icon: 'i cursor',
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.IMAGE,
  label: 'Image',
  icon: 'image',
  insertValues: {
    src: '',
    isShowCaption: false,
    caption: '',
  },
}, {
  type: BlockTypes.QUOTE,
  label: 'Quote',
  icon: 'quote left',
  insertValues: {
    text: '',
    isShowCite: false,
    cite: '',
  },
}]
