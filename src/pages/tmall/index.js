import { View, Image, Text, Button } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import ShareImage from '../../asset/images/singledog-cover.jpg'
import './index.scss'

const bgTop = `${ONLINE_IMAGE}img-bg-top.png`
const bgBottom = `${ONLINE_IMAGE}img-bg-bottom.png`
export default class extends PureComponent {
  componentDidMount() {
    const date = new Date()
    const cur = new Date(date.getTime() + 5 * 60 * 1000)
    this.countDown(cur)
    this.startCountDown(cur)
  }
  onShareAppMessage() {
    return {
      title: '我刚领了现金红包，你也快来领吧❤️',
      imageUrl: ShareImage,
      path: `/pages/index/index`,
    }
  }
  startCountDown(endDate) {
    this.timer = null
    this.timer = setInterval(() => {
      this.countDown(endDate)
    }, 1000)
  }
  countDown(endDate) {
    var now = new Date()
    var leftTime = endDate.getTime() - now.getTime()
    var leftsecond = parseInt(leftTime / 1000)
    var d = Math.floor(leftsecond / (60 * 60 * 24))
    var h = Math.floor((leftsecond - d * 24 * 60 * 60) / 3600)
    var m = Math.floor((leftsecond - d * 24 * 60 * 60 - h * 3600) / 60)
    var s = Math.floor(leftsecond - d * 60 * 60 * 24 - h * 60 * 60 - m * 60)
    if (d === 0 && h === 0 && m === 0 && s === 0) {
      clearInterval(this.timer)
    }
    h < 10 ? (h = '0' + h) : h
    m < 10 ? (m = '0' + m) : m
    s < 10 ? (s = '0' + s) : s
    this.setState({
      leftDay: d,
      hour: h,
      minute: m,
      second: s,
    })
  }
  render() {
    const { minute, second } = this.state
    return (
      <View className="tmall">
        <View className="top">
          <Image src={bgTop} />
        </View>
        <View className="center">
          <View className="title">— 离红包过期还有 —</View>
          <View className="desc">
            <View className="item"><View className="time">{minute}</View>分</View>
            <View className="item"><View className="time">{second}</View>秒</View>
          </View>
        </View>
        <View className="bottom">
          <Image src={bgBottom} />
        </View>
      </View>
    )
  }
}
