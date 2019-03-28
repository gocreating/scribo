import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import qs from 'query-string'
import { selectors as authSelectors } from '../../ducks/auth'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
import BlockTypes from '../../constants/BlockTypes'
import DonationForm from '../../forms/post/DonationForm'
import DonationMessage from '../../components/DonationMessage'

class DonationPage extends Component {
  state = {
    isMessageVisible: false,
  }

  componentDidMount() {
    let { query } = this.props
    let { donationSuccessCode, donationErrorCode } = query

    if (donationErrorCode || donationSuccessCode) {
      this.setState({ isMessageVisible: true })
    }
  }
  
  handleMessageDismiss = () => {
    this.setState({ isMessageVisible: false })
  }

  render() {
    let { query, accessToken } = this.props
    let { isMessageVisible } = this.state
    let { donationSuccessCode, donationErrorCode } = query

    return (
      <AppLayout placeholder={isMessageVisible} title="贊助">
        <DonationMessage
          visible={isMessageVisible}
          successCode={donationSuccessCode}
          successText="我們將收到您的款項，再次誠心感謝您的支持"
          errorCode={donationErrorCode}
          onDismiss={this.handleMessageDismiss}
        />
        <Grid
          columns={2}
          stackable
          padded="horizontally"
        >
          <Grid.Row>
            <Grid.Column width={9}>
              <DisplayRenderer blocks={[{
                id: '1',
                type: BlockTypes.MARKDOWN,
                values: {
                  text: `# 誌謝
Scribo站方誠摯感謝您的支持，我們的服務將因您的鼓勵而變得更好。

## 給贊助者們的話
站長是一名喜歡撰寫部落格文章的全端工程師，曾經使用過Blogger、Logdown、自架WordPress、官方WordPress、Github Page、痞客邦、Medium...等不同的寫作平台來建立個人部落格，卻總是因為文章編排彈性不足、外掛不夠齊全、中文友善程度低、平台提供的功能有限...等諸多原因，使得在不同平台寫作時常面臨不同的障礙。

Scribo試圖補足坊間寫作平台的不足，致力於提供優良、舒適、友善中文的網路閱讀環境（例如本文就是由Scribo的文章引擎所渲染而得），如果您喜歡我們的服務，歡迎贊助我們，給予我們更多的鼓勵，以提供更優質的服務。

## 贊助費用途
費用主要將用於分攤網站營運所需成本，包含網域註冊費用、前後端伺服器費用、資料庫費用、授權軟體費用、其它雜支等費用，如有結餘則用於日後擴充規劃，虧損則由站方吸收。

## 聯絡我們
贊助功能將使用[綠界科技ECPAY](https://www.ecpay.com.tw/)所提供之第三方支付金流服務，如付款過程遭遇問題，請洽詢綠界科技，如有其它任何疑問，亦歡迎聯繫站長：<gocreating@gmail.com>。`,
                },
              }]} />
            </Grid.Column>
            <Grid.Column width={7} textAlign="center">
              <DisplayRenderer blocks={[{
                id: '1',
                type: BlockTypes.MARKDOWN,
                values: {
                  text: `# 贊助方式
## 第三方支付`,
                },
              }]} />
              <DonationForm
                getHint={(amount) => ''}
                getRemindInfo={(amount) => ''}
                getLinkPath={(amount) => (
                  `/api/payments/ecpay/donation?` +
                  `amount=${amount}&` +
                  `access_token=${accessToken}`
                )}
                buttonText="立即贊助"
              />
              <DisplayRenderer blocks={[{
                id: '1',
                type: BlockTypes.MARKDOWN,
                values: {
                  text: `## 數位貨幣
### BTC ▼
\`14FST6mAkwhKLQEynLPHLpaLGPuNBzW6Cx\`
![](https://i.imgur.com/c1c14U5.png)

### ETH ▼
\`0x0c0010b6ae984afc5cf8c12ee9383fc7354cc195\`
![](https://i.imgur.com/pyGTInW.png)

### USDT ▼
\`178LaWvBPjkCNVSer96Uha6vfGKVLF9uFP\`
![](https://i.imgur.com/hFbt2Kr.png)
`,
                },
              }]} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </AppLayout>
    )
  }
}

export default connect(({ auth }, { location }) => ({
  accessToken: authSelectors.getAccessToken(auth),
  query: qs.parse(location.search),
}))(DonationPage)
