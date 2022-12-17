import { Buffer } from "node:buffer";

function createLazyBuffer(size) {
  let buf = null;

  return new Proxy(
    {},
    {
      get(target, propKey, receiver) {
        if (propKey === "write") {
          if (!buf) {
            buf = Buffer.alloc(size);
          }

          return buf.write.bind(buf);
        }

        if (propKey === "length" && !buf) return 0;

        if (buf) {
          if (typeof buf[propKey] === "function") return buf[propKey].bind(buf);

          return buf[propKey];
        }
      },
    }
  );
}

function main() {
  const lazyBuffer = createLazyBuffer(10);
  console.log("Lazy Buffer size before write ->", lazyBuffer.length);

  lazyBuffer.write("HELLO!", 0);

  console.log("Lazy Buffer size after write ->", lazyBuffer.length);
}

main();
