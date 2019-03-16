import BlockTypes from './BlockTypes'
import CodeHighlightThemes from '../editor/blocks/CodeHighlight/Themes'
import Typesettings from '../editor/blocks/Paragraph/Typesettings'
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
  label: '文字段落',
  icon: faParagraph,
  insertValues: {
    text: '',
    typesetting: Typesettings.RAW,
  },
}, {
  type: BlockTypes.HEADER,
  label: '章節標題',
  icon: faHeading,
  insertValues: {
    text: '',
    level: 1,
  },
}, {
  type: BlockTypes.CODE_HIGHLIGHT,
  label: '程式碼',
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
  label: '圖片',
  icon: faImage,
  insertValues: {
    src: '',
    isShowCaption: false,
    caption: '',
  },
}, {
  type: BlockTypes.QUOTE,
  label: '引文',
  icon: faQuoteLeft,
  insertValues: {
    text: '',
    isShowCite: false,
    cite: '',
  },
}]
