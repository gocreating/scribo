import React from 'react'
import { Grid } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import BlockTypes from '../../../constants/BlockTypes'
import Unknown from './Unknown'

let UnknownEditor = ({ block }) => (
  <Grid>
    <Grid.Row>
      <Grid.Column>
        <Unknown block={block} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default xBlock({
  type: BlockTypes.UNKNOWN,
  defaultValues: {},
})(UnknownEditor)
