import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { setIsCash, getIsCash } from '../utils'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'detail',
  state: {
    shareTimes: 0,
  },
  effects: {
    *init({ payload }, { call, put }) {
      const res = yield getIsCash()
      yield put(
        action('save', {
          isCash: res.data,
        })
      )
    },
    *saveIsCash({ payload }, { call, put }) {
      yield setIsCash(payload)
      yield put(
        action('save', {
          isCash: payload,
        })
      )
    },
  },
})
