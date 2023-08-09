// https://juejin.cn/post/7232549203007602744

// import sade 
import sade from 'sade'
// 创建命令行
const prog = sade('lego')

prog.command('create <name>')
  .describe('create a component project')
  .option('-t, --type', 'Javascript or Typescript', 'typescript')
  .example('build src build --global --config my-config.js')
  .example('build app public -o main.js')
  .action(async (name, opts) => {
    console.log(name, opts)
    console.log(`> create component name: ${name}`);
    console.log(`> these are extra opts: ${opts}`);
    
  })

// 解析命令行内容
prog.parse(process.argv)