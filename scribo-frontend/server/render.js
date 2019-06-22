import path from 'path'
import fs from 'fs'
import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import configureStore from '../src/configureStore'
import App from '../src/App'
// import { setAuth } from '../src/ducks/auth'

const injectHTML = (data, { html, title, meta, body, state }) => {
  data = data.replace('<html>', `<html ${html}>`)
  data = data.replace(/<title>.*?<\/title>/g, title)
  data = data.replace('</head>', `${meta}</head>`)
  data = data.replace(
    '<div id="root"></div>',
    `<div id="root">${body}</div><script>window.__PRELOADED_STATE__ = ${state}</script>`
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

    // store.dispatch(setAuth(
    //   "ua5loir7SkRDrBlj0iC1jFxh4DlP7TDZ2iGRGoTAHcg9GBrSyGkVTHz2SHisSUgp",
    //   "2019-06-22T07:13:50.883Z",
    //   1209600,
    //   {
    //     id: "5bcace04b881044c2a4a363a",
    //     username: "gocreating",
    //   },
    // ))

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
      state: JSON.stringify(store.getState()).replace(/</g, '\\u003c'),
    })
    res.send(html)
  });
};
