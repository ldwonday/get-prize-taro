import { View, Form, Button, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { PureComponent } from '@tarojs/taro'
import action from '../../utils/action'
import { Loading, CustomModal, Iconfont } from '../../components'
import pageWithData from '../../common/PageWithData'
import MainBg from '../../asset/images/img-background.jpg'
import RedBag from '../../asset/images/img-redbag.png'
import DogBg from '../../asset/images/img-background-dogge.png'
import CoreBack from '../../asset/images/img-core-back.png'
import DogGray from '../../asset/images/img-claw-grey.png'
import JoinBtnDog from '../../asset/images/img-claw-1.png'
import JoinBtnShareDog from '../../asset/images/img-claw-2.png'
import DogLine from '../../asset/images/img-bones.png'
import Barrage from './Barrage'
import ShareImage from '../../asset/images/img-cover.jpg'
import OpenBg from '../../asset/images/img-redbag-2.png'
import DetailBag from '../../asset/images/img-redbag-3.png'
import OpenBtn from '../../asset/images/btn-open.png'
import Clock from '../../asset/images/img-clock-ok.png'
import Complete from '../../asset/images/complete.png'
import { parseDate, formatDate } from '../../utils/timeFormat'
import './index.scss'

@pageWithData('home')
@connect(({ home }) => ({
  ...home,
}))
export default class extends PureComponent {
  state = {
    isShowModal: false,
    currentIndex: 0,
    isShowShareModal: false,
  }
  onShareAppMessage = e => {
    if (e.target && e.target.dataset.type === 'go') {
      setTimeout(() => {
        this.props.dispatch(this.mappingAction('saveShareTimes', this.props.shareTimes + 1))
        Taro.navigateTo({
          url: '/pages/detail/index',
        })
      }, 2000)
    }
    return {
      title: this.props.isGarbRedBag
        ? '我刚领了现金红包，你也快来领吧❤️最高得888元！'
        : '给你发了双11现金红包，即抽即得❤️最高得888元！',
      imageUrl: ShareImage,
      path: `/pages/index/index`,
    }
  }
  handleSubmit(e) {
    if (!this.props.isDone) {
      this.props.dispatch(this.mappingAction('submit')).then(() => {
        this.setState({
          isShowModal: true,
        })
        this.handleStartTime()
        this.handleFixedTip(true)
        this.reportFormId(e)
      })
    }
  }
  reportFormId(e) {
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  handleOpenBag() {
    this.setState({
      isShowShareModal: false,
      isOpen: true,
    })
    setTimeout(() => {
      this.setState({
        isOpen: false,
      })
      this.props.dispatch(this.mappingAction('saveIsGarbRedBag', true))
    }, 1000)
  }
  handleGoDetail() {
    Taro.navigateTo({
      url: '/pages/detail/index',
    })
  }
  handleChangeModal(status) {
    this.setState({
      isShowModal: status,
      currentIndex: !status ? 1 : 0,
    })
  }
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.isDone && !nextProps.isExpired) {
      this.handleStartTime()
    }
  }
  handleFixedTip(status) {
    this.props.dispatch(this.mappingAction('saveIsShowFixedTip', status))
  }
  countDown(endDate) {
    let timer = null
    timer = setInterval(() => {
      var now = new Date()
      var leftTime = endDate.getTime() - now.getTime()
      var leftsecond = parseInt(leftTime / 1000)
      var d = Math.floor(leftsecond / (60 * 60 * 24))
      var h = Math.floor((leftsecond - d * 24 * 60 * 60) / 3600)
      var m = Math.floor((leftsecond - d * 24 * 60 * 60 - h * 3600) / 60)
      var s = Math.floor(leftsecond - d * 60 * 60 * 24 - h * 60 * 60 - m * 60)
      if (d === 0 && h === 0 && m === 0 && s === 0) {
        clearInterval(timer)
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
    }, 1000)
  }
  handleStartTime() {
    const { day, time } = this.props
    let date
    if (day === '今天') {
      date = parseDate(`${formatDate(new Date(), 'yyyy-MM-dd')} ${time}`, 'yyyy-MM-dd HH:mm')
    } else if (day === '明天') {
      const newDay = new Date()
      date = parseDate(`${formatDate(new Date(newDay.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd')} ${time}`, 'yyyy-MM-dd HH:mm')
    }
    this.countDown(date)
  }
  showShareSuccess() {
    setTimeout(() => {
      this.setState({
        isShowModal: false,
        isShowShareModal: true,
      })
    }, 1500)
  }
  handleQuickOpen() {
    Taro.showLoading({
      title: '开奖中，请稍候...',
    })
    setTimeout(() => {
      this.setState(
        {
          isShowShareModal: false,
        },
        Taro.hideLoading
      )
      this.props.dispatch(this.mappingAction('save', { isExpired: true }))
    }, 2000)
  }
  render() {
    const {
      loading,
      day,
      isDone,
      isExpired,
      time,
      barrages,
      isGarbRedBag,
      shareTimes,
      isShowFixedTip,
    } = this.props

    const { currentIndex, isOpen, isShowShareModal, isShowModal, leftDay, minute, second } = this.state

    const hour = leftDay * 24 + parseInt(this.state.hour)
    return (
      <block>
        {loading ? (
          <Loading height="100vh" />
        ) : (
          <View className="index">
            <Image src={MainBg} className="main-bg" />
            {isGarbRedBag && (
              <View className="bag-detail-container">
                <Image src={DetailBag} className="detail-bg" />
                <View className="detail-money">
                  <Text className="unit">￥</Text>
                  <Text className="money">{shareTimes > 0 ? 1.08 : 0.54}</Text>
                </View>
                <View className="bottom-btn-group">
                  <Button className="custom" openType="share" data-type="go">
                    <View className="top">分享到群，红包翻倍</View>
                    <View className="desc">¥ 1.08</View>
                  </Button>
                  <Button className="custom go" onClick={this.handleGoDetail.bind(this)}>
                    <View className="top">直接收下</View>
                  </Button>
                </View>
              </View>
            )}
            {isDone &&
              !isGarbRedBag &&
              isExpired && (
                <View className="open-container">
                  <Image src={OpenBg} className="open-bg" />
                  <Button
                    className={`custom img-button open-btn${isOpen ? ' shift' : ''}`}
                    onClick={this.handleOpenBag.bind(this)}
                  >
                    <Image src={OpenBtn} />
                  </Button>
                </View>
              )}
            {!isGarbRedBag &&
              !isExpired && (
                <block>
                  {isDone &&
                    isShowFixedTip && (
                      <View className="top-fixed-tip">
                        【 添加到我的小程序 】 ，避免错过中奖
                        <View className="right">
                          <View className="handle">
                            <Iconfont size={40} type="hand-point-up" />
                          </View>
                          <View className="close" onClick={this.handleFixedTip.bind(this, false)}>
                            <Iconfont size={24} type="close" />
                          </View>
                        </View>
                      </View>
                    )}
                  <Image src={DogBg} className="dog-bg" />
                  <Image src={CoreBack} className="core-bg" />
                  <Swiper
                    className="barrage-list"
                    current={0}
                    autoplay
                    vertical
                    circular
                    displayMultipleItems={2}
                    interval={1500}
                  >
                    {barrages.map(item => (
                      <SwiperItem className="item" key={item}>
                        <Barrage data={item} />
                      </SwiperItem>
                    ))}
                  </Swiper>
                  <View className="bottom">
                    <Image src={RedBag} className="bg" />
                    <View className="red-repeat-bg" />
                    <Form className="inner" onSubmit={this.handleSubmit.bind(this)} reportSubmit>
                      <View className="top-tip">奖品：双11单身狗福利现金红包</View>
                      <View className="top-desc">红包赞助商：省钱猪购物</View>
                      <View className="btn-container">
                        <Swiper current={currentIndex} className="swiper">
                          <SwiperItem className="item">
                            <View className="item-inner">
                              <Button
                                className={`custom${isDone ? ' disabled' : ''}`}
                                formType="submit"
                              >
                                {!isDone && <Image src={JoinBtnDog} className="join-dog" />}
                                {isDone && <Image src={DogGray} className="join-dog" />}
                                <View>{isDone ? '已参与' : '参与抽奖'}</View>
                              </Button>
                            </View>
                          </SwiperItem>
                          {isDone && (
                            <SwiperItem className="item pop">
                              <Image src={DogLine} className="dog-line" />
                              <View className="item-inner">
                                <View className="pop-share">
                                  分享到群，无需等待，立即开奖
                                </View>
                                <Form onSubmit={this.reportFormId.bind(this)} reportSubmit>
                                  <Button className="custom" openType="share" formType="submit" onClick={this.showShareSuccess.bind(this)}>
                                    <Image src={JoinBtnShareDog} className="join-share-dog" />
                                    <View>立即开奖</View>
                                  </Button>
                                </Form>
                              </View>
                            </SwiperItem>
                          )}
                        </Swiper>
                      </View>
                      {!isDone && (
                        <View className="bottom-tip">开奖时间：{`${day} ${time}`}</View>
                      )}
                      {isDone &&
                        !isNaN(hour) && (
                          <View className="bottom-tip">距离开奖还有：
                            <View className="time-diff">
                              <View className="item">{hour}</View>时
                              <View className="item">{minute}</View>分
                              <View className="item">{second}</View>秒
                            </View>
                          </View>
                        )}
                    </Form>
                  </View>
                </block>
              )}
            {isShowShareModal && (
              <View className="share-modal">
                <View className="bg" />
                <View className="inner">
                  <Image src={Complete} />
                  <View className="tip">分享成功！</View>
                  <Button className="share" onClick={this.handleQuickOpen.bind(this)}>
                    立即开奖
                  </Button>
                </View>
              </View>
            )}
            <CustomModal
              isShow={isShowModal}
              isFooter={false}
              onClose={this.handleChangeModal.bind(this, false)}
            >
              <View className="modal-content">
                <Image src={Clock} className="clock" />
                <View className="success-tip">参与成功</View>
                <View className="time">距离开奖还有</View>
                {!isNaN(hour) && (
                  <View className="time-diff">
                    <View className="item">{hour}</View>时
                    <View className="item">{minute}</View>分
                    <View className="item">{second}</View>秒
                  </View>
                )}
                <Form onSubmit={this.reportFormId.bind(this)} reportSubmit>
                  <Button className="share" openType="share" formType="submit" onClick={this.showShareSuccess.bind(this)}>
                    <View className="inner">
                      <View className="top-tip">分享到群，无需等待，立即开奖</View>
                      <View className="white">分享到群</View>
                    </View>
                  </Button>
                </Form>
              </View>
            </CustomModal>
          </View>
        )}
      </block>
    )
  }
}
