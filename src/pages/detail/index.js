import { View, Text, Image, Button, Form } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import WxParse from '../../components/wxParse/wxParse'
import action from '../../utils/action'
import { getStorageShareTimes, setStorageShareTimes } from '../../utils'
import { ShareButton, Loading } from '../../components'
import './index.scss'
import config from '../../config'

const effectName = name => `detail/${name}`
const mappingAction = (name, payload) => action(effectName(name), payload)
@connect(({ detail, loading }) => ({
  detail,
  loading,
}))
export default class extends Component {
  state = {
    nodeList: null,
    previewImg: [],
    isShowBottomAd: false,
  }
  config = {
    usingComponents: {
      'txv-video': 'plugin://tencentvideo/video',
    },
  }
  componentDidMount = async () => {
    const res = await Taro.getSystemInfo()
    this.windowHeight = res.windowHeight
    console.log(this.$router.params)
    this.props.dispatch(mappingAction('init', this.$router.params)).then(_ => {
      setTimeout(() => {
        Taro.createSelectorQuery()
          .selectAll('.top')
          .boundingClientRect(rects => {
            rects.forEach(rect => {
              const topHeight = rect.height + 68
              console.log(topHeight, this.windowHeight)
              if (topHeight > this.windowHeight) {
                this.setState({
                  isShowBottomAd: true,
                })
              }
            })
          })
          .exec()
      }, 1000)
    })
  }
  onReachBottom = () => {
    const { dispatch } = this.props
    dispatch(mappingAction('loadMore'))
  }
  componentWillReceiveProps = nextProps => {
    const { article } = nextProps.detail
    let content = article.content
    try {
      content = JSON.parse(content)
      this.setState({
        nodeList: content,
      })
    } catch (e) {
      try {
        WxParse.wxParse('richContent', 'html', article.content, this.$scope, 0)
      } catch (e) {
        console.log(111, e)
      }
    }
  }
  onShareAppMessage = e => {
    const { title, nId, cover } = this.props.detail.article
    return {
      title,
      imageUrl: cover,
      path: `/pages/detail/index?id=${nId}`,
      success: async () => {
        const resTimes = await getStorageShareTimes()
        let time = resTimes.data
        time += 1
        setStorageShareTimes(time)
      },
    }
  }
  saveFavourite() {
    this.props.dispatch(mappingAction('saveFavourite', this.props.detail.article))
  }
  showPreviewImage(t) {
    const { previewImg, nodeList } = this.state
    let list = []
    const imgUrl = t.currentTarget.dataset.imgurl
    if (previewImg.length) {
      list = previewImg
    } else {
      list = nodeList
        .filter(n => {
          return n.url
        })
        .map(m => {
          return m.url
        })
      this.setState({
        previewImg: list,
      })
    }
    Taro.previewImage({
      current: imgUrl,
      urls: list,
    })
  }
  reportForm(e) {
    console.log(this.props.page)
    const { id } = e.currentTarget.dataset
    const url = `/pages/detail/index?id=${id}&page=${this.props.page}`
    Taro.redirectTo({ url })
    this.props.dispatch(action('app/submitForm', e.detail.formId))
  }
  render() {
    const {
      loading,
      detail: {
        list,
        article,
      },
    } = this.props

    const isLoading = loading.effects['detail/init']
    const isLoadMore = loading.effects[effectName('loadMore')]

    const { nodeList, isShowBottomAd } = this.state

    const adHead = `adunit-${config.ad.detail.head}`
    const adMiddle = `adunit-${config.ad.detail.middle}`
    const adList = `adunit-${config.ad.detail.list}`
    const adDiff = 7

    return (
      <block>
        <View className="container">
          {isLoading ? (
            <Loading height="calc(100vh - 90rpx)" content="加载中..." />
          ) : (
            <block>
              <View className="top">
                <View className="title-container">
                  <View className="title">{article.title}</View>
                  {/* <View className="time">{article.time}发布</View> */}
                </View>
                <View className="ad">
                  <ad className="ad" unitId={adHead} />
                </View>
                <View className="content">
                  {article.vid && (
                    <View style="margin-bottom: 10rpx">
                      <txv-video playerid="video" vid={article.vid} />
                    </View>
                  )}
                  {nodeList &&
                    nodeList.map((node, index) => {
                      return (
                        <View className="graphic-item" key={index}>
                          {node.url &&
                            node.url !== '' && (
                              <Image
                                onClick={this.showPreviewImage.bind(this)}
                                data-imgurl={node.url}
                                mode="widthFix"
                                src={node.url}
                              />
                            )}
                          <Text wx:if="{{node.Text&&node.Text!==''}}">{node.Text}</Text>
                        </View>
                      )
                    })}
                  {!nodeList && (
                    <block>
                      <import src="../../components/wxParse/wxParse.wxml" />
                      <template is="wxParse" data="{{wxParseData:richContent.nodes}}" />
                    </block>
                  )}
                </View>
                {isShowBottomAd && (
                  <View className="ad" style="margin-bottom: 0;">
                    <ad className="ad" unitId={adMiddle} />
                  </View>
                )}
              </View>
              <View className="bottom">
                <View className="head">
                  <View className="end-line">- 下方更精彩 -</View>
                  <View className="btn-group">
                    <Button className="favourite" onClick={this.saveFavourite.bind(this)}>
                      收藏
                    </Button>
                    <Button className="share" openType="share">
                      分享
                    </Button>
                  </View>
                </View>
              </View>
              <View className="recommand">
                <View className="title">推荐文章</View>
                <View className="articles">
                  {list &&
                    list.map((item, index) => {
                      const adIndex = index + 1
                      return (
                        <Form
                          reportSubmit
                          onSubmit={this.reportForm.bind(this)}
                          data-id={item.nId}
                          key={item.nId}
                        >
                          <Button formType="submit" className="custom card-btn">
                            <View
                              onClick={this.goDetail.bind(this)}
                              data-id={item.nId}
                              className="list"
                              key={item.nId}
                            >
                              <View className="article-title">
                                <View className="head">{item.title}</View>
                                {/* <View className="time">{item.time}</View> */}
                              </View>
                              <View className="article-img">
                                <Image src={item.cover} />
                              </View>
                            </View>
                            {adIndex / adDiff > 0 &&
                            adIndex % adDiff === 0 && (
                              <View className="ad">
                                <ad className="ad" unitId={adList} />
                              </View>
                            )}
                          </Button>
                        </Form>
                      )
                    })}
                </View>
              </View>
            </block>
          )}
          <ShareButton />
        </View>
      </block>
    )
  }
}

