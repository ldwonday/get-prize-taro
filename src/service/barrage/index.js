/* eslint-disable prettier/prettier */
import config from '../../config'
import request from '../../utils/request'

const { barrage } = config.api
export const productBarrage = () => {
  return request(barrage.product)
}
export const profitBarrage = (productId) => {
  return request(barrage.profit, {
    qs: {
      productId
    },
  })
}
export const emptyBarrage = (productId) => {
  return request(barrage.empty, {
    qs: {
      productId
    },
  })
}

