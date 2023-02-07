import { readFile, writeFile } from "node:fs/promises";
import styles from "ansi-styles";

class LoggerMiddlewareManager {
	constructor() {
		this.middleware = [];
	}

	use(middleware) {
		this.middleware.push(middleware);
	}

	async executeMiddleware(level, ...args) {
		let messages = args;

		for await (const middlewareCb of this.middleware) {
			messages = (await middlewareCb[level]?.(messages)) ?? messages;
		}

		return messages;
	}

	debug(...messages) {
		return this.executeMiddleware("debug", ...messages);
	}

	info(...messages) {
		return this.executeMiddleware("info", ...messages);
	}

	warn(...messages) {
		return this.executeMiddleware("warn", ...messages);
	}

	error(...messages) {
		return this.executeMiddleware("error", ...messages);
	}
}

function serialize() {
	function writeMessagesWithColor(messages, color) {
		messages.forEach((msg) =>
			console.log(`${color.open}${msg}${color.close}`)
		);
	}

	return {
		debug: (...messages) => {
			writeMessagesWithColor(messages, styles.blueBright);
			return messages;
		},
		info: (...messages) => {
			writeMessagesWithColor(messages, styles.bgGreen);
			return messages;
		},
		warn: (...messages) => {
			writeMessagesWithColor(messages, styles.yellowBright);
			return messages;
		},
		error: (...messages) => {
			writeMessagesWithColor(messages, styles.bgRed);
			return messages;
		},
	};
}

function saveToFile(path) {
	async function writeContent(messages) {
		let content = "";

		try {
			content = await readFile(path, { encoding: "utf-8" });
			content += "\n";
		} catch (err) {
			console.warn(`Error during reading a file: ${err}`);
		}

		content += messages.join("\n");

		try {
			await writeFile(path, content);
		} catch (err) {
			console.warn(`Error during writing into the file: ${err}`);
		}
	}

	return {
		debug: (...messages) => {
			return writeContent(messages).then(() => messages);
		},
		info: (...messages) => {
			return writeContent(messages).then(() => messages);
		},
		warn: (...messages) => {
			return writeContent(messages).then(() => messages);
		},
		error: (...messages) => {
			return writeContent(messages).then(() => messages);
		},
	};
}

async function main() {
	const manager = new LoggerMiddlewareManager();

	manager.use(serialize());
	manager.use(saveToFile("./log.txt"));

	await manager.debug("This is a debug point!");
	await manager.info("Interesting...");
	await manager.warn("This method is DEPRECATED!");
	await manager.error("Oops...");
}

main();
