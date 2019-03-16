import React from 'react'
import moment from 'moment'
import 'moment/locale/zh-tw'

let Timestamp = ({ prefix, relative, relativeThresholdMs, children }) => {
  let localeMoment = moment(children).locale('zh-tw')
  let fullDatetimeString = localeMoment.format('YYYY/MM/DD HH:mm')
  let diff = Math.abs(localeMoment.diff(new Date()))
  let isInThreshold = diff < relativeThresholdMs

  return (
    <time title={fullDatetimeString}>
      {prefix}
      {isInThreshold && relative && localeMoment.fromNow()}
      {((!isInThreshold && relative) || !relative) && localeMoment.format('YYYY/MM/DD')}
    </time>
  )
}

Timestamp.defaultProps = {
  prefix: '',
  relative: false,
  relativeThresholdMs: 1000 * 86400 * 3,
}

export default Timestamp
