import React from 'react'
import { BlockMath as KatexBlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

let BlockMath = ({ value }) => (
  <KatexBlockMath math={value} />
)

export default BlockMath
