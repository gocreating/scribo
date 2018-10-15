import React from 'react'
import { InlineMath as KatexInlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

let InlineMath = ({ value }) => (
  <KatexInlineMath math={value} />
)

export default InlineMath
