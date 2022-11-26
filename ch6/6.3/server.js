import { createServer } from "node:net";
import { createWriteStream } from "node:fs";

// TODO: Fix a bug with merged channels
// TODO: Add a layer of encryption

function receiveFiles(source) {
  let currentChannel = null;
  const files = new Map();

  source
    .on("readable", () => {
      console.log("GOT", source.read());
      let chunk;

      if (currentChannel === null) {
        chunk = source.read(1);

        if (chunk) {
          currentChannel = chunk.readUInt8();
        }

        console.log(`currentChannel ${currentChannel}`);

        chunk = source.read();

        if (chunk === null) {
          return null;
        }

        console.log(`Received packet from: ${currentChannel}, ${chunk}`);

        if (!files.has(currentChannel)) {
          files.set(
            currentChannel,
            createWriteStream(`dest${currentChannel}.txt`, {
              encoding: "utf-8",
            })
          );
        }

        files.get(currentChannel).write(chunk);
        currentChannel = null;
      }
    })
    .on("end", () => {
      for (const file of files.values()) {
        file.end();
      }
      console.log("Source channel closed");
    });
}

const server = createServer((socket) => {
  receiveFiles(socket);
});

server.listen(3000, () => console.log("Server started"));
