import Taro from '@tarojs/taro'
import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { lotteryService, barrageService } from '../service'
import { model } from './common'
import { showTextToast, setIsGarbRedBag, getIsGarbRedBag, getStorageShareTimes, setStorageShareTimes, setIsShowFixedTip, getIsShowFixedTip } from '../utils'

export default modelExtend(model, {
  namespace: 'home',
  state: {},
  effects: {
    *init({ payload }, { call, put }) {
      yield put.resolve(action('query'))
      yield put(action('barrage'))
    },
    *query({ payload }, { call, put }) {
      const { data } = yield call(lotteryService.query)
      const res = yield getIsGarbRedBag()
      const resTimes = yield getStorageShareTimes()
      const resTip = yield getIsShowFixedTip()
      yield put(
        action('save', {
          ...data,
          isGarbRedBag: res.data,
          shareTimes: resTimes.data,
          isShowFixedTip: resTip.data,
        })
      )
    },
    *barrage({ payload }, { call, put }) {
      const { data } = yield call(barrageService.emptyBarrage)
      yield put(action('save', { barrages: data }))
    },
    *submit({ payload }, { call, put }) {
      try {
        Taro.showLoading()
        yield call(lotteryService.submit)
        Taro.hideLoading()
        yield put(action('save', { isDone: true }))
      } catch (e) {
        showTextToast('无服务开了个小差，再试一次吧。')
        Taro.hideLoading()
      }
    },
  },
  reducers: {
    saveShareTimes(state, { payload }) {
      setStorageShareTimes(payload)
      return {
        ...state,
        shareTimes: payload,
      }
    },
    saveIsGarbRedBag(state, { payload }) {
      setIsGarbRedBag(payload)
      return {
        ...state,
        isGarbRedBag: payload,
      }
    },
    saveIsShowFixedTip(state, { payload }) {
      setIsShowFixedTip(payload)
      return {
        ...state,
        isShowFixedTip: payload,
      }
    },
  },
})
