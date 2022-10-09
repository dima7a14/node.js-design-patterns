import path from "path";
import fs from "fs";

function recursiveFind(dir, keyword, cb) {
  const dirs = new Set([dir]);
  const searchFiles = (dirPath) => {
    fs.readdir(path.resolve(dirPath), { encoding: "utf8" }, (err, data) => {
      if (err) {
        return console.log(err);
      }

      let found = null;

      data.forEach((f) => {
        const filePath = path.resolve(dirPath, f);
        const stats = fs.lstatSync(filePath);

        if (stats.isDirectory()) {
          dirs.add(filePath);
          searchFiles(filePath);
        } else if (f.indexOf(keyword) !== -1) {
          found = f;
        }
      });

      if (found) {
        return cb(found);
      }

      dirs.delete(dirPath);

      if (dirs.size === 0) {
        return cb("Not found!");
      }
    });
  };

  searchFiles(dir);
}

recursiveFind("../", "package", console.log);
