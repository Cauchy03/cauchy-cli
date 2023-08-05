const Inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const { loading } = require('../utils/loading')
const { getUserRepo, getTagsByRepo } = require('../api/api')

class Creator {
  constructor(name, target) {
    this.name = name
    this.target = target
  }
  // 创建项目
  async create() {
    // 仓库信息 - 模板信息
    let repo = await this.getRepoInfo()
    // 标签信息 - 版本信息
    let tag = await this.getTagInfo(repo)

    // 下载模板
    await this.download(repo, tag)
  }

  // 获取版本信息及用户选择的模板
  async getRepoInfo() {
    // 获取组织下的仓库信息
    let repoList = await loading('waiting for fetching template', getUserRepo)
    if (!repoList) return
    // 存储一下仓库信息
    this.repoList = repoList
    const repos = this.repoList.map(item => item.name)
    let { repo } = await new Inquirer.prompt([
      {
        name: 'repo',
        type: 'list',
        message: 'Please choose a template to create project',
        choices: repos
      }
    ])
    return repo
  }

  // 获取模板信息及用户选择的模板
  async getTagInfo(repo) {
    // 获取组织下的仓库信息
    let tagList = await loading('waiting for fetching version', getTagsByRepo, repo)
    if (!tagList.length) return
    // 提取仓库名
    const tags = tagList.map(item => item.name)
    let { tag } = await new Inquirer.prompt([
      {
        name: 'tag',
        type: 'list',
        message: 'Please choose a version to create project',
        choices: tags
      }
    ])
    return tag
  }

  //  下载git仓库
  async download(repo, tag) {
    /**
     * 多次试错
     * github模板下载 const templateUrl = github.com:<user>/<project>#branch
     * gitee模板下载 const templateUrl = direct:https://gitee.com/<user>/<project>#branch
     */
    const templateUrl = `github.com:Cauchy03/${repo}${tag ? '#' + tag : ''}`
    // 调用downloadGitRepo 将对应模板下载到指定目录
    const spinner = ora('downloading template, please wait')
    spinner.start()
    downloadGitRepo(templateUrl, path.resolve(process.cwd(), this.target), { clone: true }, (err) => {
      if (!err) {
        spinner.succeed()
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n cd ${chalk.cyan(this.name)}`)
        console.log('   pnpm install')
        console.log('   pnpm dev \r\n')
      }
    })
  }
}

module.exports = Creator