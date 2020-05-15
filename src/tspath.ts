#! /usr/bin/env node

/*=--------------------------------------------------------------=

 TSPath - Typescript Path Resolver

 Author : Patrik Forsberg
 Email  : patrik.forsberg@coldmind.com
 GitHub : https://github.com/duffman

 I hope this piece of software brings joy into your life, makes
 you sleep better knowing that you are no longer in path hell!

 Use this software free of charge, the only thing I ask is that
 you obey to the terms stated in the license, i would also like
 you to keep the file header intact.

 Also, I would love to see you getting involved in the project!

 Enjoy!

 This software is subject to the LGPL v2 License, please find
 the full license attached in LICENCE.md

 =----------------------------------------------------------------= */

const pkg      = require('../package.json');
let fs         = require("fs");
let path       = require("path");
let chalk      = require("chalk");
let log        = console.log;
let Confirm    = require('prompt-confirm');
let yargs      = require("yargs").argv;

import { ParserEngine }     from "./parser-engine";
import { ParentFileFinder } from "./parent-file-finder";
import { TS_CONFIG }        from "./type-definitions";


export class TSPath {
	private engine = new ParserEngine();

	constructor() {
		log(chalk.yellow("TSPath " + pkg.version));
		let args = process.argv.slice(2);
		let param = args[0];
		let filter = ["js"];
		let force: boolean = (yargs.force || yargs.f);
		let projectPath = process.cwd();
		let compactOutput = yargs.preserve ? false : true;
		let findResult = ParentFileFinder.findFile(projectPath, TS_CONFIG);

		let scope = this;

		if (yargs.ext || yargs.filter) {
			let argFilter = yargs.ext ? yargs.ext : yargs.filter;
			filter = argFilter.split(",").map((ext) => {
				return ext.replace(/\s/g, "");
			});
		}

		if (filter.length === 0) {
			log(chalk.bold.red("File filter missing!"));
			process.exit(23);
		}

		this.engine.compactMode = compactOutput;
		this.engine.setFileFilter(filter);
		scope.processPath(findResult.path);

		// if (force && findResult.fileFound) {
		// 	scope.processPath(findResult.path);

		// } else if (findResult.fileFound) {
		// 	let confirm = new Confirm("Process project at: <"  + findResult.path +  "> ?")
		// 		.ask(function(answer) {
		// 			if (answer) {
		// 				scope.processPath(findResult.path);
		// 			}
		// 		});

		// } else {
		// 	log(chalk.bold("No project root found!"));
		// }
	}

	private processPath(projectPath: string) {
		if (this.engine.setProjectPath(projectPath)) {
			this.engine.execute();
		}
	}
}

let tspath = new TSPath();
