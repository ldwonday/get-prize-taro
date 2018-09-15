import { View, Image, Text } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import './index.scss'

export default class extends Component {
  state = {
    pages: [
      {
        key: 'index/index',
        active: true,
        name: '精选',
        icon: require('../../asset/images/index.png'),
        activeIcon: require('../../asset/images/index-red.png'),
        path: '/pages/index/index',
      },
      {
        key: 'survey/index',
        active: true,
        name: '测一测',
        icon: require('../../asset/images/survey.png'),
        activeIcon: require('../../asset/images/survey-red.png'),
        path: '/pages/survey/index',
      },
      {
        key: 'favourites/index',
        active: false,
        name: '收藏',
        icon: require('../../asset/images/fav.png'),
        activeIcon: require('../../asset/images/fav-color.png'),
        path: '/pages/favourites/index',
      },
    ],
  }
  checkRoute(navkey) {
    const e = Taro.getCurrentPages(), n = e[e.length - 1].route
    return n.indexOf(navkey) !== -1
  }
  navigationTo(navkey, navurl) {
    this.checkRoute(navkey) ||
      Taro.redirectTo({
        url: navurl,
      })
  }
  componentDidMount() {
    const { pages } = this.state
    pages.forEach(route => {
      if (this.checkRoute(route.key)) {
        route.active = true
      } else {
        route.active = false
      }
    })
    this.setState({
      pages,
    })
  }
  render() {
    const { pages } = this.state
    return (
      <View className="navbar">
        {pages.map(route => {
          const { key, name, icon, activeIcon, active, path } = route
          return (
            <View
              key={key}
              onClick={this.navigationTo.bind(this, key, path)}
              className={active ? ['navbar-item', 'active'] : ['navbar-item']}
            >
              <Image src={active ? activeIcon : icon} />
              <Text>{name}</Text>
            </View>
          )
        })}
      </View>

    );
  }
}
