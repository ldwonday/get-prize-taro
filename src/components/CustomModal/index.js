import { View, Button } from '@tarojs/components'
import Taro, { PureComponent } from '@tarojs/taro'
import { Iconfont } from '../../components'
import './index.scss'

export default class extends PureComponent {
  handleOnTouchMove(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  render() {
    const { isShow, title, isFooter, btnText, btnType = 'red', openType, onClose, onBtnClick } = this.props
    return (
      <block>
        {isShow && (
          <View className="custom-modal">
            <View className="bg" onClick={onClose} onTouchMove={this.handleOnTouchMove.bind(this)}/>
            <View className="inner">
              <View className="close" onClick={onClose}>
                <Iconfont size={28} color="#4A4A4A" type="close" />
              </View>
              {title && <View className="title">{title}</View>}
              <View className={`content${isFooter ? '' : ' no-footer'}`}>{this.props.children}</View>
              {isFooter && (
                <View className="button-group">
                  {openType && (
                    <Button openType={openType} className={btnType} onClick={onClose}>
                      {btnText}
                    </Button>
                  )}
                  {!openType && (
                    <Button className={btnType} onClick={onBtnClick}>
                      {btnText}
                    </Button>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
      </block>
    )
  }
}
