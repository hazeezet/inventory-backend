const fs = require('fs');
const path = require('path');

module.exports = {
	// Supports all esbuild.build options
	esbuild: {
		minify: true,
		target: "es2022",
	},
	
	// Prebuild hook
	prebuild: async () => {
		deleteFolderRecursive("./dist") // clean up dist folder
	},
	// Postbuild hook
	postbuild: async () => {
		const cpy = (await import("cpy")).default;
		await cpy(
			[
				"package.json",
				"package-lock.json",
				".sequelizerc",
				"sequelize",
				"config"
			],
			"dist"
		);
		await cpy(
			[
				"src/services/email/templates/**/*"
			],
			"dist/services/email/templates"
		);
	},
};

const deleteFolderRecursive = function (directoryPath) {
	if (fs.existsSync(directoryPath)) {
		fs.readdirSync(directoryPath).forEach((file, index) => {
			const curPath = path.join(directoryPath, file);
			try {
				if (fs.lstatSync(curPath).isDirectory()) {
					// recurse
					deleteFolderRecursive(curPath);
				} else {
					// delete file
					fs.unlinkSync(curPath);
				}
			} catch (error) {
				fs.rmSync(curPath, { recursive: true });
				deleteFolderRecursive(curPath)
			}

		});
		fs.rmSync(directoryPath, { recursive: true });
	}
};
