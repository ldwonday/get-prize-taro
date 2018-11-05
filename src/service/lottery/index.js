/* eslint-disable prettier/prettier */
import config from '../../config'
import request from '../../utils/request'

const lottery = config.api.lottery

export const submit = (params) => {
  return request(lottery.submit, {
    method: 'POST',
    customToken: true,
    contentType: 'application/json',
    body: {
      ...params,
    }
  })
}
export const query = () => {
  return request(lottery.exist, {
    customToken: true,
  })
}

