import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function createMemoryAdapter(store) {
  return {
    readFile(filename, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else if (typeof options === "string") {
        options = { encoding: options };
      }

      if (!store.has(resolve(filename))) {
        const err = new Error(`ENOENT, open "${filename}"`);
        err.code = "ENOENT";
        err.errno = 34;
        callback && callback(err);
        return;
      }

      callback && callback(null, store.get(resolve(filename)));
    },
    writeFile(filename, contents, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else if (typeof options === "string") {
        options = { encoding: options };
      }

      store.set(resolve(filename), contents);

      callback && callback();
    },
  };
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const fs = createMemoryAdapter(new Map());

fs.writeFile("test.txt", "some content", () => {
  fs.readFile("test.txt", (err, content) => {
    if (err) {
      return console.error(err);
    }

    console.log(`Read memory::::${content}`);
  });
});
