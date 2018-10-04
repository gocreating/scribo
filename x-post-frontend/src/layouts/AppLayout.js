import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import Navigation from './Navigation'
import 'semantic-ui-css/semantic.min.css'
import './AppLayout.css'

let AppLayout = ({ placeholder, children }) => (
  <div>
    <Navigation />
    {placeholder === true && (
      <Divider hidden />
    )}
    {placeholder !== true && placeholder}
    <Container>
      {children}
    </Container>
  </div>
)

export default AppLayout
