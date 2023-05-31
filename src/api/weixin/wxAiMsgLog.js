import request from '@/utils/request'

// 查询ai对话记录列表
export function listWxAiMsgLog(query) {
  return request({
    url: '/weixin/wxAiMsgLog/list',
    method: 'get',
    params: query
  })
}

// 查询ai对话记录详细
export function getWxAiMsgLog(msgId) {
  return request({
    url: '/weixin/wxAiMsgLog/' + msgId,
    method: 'get'
  })
}

// 新增ai对话记录
export function addWxAiMsgLog(data) {
  return request({
    url: '/weixin/wxAiMsgLog',
    method: 'post',
    data: data
  })
}

// 修改ai对话记录
export function updateWxAiMsgLog(data) {
  return request({
    url: '/weixin/wxAiMsgLog',
    method: 'put',
    data: data
  })
}

// 删除ai对话记录
export function delWxAiMsgLog(msgId) {
  return request({
    url: '/weixin/wxAiMsgLog/' + msgId,
    method: 'delete'
  })
}
