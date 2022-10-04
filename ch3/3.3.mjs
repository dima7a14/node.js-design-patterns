import { EventEmitter } from "events";

function ticker(ms, cb) {
  const ee = new EventEmitter();
  const tickMs = 50;
  let count = 0;
  let timeout = null;
  const tick = () => {
    ee.emit("tick");
    count++;
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

ticker(100, (totalCount) => console.log(`Total ticks count: ${totalCount}`)).on(
  "tick",
  () => console.log("tick")
);
