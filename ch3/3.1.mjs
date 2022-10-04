import path from "path";
import { EventEmitter } from "events";
import { readFile } from "fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  find(files) {
    process.nextTick(() => {
      this.emit("findstart");
    });
    for (const file of files) {
      readFile(file, "utf8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.regex);

        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }

    return this;
  }
}

const findRegexInstance = new FindRegex("Line 2");

findRegexInstance
  .find([
    path.join(process.cwd(), "fileA.txt"),
    path.join(process.cwd(), "fileB.json"),
  ])
  .on("findstart", () => console.log("Find process has been started"))
  .on("fileread", (file) => {
    console.log(`Found read ${file}`);
  })
  .on("found", (file, match) =>
    console.log(`Found match ${match} in file ${file}`)
  );
