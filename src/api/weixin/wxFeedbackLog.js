import request from '@/utils/request'

// 查询问题反馈列表
export function listWxFeedbackLog(query) {
  return request({
    url: '/weixin/wxFeedbackLog/list',
    method: 'get',
    params: query
  })
}

// 查询问题反馈详细
export function getWxFeedbackLog(id) {
  return request({
    url: '/weixin/wxFeedbackLog/' + id,
    method: 'get'
  })
}

// 新增问题反馈
export function addWxFeedbackLog(data) {
  return request({
    url: '/weixin/wxFeedbackLog',
    method: 'post',
    data: data
  })
}

// 修改问题反馈
export function updateWxFeedbackLog(data) {
  return request({
    url: '/weixin/wxFeedbackLog',
    method: 'put',
    data: data
  })
}

// 删除问题反馈
export function delWxFeedbackLog(id) {
  return request({
    url: '/weixin/wxFeedbackLog/' + id,
    method: 'delete'
  })
}
