/* global APP_NAME */
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import Index from './pages/index'
import dva from './dva'
import models from './model'
import action from './utils/action'
import './app.scss'

const dvaApp = dva.createApp({
  initialState: {},
  models,
  onError(e, dispatch) {
    console.log(111, e)
  },
})
const store = dvaApp.getStore()

class App extends Component {
  config = {
    pages: ['pages/index/index', 'pages/detail/index'],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: APP_NAME,
      navigationBarTextStyle: 'black',
    },
  }

  componentDidMount = () => {
    dvaApp.dispatch(action('app/init'))
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(dvaApp.start(<App />), document.getElementById('app'))
