import React from 'react'
import { Message, Button } from 'semantic-ui-react'

let DonationMessage = ({
  visible,
  successCode,
  successText,
  errorCode,
  errorText,
  onDismiss,
}) => {
  if (!visible) {
    return null
  }
  if (errorCode) {
    return (
      <Message negative>
        <Message.Header>您並未成功完成付款</Message.Header>
        <p>
          {errorText ? errorText : (
            `支付贊助費時發生錯誤（綠界錯誤代碼：${errorCode}）`
          )}
        </p>
        <Button color="red" onClick={onDismiss}>關閉訊息</Button>
      </Message>
    )
  }
  if (successCode) {
    return (
      <Message positive>
        <Message.Header>非常感謝您的贊助</Message.Header>
        <p>
          {successText ? successText : (
            '本文作者將依照網站規定之時限與額度收到您的贊助費用，' +
            '再次感謝您對本文章作者的支持'
          )}
        </p>
        <Button color="green" onClick={onDismiss}>關閉訊息</Button>
      </Message>
    )
  }
}

export default DonationMessage
