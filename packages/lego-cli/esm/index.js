"use strict";
// https://juejin.cn/post/7232549203007602744
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import sade 
const sade_1 = __importDefault(require("sade"));
// 创建命令行
const prog = (0, sade_1.default)('lego');
prog.command('create <name>')
    .describe('create a component project')
    .option('-t, --type', 'Javascript or Typescript', 'typescript')
    .example('build src build --global --config my-config.js')
    .example('build app public -o main.js')
    .action((name, opts) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(name, opts);
    console.log(`> create component name: ${name}`);
    console.log(`> these are extra opts: ${opts}`);
}));
// 解析命令行内容
prog.parse(process.argv);
//# sourceMappingURL=index.js.map