import request from '@/utils/request'

// 查询答非所问单词列表
export function listWxAbnormalWord(query) {
  return request({
    url: '/weixin/wxAbnormalWord/list',
    method: 'get',
    params: query
  })
}

// 查询答非所问单词详细
export function getWxAbnormalWord(id) {
  return request({
    url: '/weixin/wxAbnormalWord/' + id,
    method: 'get'
  })
}

// 新增答非所问单词
export function addWxAbnormalWord(data) {
  return request({
    url: '/weixin/wxAbnormalWord',
    method: 'post',
    data: data
  })
}

// 修改答非所问单词
export function updateWxAbnormalWord(data) {
  return request({
    url: '/weixin/wxAbnormalWord',
    method: 'put',
    data: data
  })
}

// 删除答非所问单词
export function delWxAbnormalWord(id) {
  return request({
    url: '/weixin/wxAbnormalWord/' + id,
    method: 'delete'
  })
}
