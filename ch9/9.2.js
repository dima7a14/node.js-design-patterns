import { readFile, writeFile } from "node:fs/promises";
import styles from "ansi-styles";

class Logger {
	debug(...messages) {
		throw new Error("debug() must be implemented");
	}

	info(...messages) {
		throw new Error("info() must be implemented");
	}

	warn(...messages) {
		throw new Error("warn() must be implemented");
	}

	error(...messages) {
		throw new Error("error() must be implemented");
	}
}

class ConsoleLogger extends Logger {
	#print(messages, color) {
		if (messages.length > 0) {
			console.log(color.open);
			messages.forEach((msg) => console.log(msg));
			console.log(color.close);
		}
	}

	debug(...messages) {
		this.#print(messages, styles.blueBright);
	}

	info(...messages) {
		this.#print(messages, styles.bgGreen);
	}

	warn(...messages) {
		this.#print(messages, styles.yellowBright);
	}

	error(...messages) {
		this.#print(messages, styles.bgRed);
	}
}

class FileLogger extends Logger {
	constructor(dest) {
		super();
		this.dest = dest;
		this.buf = "";
		this.isProcessing = false;
	}

	async #writeMessage() {
		if (!this.buf) {
			this.isProcessing = false;
			return;
		}

		this.isProcessing = true;

		let content = "";

		try {
			content = await readFile(this.dest, { encoding: "utf-8" });
		} catch (err) {
			console.warn(`Error during reading a file: ${err}`);
		}

		try {
			const newContent = `${content}\n${this.buf}`;
			await writeFile(this.dest, newContent);
			this.buf = "";
			this.isProcessing = false;
		} catch (err) {
			console.error(`Error during writing into the file: ${err}`);
		}
	}

	debug(...messages) {
		const content = messages.join("\n");
		this.buf = `${this.buf}\nDEBUG:::${content}`;

		if (!this.isProcessing) {
			this.#writeMessage();
		}
	}

	info(...messages) {
		const content = messages.join("\n");
		this.buf = `${this.buf}\nINFO:::${content}`;

		if (!this.isProcessing) {
			this.#writeMessage();
		}
	}

	warn(...messages) {
		const content = messages.join("\n");
		this.buf = `${this.buf}\nWARN:::${content}`;

		if (!this.isProcessing) {
			this.#writeMessage();
		}
	}

	error(...messages) {
		const content = messages.join("\n");
		this.buf = `${this.buf}\nERROR:::${content}`;

		if (!this.isProcessing) {
			this.#writeMessage();
		}
	}
}

function main() {
	const consoleLogger = new ConsoleLogger();

	consoleLogger.debug("This is a debug point!");
	consoleLogger.info("Interesting...");
	consoleLogger.warn("This method is DEPRECATED!");
	consoleLogger.error("Oops...");

	const fileLogger = new FileLogger("./fileDestination.txt");

	fileLogger.debug("This is a debug point!");
	fileLogger.info("Interesting...");
	fileLogger.warn("This method is DEPRECATED!");
	fileLogger.error("Oops...");
}

main();
