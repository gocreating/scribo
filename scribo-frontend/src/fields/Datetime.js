import React from 'react'
import ReactDatetime from 'react-datetime'
import moment from 'moment'
import 'react-datetime/css/react-datetime.css'
import 'moment/locale/zh-tw'

let Datetime = ({ input, ...rest }) => {
  let value = (
    input.value ?
    moment(input.value).format('YYYY/MM/DD HH:mm') :
    undefined
  )

  return (
    <ReactDatetime
      value={value}
      dateFormat="YYYY/MM/DD"
      timeFormat="HH:mm"
      locale="zh-tw"
      onChange={input.onChange}
      {...rest}
    />
  )
}

export default Datetime
