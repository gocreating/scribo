import BlockTypes from './BlockTypes'
import CodeHighlightThemes from '../editor/blocks/CodeHighlight/Themes'
import {
  faParagraph,
  faHeading,
  faCode,
  faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons'
import {
  faMarkdown,
} from '@fortawesome/free-brands-svg-icons'
import {
  faImage,
} from '@fortawesome/free-regular-svg-icons'

export default [{
  type: BlockTypes.PARAGRAPH,
  label: 'Paragraph',
  icon: faParagraph,
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.HEADER,
  label: 'Header',
  icon: faHeading,
  insertValues: {
    text: '',
    level: 1,
  },
}, {
  type: BlockTypes.CODE_HIGHLIGHT,
  label: 'Code',
  icon: faCode,
  insertValues: {
    code: '',
    theme: CodeHighlightThemes.SOLARIZED_LIGHT,
  },
}, {
  type: BlockTypes.MARKDOWN,
  label: 'Markdown',
  icon: faMarkdown,
  insertValues: {
    text: '',
  },
}, {
  type: BlockTypes.IMAGE,
  label: 'Image',
  icon: faImage,
  insertValues: {
    src: '',
    isShowCaption: false,
    caption: '',
  },
}, {
  type: BlockTypes.QUOTE,
  label: 'Quote',
  icon: faQuoteLeft,
  insertValues: {
    text: '',
    isShowCite: false,
    cite: '',
  },
}]
