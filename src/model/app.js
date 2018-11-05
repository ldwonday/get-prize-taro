import modelExtend from 'dva-model-extend'
import { model } from './common'
import { setIsFirst, getIsFirst } from '../utils'
import { formService } from '../service'
import action from '../utils/action'

export default modelExtend(model, {
  namespace: 'app',
  state: {
    startBarHeight: 0,
    navigationHeight: 0,
    isFirst: true,
  },
  reducers: {},
  effects: {
    *init({ payload }, { put }) {},
    *changeIsFirst({ payload }, { put }) {
      yield setIsFirst(payload)
      yield put(action('save', { isFirst: payload }))
    },
    *submitForm({ payload }, { call }) {
      yield call(formService.submit, payload)
    },
  },
})
