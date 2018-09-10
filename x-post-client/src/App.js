import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/basic/HomePage'
import NewPost from './pages/post/NewPage'
import NotFound from './pages/basic/NotFoundPage'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/post/new" component={NewPost} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

export default App
