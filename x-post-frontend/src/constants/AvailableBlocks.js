import BlockTypes from './BlockTypes'
import CodeHighlightThemes from '../editor/blocks/CodeHighlight/Themes'

export default [{
  type: BlockTypes.PARAGRAPH,
  label: 'Paragraph',
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.HEADER,
  label: 'Header',
  insertValues: {
    text: '',
    level: 1,
  },
}, {
  type: BlockTypes.CODE_HIGHLIGHT,
  label: 'Code Highlight',
  insertValues: {
    code: '',
    theme: CodeHighlightThemes.SOLARIZED_LIGHT,
  },
}, {
  type: BlockTypes.MARKDOWN,
  label: 'Markdown',
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.IMAGE,
  label: 'Image',
  insertValues: {
    src: '',
    isShowCaption: false,
    caption: '',
  },
}, {
  type: BlockTypes.QUOTE,
  label: 'Quote',
  insertValues: {
    text: '',
    isShowCite: false,
    cite: '',
  },
}]
