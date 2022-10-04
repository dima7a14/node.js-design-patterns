import { EventEmitter } from "events";

function ticker(ms, cb) {
  const ee = new EventEmitter();
  const tickMs = 50;
  let count = 0;
  const initTime = Date.now();
  let timeout = null;
  const tick = () => {
    ee.emit("tick");
    count++;
    console.log(`timestamp: ${Date.now() - initTime}`);
    if ((Date.now() - initTime) % 5 === 0) {
      cb(new Error("Oops!"));
      ee.emit("error", new Error("Oops!"));
    }
    timeout = setTimeout(() => {
      if (count * tickMs <= ms) {
        tick();
      }
    }, tickMs);
  };

  process.nextTick(tick);
  setTimeout(() => {
    clearTimeout(timeout);
    cb(count);
  }, ms);

  return ee;
}

ticker(1000, (err, totalCount) => {
  if (err) {
    console.log(`Handle error ${err.message}`);
    return;
  }

  console.log(`Total ticks count: ${totalCount}`);
})
  .on("tick", () => console.log("tick"))
  .on("error", (err) => console.log("got an error", err.message));
