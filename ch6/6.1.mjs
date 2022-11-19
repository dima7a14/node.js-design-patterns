import { Transform } from "node:stream";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import {
  createBrotliCompress,
  createDeflate,
  createGzip,
  constants,
} from "node:zlib";

function calc(srcFile = "./src.png", destFile = "./dest.txt") {
  class Summary extends Transform {
    constructor(name, options = {}) {
      super(options);
      this.name = name;
      this.start = new Date();
      this.size = 0;
    }

    _transform(chunk, encoding, callback) {
      this.size += chunk.length;
      callback();
    }

    _flush(cb) {
      const efficiency = 1 - this.size / statSync(srcFile).size;
      this.push(
        `${this.name} - efficiency: ${Math.floor(efficiency * 100)}%, ${
          (new Date() - this.start) / 1000
        }ms\n`
      );
      cb();
    }
  }

  const inputStream = createReadStream(srcFile);
  const destStream = createWriteStream(destFile, { encoding: "utf-8" });
  const algorithms = [
    {
      name: "Brotli",
      algorithm: createBrotliCompress({
        chunkSize: 32 * 1024,
        params: {
          [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
          [constants.BROTLI_PARAM_QUALITY]: 4,
        },
      }),
    },
    {
      name: "Deflate",
      algorithm: createDeflate(),
    },
    {
      name: "Gzip",
      algorithm: createGzip(),
    },
  ];
  let endCount = 0;

  for (const alg of algorithms) {
    inputStream
      .pipe(alg.algorithm)
      .pipe(new Summary(alg.name))
      .pipe(destStream, { end: false });

    alg.algorithm.on("end", () => {
      if (++endCount === algorithms.length) {
        destStream.end();
        console.log(`${destFile} is created`);
      }
    });
  }
}

calc();
