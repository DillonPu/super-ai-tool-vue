import request from '@/utils/request'

// 查询微信用户充值消费记录列表
export function listWxUserMoneyLog(query) {
  return request({
    url: '/weixin/wxUserMoneyLog/list',
    method: 'get',
    params: query
  })
}

// 查询微信用户充值消费记录详细
export function getWxUserMoneyLog(id) {
  return request({
    url: '/weixin/wxUserMoneyLog/' + id,
    method: 'get'
  })
}

// 新增微信用户充值消费记录
export function addWxUserMoneyLog(data) {
  return request({
    url: '/weixin/wxUserMoneyLog',
    method: 'post',
    data: data
  })
}

// 修改微信用户充值消费记录
export function updateWxUserMoneyLog(data) {
  return request({
    url: '/weixin/wxUserMoneyLog',
    method: 'put',
    data: data
  })
}

// 删除微信用户充值消费记录
export function delWxUserMoneyLog(id) {
  return request({
    url: '/weixin/wxUserMoneyLog/' + id,
    method: 'delete'
  })
}
