const axios = require('axios')
const https = require("https")

// 在 axios 请求时，选择性忽略 SSL
const agent = new https.Agent({
  rejectUnauthorized: false
})

// 拦截全局请求响应
axios.interceptors.response.use((res) => {
  return res.data
})

/**
 * 获取模板
 * @returns Promise
 */
async function getUserRepo() {
  return axios.get("https://api.github.com/users/Cauchy03/repos", {
    httpsAgent: agent
  })
}

/**
 * 获取仓库下的版本
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function getTagsByRepo(repo) {
  return axios.get(`https://api.github.com/repos/Cauchy03/${repo}/tags`, {
    httpsAgent: agent
  })
}

module.exports = {
  getUserRepo,
  getTagsByRepo
}