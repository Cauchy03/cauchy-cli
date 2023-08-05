const path = require('path')
const fse = require('fs-extra')
const Inquirer = require('inquirer')
const Creator = require('./Creator')
const { loading } = require('../utils/loading')

module.exports = async function (projectName, options) {
  // 获取当前工作目录
  const cwd = process.cwd()
  const targetDir = path.join(cwd, projectName)

  if (fse.existsSync(targetDir)) {
    // 如果强制创建文件且有同名文件则进行覆盖
    if (options.force) {
      // 删除同名文件
      await fse.remove(targetDir)
    } else {
      let { isOverWrite } = await new Inquirer.prompt([
        // 返回值为promise
        {
          name: 'isOverWrite',
          type: 'list',
          message: 'Target directory exists, Please choose an action. ',
          choices: [
            { name: 'Overwrite', value: true },
            { name: 'Cancel', value: false }
          ]
        }
      ])
      if (!isOverWrite) {
        console.log('Cancel')
        return
      } else {
        await loading(`Removing ${projectName}, please wait a minute`, fse.remove, targetDir)
      }
    }
  }
  // 创建项目
  const creator = new Creator(projectName, targetDir)
  creator.create()
}