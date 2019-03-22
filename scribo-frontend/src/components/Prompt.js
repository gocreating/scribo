import { useEffect } from 'react'
import PropTypes from 'prop-types'
import configureStore from '../configureStore'

let { history } = configureStore
let Prompt = ({ whenWindowClose, whenTransition, message }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && whenWindowClose) {
      window.onbeforeunload = (e) => {
        return message
      }

      return function cleanup() {
        window.onbeforeunload = null
      }
    }
  })
  useEffect(() => {
    if (typeof window !== 'undefined' && whenTransition) {
      // ref: <https://github.com/ReactTraining/history#blocking-transitions>
      let unblock = history.block(message)

      return unblock
    }
  })
  return null
}

Prompt.propTypes = {
  whenWindowClose: PropTypes.bool,
  whenTransition: PropTypes.bool,
  message: PropTypes.string,
}

Prompt.defaultProps = {
  whenWindowClose: true,
  whenTransition: true,
  message: 'Sure?',
}

export default Prompt
