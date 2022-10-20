function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Map();

    if (promises.length === 0) {
      return resolve(Array.from(...results.values()));
    }

    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];

      promise
        .then((result) => {
          results.set(i, result);

          if (results.size === promises.length) {
            const sortedResults = [];

            for (const [key, value] of results.entries()) {
              sortedResults[key] = value;
            }

            resolve(sortedResults);
          }
        })
        .catch((err) => reject(err));
    }
  });
}

function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

promiseAll([
  delay(1999).then(() => 1),
  delay(9000).then(() => 2),
  Promise.reject(new Error("Oops!")),
  delay(123).then(() => 4),
]).then((results) => console.log(results));
