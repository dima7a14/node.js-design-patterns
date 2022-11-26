import { connect } from "node:net";
import { createReadStream, statSync } from "node:fs";

function sendFiles(fileNames, destination) {
  let openChannels = fileNames.length;

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const source = createReadStream(fileName);

    source
      .on("readable", function () {
        let chunk;

        while ((chunk = this.read()) !== null) {
          const outBuff = Buffer.alloc(1 + chunk.length);
          outBuff.writeUInt8(i + 1, 0);
          chunk.copy(outBuff, 1);
          console.log(`Sending packet (${chunk}) to channel: ${i + 1}`);
          destination.write(outBuff);
        }
      })
      .on("end", () => {
        if (--openChannels === 0) {
          destination.end();
        }
      });
  }
}

const socket = connect(3000, () => {
  sendFiles(process.argv.slice(2), socket);
});
