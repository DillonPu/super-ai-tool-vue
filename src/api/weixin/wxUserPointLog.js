import request from '@/utils/request'

// 查询微信用户充值记录列表
export function listWxUserPointLog(query) {
  return request({
    url: '/weixin/wxUserPointLog/list',
    method: 'get',
    params: query
  })
}

// 查询微信用户充值记录详细
export function getWxUserPointLog(id) {
  return request({
    url: '/weixin/wxUserPointLog/' + id,
    method: 'get'
  })
}

// 新增微信用户充值记录
export function addWxUserPointLog(data) {
  return request({
    url: '/weixin/wxUserPointLog',
    method: 'post',
    data: data
  })
}

// 修改微信用户充值记录
export function updateWxUserPointLog(data) {
  return request({
    url: '/weixin/wxUserPointLog',
    method: 'put',
    data: data
  })
}

// 删除微信用户充值记录
export function delWxUserPointLog(id) {
  return request({
    url: '/weixin/wxUserPointLog/' + id,
    method: 'delete'
  })
}
