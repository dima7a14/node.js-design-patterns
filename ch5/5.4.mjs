async function map(iterable, callback, concurrency) {
  const promises = Array.from(iterable).map((i) => callback(i));
  const results = [];
  let index = 0;

  while (index < promises.length) {
    const part = await Promise.all(promises.slice(index, index + concurrency));
    results.push(...part);
    index += concurrency;
  }

  return results;
}

function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

map(
  [1, 2, 3, 4, 5],
  async (item, index) => {
    await delay((5 - index) * 1000);
    return item * 1000;
  },
  2
);
