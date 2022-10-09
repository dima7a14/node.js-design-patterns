import path from "path";
import fs from "fs";

function listNestedFiles(dir, cb) {
  const dirs = new Set([dir]);
  const files = [];
  const done = () => cb(files);
  const searchFiles = (dirPath) => {
    fs.readdir(path.resolve(dirPath), { encoding: "utf8" }, (err, data) => {
      if (err) {
        return console.log(err);
      }

      data.forEach((f) => {
        const filePath = path.resolve(dirPath, f);
        const stats = fs.lstatSync(filePath);

        if (stats.isDirectory()) {
          dirs.add(filePath);
          searchFiles(filePath);
        } else {
          files.push(filePath);
        }
      });
      dirs.delete(dirPath);

      if (dirs.size === 0) {
        done(files);
      }
    });
  };

  searchFiles(dir);
}

listNestedFiles("../", console.log);
