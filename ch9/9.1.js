import { readFile, writeFile } from "node:fs/promises";
import styles from "ansi-styles";

class Logger {
  constructor({ destination }) {
    this.destination = destination;
  }

  debug(...messages) {
    this.destination.write(
      ...messages.map(
        (msg) => `${styles.blueBright.open}${msg}${styles.blueBright.close}`
      )
    );
  }

  info(...messages) {
    this.destination.write(
      ...messages.map(
        (msg) => `${styles.bgGreen.open}${msg}${styles.bgGreen.close}`
      )
    );
  }

  warn(...messages) {
    this.destination.write(
      ...messages.map(
        (msg) => `${styles.yellowBright.open}${msg}${styles.yellowBright.close}`
      )
    );
  }

  error(...messages) {
    this.destination.write(
      ...messages.map(
        (msg) =>
          `${styles.bgRed.open}${styles.white.open}${msg}${styles.white.close}${styles.bgRed.close}`
      )
    );
  }
}

const consoleDestination = {
  write: (...msgs) => {
    console.log(...msgs);
  },
};

class FileDestination {
  constructor(dest) {
    this.dest = dest;
    this.buf = "";
    this.isProcessing = false;
  }

  #writeMessage() {
    if (!this.buf) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;

    readFile(this.dest, { encoding: "utf-8" })
      .then((prev) => {
        return `${prev}\n${this.buf}`;
      })
      .catch((err) =>
        console.error(`Error during reading the destination: ${err}`)
      )
      .then((content) => {
        return writeFile(this.dest, content)
          .then(() => {
            this.buf = "";
            this.isProcessing = false;
          })
          .catch((err) =>
            console.error(`Error during writing into the destination: ${err}`)
          );
      });
  }

  write(...msgs) {
    const content = msgs.join("\n");
    this.buf = `${this.buf}\n${content}`;

    if (!this.isProcessing) {
      this.#writeMessage();
    }
  }
}

function main() {
  const consoleLogger = new Logger({ destination: consoleDestination });

  consoleLogger.debug("This is a debug point!");
  consoleLogger.info("Interesting...");
  consoleLogger.warn("This method is DEPRECATED!");
  consoleLogger.error("Oops...");

  const fileLogger = new Logger({
    destination: new FileDestination("./fileDestination.txt"),
  });

  fileLogger.debug("This is a debug point!");
  fileLogger.info("Interesting...");
  fileLogger.warn("This method is DEPRECATED!");
  fileLogger.error("Oops...");
}

main();
