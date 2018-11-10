import React from 'react'
import { Grid } from 'semantic-ui-react'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
import BlockTypes from '../../constants/BlockTypes'

let ContactPage = () => (
  <AppLayout>
    <Grid padded="horizontally">
      <Grid.Column>
        <DisplayRenderer blocks={[{
          id: '1',
          type: BlockTypes.MARKDOWN,
          values: {
            text: `## 問題回報
如果您在使用本服務的過程中遭遇問題，或是對於本服務有疑問，歡迎前往Github專案[新增Issue](https://github.com/gocreating/x-post/issues)，我們將會盡速答覆您。

## 聯絡我們
如果您有私人疑問或需求，歡迎聯絡站長信箱：<gocreating@gmail.com>。`,
          },
        }]} />
      </Grid.Column>
    </Grid>
  </AppLayout>
)

export default ContactPage
