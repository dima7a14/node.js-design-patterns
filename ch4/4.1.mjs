import fs from "fs";

function concatFiles(...args) {
  const done = args.pop();
  const dest = args.pop();
  const srcFiles = [...args];
  let result = "";
  let index = 0;

  function readContent(fileName, cb) {
    fs.readFile(fileName, { encoding: "utf8" }, (err, data) => {
      if (err) {
        return cb(err);
      }

      result += data.toString();

      if (++index < srcFiles.length) {
        return readContent(srcFiles[index], cb);
      }

      return cb(null);
    });
  }

  function writeContent(err) {
    if (err) {
      done(err);
      return;
    }

    fs.writeFile(dest, result, () => done("Done !"));
  }

  readContent(srcFiles[0], writeContent);
}

concatFiles("./file1.txt", "./file2.txt", "./file3.txt", "dest.txt", (msg) =>
  console.dir(msg)
);
