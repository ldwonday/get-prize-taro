import { View, Image, Text, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import action from '../../utils/action'
import Taro, { PureComponent } from '@tarojs/taro'
import ShareImage from '../../asset/images/singledog-cover.jpg'
import Coin from '../../asset/images/img-coin-yuan.png'
import { Loading, CustomModal } from '../../components'
import pageWithData from '../../common/PageWithData'
import { getStorageShareTimes, setStorageShareTimes } from '../../utils'
import Emoji from '../../asset/images/img-emoji-emm.png'
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
  handleChangeModal(status) {
    this.setState({
      isShowModal: status,
    })
  }
  render() {
    const { loading } = this.props
    const { isShowModal, shareTimes } = this.state
    return (
      <View className="detail">
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <block>
            <Image src={Coin} className="coin" />
            <View className="tip">我的红包金额</View>
            <View className="money">￥{shareTimes === 0 ? '0.54' : '1.08'}</View>
            <Button className="cash" onClick={this.handleChangeModal.bind(this, true)}>
              提现
            </Button>
            <Button className="share" openType="share">
              <View className="top">{shareTimes > 0 ? '分享给好友，一起领现金' : '分享到群，红包翻倍'}</View>
              {shareTimes === 0 && <View className="desc">￥1.08</View>}
            </Button>
            <CustomModal
              isShow={isShowModal}
              title="温馨提示"
              isFooter={false}
              onClose={this.handleChangeModal.bind(this, false)}
            >
              <View className="btn-content">
                <View className="top-tip">
                  <Image src={Emoji} className="emoji" />因微信提现次数限制，请添加我们客服领现金红包
                </View>
                <View className="bottom-tip">
                  <View className="top">
                    回复文字<Text className="red-text">“红包”</Text>
                  </View>
                  <View>添加客服领红包</View>
                  <Button
                    openType="contact"
                    className="red"
                    onClick={this.handleChangeModal.bind(this, false)}
                  >
                    去回复
                  </Button>
                </View>
              </View>
            </CustomModal>
          </block>
        )}
      </View>
    )
  }
}
