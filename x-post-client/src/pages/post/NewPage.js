import React from 'react'
import AppLayout from '../../layouts/AppLayout'
import XEditor from '../../editor/XEditor'

let NewPage = ({ children }) => (
  <AppLayout>
    New Post
    <XEditor />
  </AppLayout>
)

export default NewPage
