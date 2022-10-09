import path from "path";
import fs from "fs";

function recursiveFind(dir, keyword, cb) {
  const foundFiles = [];
  const processingPaths = new Set([dir]);
  const done = () => {
    if (processingPaths.size === 0) {
      cb(foundFiles);
    }
  };
  const searchContent = (filePath) => {
    fs.readFile(filePath, { encoding: "utf8" }, (err, fileContent) => {
      if (err) {
        return console.log(err);
      }

      if (fileContent.toString().indexOf(keyword) !== -1) {
        foundFiles.push(filePath);
      }

      processingPaths.delete(filePath);

      done();
    });
  };
  const searchFiles = (dirPath) => {
    fs.readdir(path.resolve(dirPath), { encoding: "utf8" }, (err, data) => {
      if (err) {
        return console.log(err);
      }

      data.forEach((f) => {
        const filePath = path.resolve(dirPath, f);
        const stats = fs.lstatSync(filePath);

        processingPaths.add(filePath);

        if (stats.isDirectory()) {
          searchFiles(filePath);
        } else {
          searchContent(filePath);
        }
      });

      processingPaths.delete(dirPath);

      done();
    });
  };

  searchFiles(dir);
}

recursiveFind("./", "bar", console.log);
