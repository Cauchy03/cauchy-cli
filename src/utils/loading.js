const ora = require('ora')

/**
 * 睡眠函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve
    }, n)
  })
}

/**
 * 
 * @param {String} message 加载信息
 * @param {Function} fn 加载函数
 * @param  {...any} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
async function loading(message, fn, ...args) {
  const spinner = ora(message)
  spinner.start() // 开始加载
  try {
    let executeRes = await fn(...args)
    spinner.succeed()
    return executeRes
  } catch (error) {
    spinner.fail('Request fail, reTrying')
    await sleep(1000)
    return loading(message, fn, ...args)
  }
}

module.exports = { loading }