import React from 'react'
import { Dropdown as SUIDropdown } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'

let Dropdown = (props) => (
  <SUIDropdown
    icon={(
      <>
        {'　'}
        <FontAwesomeIcon icon={faCaretDown} />
      </>
    )}
    {...props}
  />
)

export default Dropdown
