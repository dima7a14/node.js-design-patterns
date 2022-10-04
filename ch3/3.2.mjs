import { EventEmitter } from "events";

function ticker(ms, cb) {
  const ee = new EventEmitter();
  const tickMs = 50;
  let count = 0;
  let timeout = null;
  const tick = () => {
    timeout = setTimeout(() => {
      count++;

      if (count * tickMs <= ms) {
        ee.emit("tick");
        tick();
      }
    }, tickMs);
  };

  tick();
  setTimeout(() => {
    clearTimeout(timeout);
    cb(count);
  }, ms);

  return ee;
}

ticker(200, (totalCount) => console.log(`Total ticks count: ${totalCount}`)).on(
  "tick",
  () => console.log("tick")
);
