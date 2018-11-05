import { View, Image, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import Taro, { PureComponent } from '@tarojs/taro'
import ShareImage from '../../asset/images/singledog-cover.jpg'
import Coin from '../../asset/images/img-coin-yuan.png'
import { Loading, CustomModal } from '../../components'
import pageWithData from '../../common/PageWithData'
import { getStorageShareTimes, setStorageShareTimes } from '../../utils'
import ImgCheck from '../../asset/images/img-check-green.png'
import { BASE_MONEY } from '../../utils/constant'
import './index.scss'

@pageWithData('detail')
@connect(({ detail }) => ({
  ...detail,
}))
export default class extends PureComponent {
  state = {
    isShowModal: false,
  }
  componentDidMount() {
    getStorageShareTimes().then(res => {
      this.setState({
        shareTimes: res.data,
      })
    })
  }
  onShareAppMessage() {
    setTimeout(() => {
      const shareTimes = this.props.shareTimes + 1
      setStorageShareTimes(shareTimes)
      this.setState({
        shareTimes,
      })
      this.props.dispatch(action('home/saveShareTimes', shareTimes))
    }, 2000)
    return {
      title: '我刚领了现金红包，你也快来领吧❤️',
      imageUrl: ShareImage,
      path: `/pages/index/index`,
    }
  }
  handleCash() {
    this.handleChangeModal(true)
    this.props.dispatch(this.mappingAction('saveIsCash', true))
  }
  handleChangeModal(status) {
    this.setState({
      isShowModal: status,
    })
  }
  handleGoTmall() {
    Taro.navigateTo({
      url: '/pages/tmall/index',
    })
    this.handleChangeModal(false)
  }
  render() {
    const { loading, isCash } = this.props
    const { isShowModal, shareTimes } = this.state
    return (
      <View className="detail">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            <Image src={Coin} className="coin" />
            <View className="tip">我的红包金额</View>
            <View className="money">￥{isCash ? '0.00' : shareTimes === 0 ? BASE_MONEY : BASE_MONEY * 2}</View>
            {!isCash && (
              <Button className="cash" onClick={this.handleCash.bind(this)}>
                提现
              </Button>
            )}
            {isCash && (
              <Button className="cash disabled" disabled>提现已申请</Button>
            )}
            <Button className="share" openType="share">
              <View className="top">{shareTimes > 0 ? '分享抽奖给好友，一起领现金' : '分享抽奖到群，红包翻倍'}</View>
              {shareTimes === 0 && <View className="desc">￥{BASE_MONEY * 2}</View>}
            </Button>
            <CustomModal
              isShow={isShowModal}
              isFooter={false}
              onClose={this.handleGoTmall.bind(this)}
            >
              <View className="tip-content">
                <Image src={ImgCheck} />
                <View className="title">提现申请成功！</View>
                <View className="desc">由于提现人数较多，奖金预计在1-3个工作日内到账您的微信钱包</View>
                <Button className="green" onClick={this.handleGoTmall.bind(this)}>好的</Button>
              </View>
            </CustomModal>
          </block>
        )}
      </View>
    )
  }
}
