import React from 'react'
import Navigation from './Navigation'

let AppLayout = ({ children }) => (
  <div>
    <Navigation />
    {children}
  </div>
)

export default AppLayout
