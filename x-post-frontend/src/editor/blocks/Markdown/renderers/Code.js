import React from 'react'
import CodeHighlight from '../../CodeHighlight/CodeHighlight'
import Themes from '../../CodeHighlight/Themes'
import Languages from '../../CodeHighlight/Languages'

let Code = (props) => {
  let { language, value } = props

  if (!language) {
    language = Languages.DEFAULT
  }

  let languageValue = language.toUpperCase()
  let isLanguageAvailable = Object
    .keys(Languages)
    .map(k => Languages[k])
    .includes(languageValue)

  let block = {
    values: {
      code: value,
      theme: Themes.SOLARIZED_LIGHT,
      language: isLanguageAvailable ? languageValue : Languages.DEFAULT,
    },
  }

  return (
    <CodeHighlight block={block} />
  )
}

Code.defaultProps = {
  language: Languages.DEFAULT,
}

export default Code
