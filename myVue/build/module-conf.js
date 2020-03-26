let chalk = require('chalk');
let glob = require('glob');


console.log("开始编译")
let moduleList = [];
let moduleSrcArray = glob.sync('./src/modules/*');  //获取modules下面的第一层文件夹路径

for (let module in moduleSrcArray) {
	// console.log("module: ",module)
	moduleList.push(moduleSrcArray[module].split('/')[3]); //拿到modules下面第一层文件夹的名字
	// console.log("moduleList: ", JSON.stringify(moduleList))
}

//检测输入的参数是否在允许的list中
let checkModule = () => {
	let module = process.env.MODULE_ENV;

	//檢查moduleList中是否存在重复模块
	let hash = {};
	let repeatList = [];

	for (let i = 0; i < moduleList.length; i++) {
		const module = moduleList[i];
		if (hash[module]) {
			repeatList.push(module);
		}
		hash[module] = true;
	}

	if (repeatList.length > 0) {
		console.log(chalk.red('moduleList 有重复：'));
		console.log(chalk.red(repeatList.toString()));
		return false;
	}

	//检测输入的模块名字是否存在于modules目录中
	let result = true;
	let illegelParam = '';

	for (const moduleToBuild of module.split(',')) {
		if (moduleList.indexOf(moduleToBuild) === -1) {
			result = false;
			illegelParam = moduleToBuild;
			break;
		}
	}

	if (!result) {
		console.log(chalk.red('参数错误，允许的参数为：'));
		console.log(chalk.green(moduleList.toString()));
		console.log(chalk.yellow(`非法参数：${illegelParam}`))
	}
	return result;
}

//获取当前要打包的模块列表
let getModuleToBuild = () => {
	let moduleToBuild = [];
	if (process.env.NODE_ENV === 'production') {
		/* 部署态，构建要打包的模块列表，如果指定了要打包的模块，那么按照指定的模块配置入口
		*  这里有个特性，即使参数未传，那么获取到的undefined也是字符串类型的，不是undefined类型
		* */

		//判断是否传了打包的参数
		//如果传了就只打包传了的模块，没有就打包全部

		//生产状态
		if (process.env.MODULE_ENV !== 'undefined') {
			moduleToBuild = process.env.MODULE_ENV.split(',');
		} else {
			moduleToBuild = moduleList;  
		}
	} else {  //开发状态
		moduleToBuild = moduleList;
	}

	return moduleToBuild;
}

exports.moduleList = moduleList;
exports.checkModule = checkModule;
exports.getModuleToBuild = getModuleToBuild;