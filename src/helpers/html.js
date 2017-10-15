import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import serialize from 'serialize-javascript'

export default class Html extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    scripts: PropTypes.arrayOf(PropTypes.string).isRequired,
    store: PropTypes.object.isRequired,
    styleTags: PropTypes.string.isRequired,
  }

  render() {
    const {
      content, scripts, store, styleTags,
    } = this.props
    return (
      <html lang="zh-TW">
        <head>
          <meta charSet="utf-8" />
          <div dangerouslySetInnerHTML={{ __html: styleTags }} />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__REDUX_STATE__=${serialize(store.getState())};` }} charSet="UTF-8" />
          {scripts.map(script => <script key={script} type="text/javascript" src={script} />)}
        </body>
      </html>
    )
  }
}
