import path from 'path'
import fs from 'fs'
import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import configureStore from '../src/configureStore'
import App from '../src/App'

const injectHTML = (data, { html, title, meta, body, state }) => {
  data = data.replace('<html>', `<html ${html}>`)
  data = data.replace(/<title>.*?<\/title>/g, title)
  data = data.replace('</head>', `${meta}</head>`)
  data = data.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div>`
  )
  return data
};

export default (req, res) => {
  fs.readFile(path.resolve(__dirname, '../build/index.html'), 'utf8', (err, htmlData) => {
    if (err) {
      console.error(`Error page ${err}`)
      return res.status(404).end()
    }
    const { store, history } = configureStore
    const body = renderToString(
      <Provider store={store}>
        <App history={history} />
      </Provider>
    )
    const helmet = Helmet.renderStatic()
    const html = injectHTML(htmlData, {
      html: helmet.htmlAttributes.toString(),
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      body: body,
    })
    res.send(html)
  });
};
