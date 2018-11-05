import { View, Image } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import './index.scss'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
  }
  render() {
    const {
      data: { image = '', nickName = '' },
    } = this.props
    const money = Math.floor(Math.random() * 888 + 1)
    return (
      <View className="barrage">
        <View className="left">
          <Image src={image} />
        </View>
        <View className="right">
          <View className="name">{nickName}</View>
          <View className="desc">抽中了红包{money}元</View>
        </View>
      </View>
    )
  }
}
