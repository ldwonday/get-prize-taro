import Taro from '@tarojs/taro'
import { formatDate } from './timeFormat'
import Notify from '../components/vant-weapp/dist/notify/notify'

export const getNavHeight = async () => {
  let startBarHeight = 20
  let navigationHeight = 44
  const res = await Taro.getSystemInfo()
  if (res.model.indexOf('iPhone X') !== -1){
    startBarHeight = 44
  }
  if (res.platform.indexOf('android') !== -1) {
    startBarHeight = res.statusBarHeight
  }
  return {
    startBarHeight,
    navigationHeight,
  }
}
export const showModal = content => {
  if (content) {
    return Taro.showModal({
      title: '提示',
      content,
      showCancel: false,
      confirmText: '好的',
    })
  }
}
export const showModalWithTitle = (title = '提示', content = '数据加载失败') => {
  if (content) {
    return Taro.showModal({
      title,
      content,
      showCancel: false,
      confirmText: '好的',
    })
  }
}
export const showTextToast = (content = '') => {
  return Taro.showToast({ title: content, icon: 'none' })
}
export const showFailModal = (content = '数据加载失败') => {
  return showModal(content)
}

export const showWxLoading = (title = '加载中...', mask = true) => {
  Taro.showLoading({ title, mask })
}

export const hideWxLoading = () => {
  Taro.hideLoading()
}

export const showNotify = (text, selector) => {
  Notify({
    text,
    duration: 1500,
    selector,
    backgroundColor: '#E64340',
  })
}

/*export const getStorageSyncAppConfig = () => {
  return Taro.getStorageSync('appConfig')
}
export const getStorageAppConfig = async () => {
  try {
    const res = await Taro.getStorage({ key: 'appConfig' })
    return res
  } catch (e) {
    const res = await queryConfig()
    return res
  }
}*/
export const setStorageAppConfig = result => {
  return Taro.setStorage({ key: 'appConfig', data: result })
}

export const getStorageSyncLoginResult = () => {
  return Taro.getStorageSync('loginResult')
}
export const getStorageLoginResult = () => {
  return Taro.getStorage({ key: 'loginResult' })
}
export const setStorageLoginResult = result => {
  return Taro.setStorage({ key: 'loginResult', data: result })
}

export const getStorageSynctUserInfo = () => {
  return Taro.getStorageSync('userInfo')
}
export const getStoragetUserInfo = () => {
  return Taro.getStorage({ key: 'userInfo' })
}
export const setStorageUserInfo = info => {
  return Taro.setStorage({ key: 'userInfo', data: info })
}

export const getStorageProduct = () => {
  return Taro.getStorage({ key: 'product' })
}
export const setStorageProduct = product => {
  return Taro.setStorage({ key: 'product', data: product })
}

export const getProductShareTimes = () => {
  return Taro.getStorage({ key: 'productShareTimes' })
}
export const setProductShareTimes = productShareTimes => {
  return Taro.setStorage({ key: 'productShareTimes', data: productShareTimes })
}

export const getStorageShareCode = () => {
  return Taro.getStorage({ key: 'shareCode' })
}
export const setStorageShareCode = shareCode => {
  return Taro.setStorage({ key: 'shareCode', data: shareCode })
}

export const getStorageEditAddress = () => {
  return Taro.getStorage({ key: 'editAddress' })
}
export const setStorageEditAddress = shareCode => {
  return Taro.setStorage({ key: 'editAddress', data: shareCode })
}

export const setStorageShareTimes = times => {
  return Taro.setStorage({ key: 'shareTimes', data: times })
}

export const setIsShowFixedTip = fixedTip => {
  return Taro.setStorage({ key: 'isShowFixedTip', data: fixedTip })
}

export const getIsShowFixedTip = async () => {
  try {
    const res = await Taro.getStorage({ key: 'isShowFixedTip' })
    return res
  } catch (e) {
    return { data: true }
  }
}

export const setIsFirst = isFirst => {
  return Taro.setStorage({ key: 'isFirst', data: isFirst })
}

export const getIsFirst = isFirst => {
  return Taro.getStorage({ key: 'isFirst' })
}

export const setIsGarbRedBag = isGarbRedBag => {
  return Taro.setStorage({ key: 'isGarbRedBag', data: isGarbRedBag })
}

export const getIsGarbRedBag = async () => {
  try {
    const res = await Taro.getStorage({ key: 'isGarbRedBag' })
    return res
  } catch (e) {
    return { data: false }
  }
}

export const setIsCash = isCash => {
  return Taro.setStorage({ key: 'isCash', data: isCash })
}

export const getIsCash = async () => {
  try {
    const res = await Taro.getStorage({ key: 'isCash' })
    return res
  } catch (e) {
    return { data: false }
  }
}

export const getStorageShareTimes = async () => {
  try {
    const times = await Taro.getStorage({ key: 'shareTimes' })
    return times
  } catch (e) {
    await setStorageShareTimes(0)
    return { data: 0 }
  }
}

export const getStorageShareTimesInit = async () => {
  let times
  const currentDate = formatDate(new Date(), 'yyyy-MM-dd')
  const today = {
    time: currentDate,
    number: 0,
  }
  try {
    const { data }= await getStorageShareTimes()
    times = data
  } catch (e) {
    times = []
  }
  const cur = times.find(item => item.time === currentDate)
  if (!cur) {
    times.splice(0, 0, today)
    await setStorageShareTimes(times)
  }
  return times
}
