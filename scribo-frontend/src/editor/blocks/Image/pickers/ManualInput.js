import React from 'react'
import { Form } from 'semantic-ui-react'

let ManualInput = ({ value, onChange }) => (
  <Form>
    <Form.Field>
      <label>URL Link to Image</label>
      <input
        placeholder="URL"
        value={value}
        onChange={onChange}
      />
    </Form.Field>
  </Form>
)

export default ManualInput
