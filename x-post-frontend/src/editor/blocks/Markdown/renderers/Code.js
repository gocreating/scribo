import React from 'react'
import CodeHighlight from '../../CodeHighlight/CodeHighlight'
import Themes from '../../CodeHighlight/Themes'

let Code = (props) => {
  let { language, value } = props
  let block = {
    values: {
      code: value,
      theme: Themes.SOLARIZED_LIGHT,
      language: language.toUpperCase(),
    },
  }

  return (
    <CodeHighlight block={block} />
  )
}

export default Code
