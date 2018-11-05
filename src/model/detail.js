import modelExtend from 'dva-model-extend'
import action from '../utils/action'
import { getStorageShareTimes } from '../utils'
import { model } from './common'

export default modelExtend(model, {
  namespace: 'detail',
  state: {
    shareTimes: 0,
  },
  effects: {
    *init({ payload }, { call, put }) {},
  },
  reducers: {},
})
