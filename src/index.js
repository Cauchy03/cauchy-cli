const program = require('commander')
const figlet = require('figlet')

program.name('cauchy-cli').usage(`<command>[option]`).version('1.0.0')

console.log("\r\n" + figlet.textSync("cauchy", {
  font: "Ghost",
  horizontalLayout: "default",
  verticalLayout: "default",
  width: 80,
  whitespaceBreak: true
}))

program
  .command("create <project-name>") // 添加创建指令
  .description("create a new project") // 添加描述信息
  .option("-f, --force", "overwrite target directory if it exists") // 强制覆盖
  .action((projectName, options) => {
    // 处理用户输入create 指令附加的参数
    require("./action/create")(projectName, options)
  })

program.parse(process.argv)