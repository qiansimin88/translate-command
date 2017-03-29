#! /usr/bin/env node 
'use strict';
var program = require('commander');
var superagent = require('superagent');
var Table = require('cli-table2') // 表格输出插件
const youdaoAPI = 'http://fanyi.youdao.com/openapi.do?keyfrom=toaijf&key=868480929&type=data&doctype=json&version=1.1';
program
  //允许所有的未知命令
  .allowUnknownOption()
  //设置版本号   -V显示
  .version('1.0.0')
  //设置自定义的参数   格式如下  第二个参数描述
  .option('-d, --delete', '删除')
  //设置-h的usage的字段信息
  .usage('translator <cmd> [input]')
  //自定义命令  这个就是 输入 translate query 即可
  .command('query [world]')
  //上面命令的描述
  .description('翻译input')
  //上面自定义命令的回调 接受一个命令行参数
  .action((par) => {
    //http请求
    superagent.get(youdaoAPI)
      .query({ q: par })
      .end((err, res) => {
        if(err) {
          console.log('没查到，拜拜');
          process.exit(1);
        }
        let data = JSON.parse(res.text);
        let result = {};
        //处理有道返回的数据
        if(data.basic){
            result[par] = data['basic']['explains']
        }else if(data.translation){
            result[par] = data['translation']
        }else {
            console.error('error')
        }
        let table = new Table();
        table.push(result);
        //控制台打印
        process.stdout.write(table.toString());
      });
  });

//如果没有任何命令行参数 打印出help和展示所有的命令行
if(!process.argv[2]) {
  program.help();
}
program.parse(process.argv);
