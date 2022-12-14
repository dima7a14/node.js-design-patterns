import http from "node:http";

function createCacheableClient(client) {
  const cache = new Map();

  return new Proxy(client, {
    get(target, propKey, receiver) {
      if (propKey === "get") {
        return function (...args) {
          const [url, options, cb] = args;
          let key = url;
          let callback = cb;

          if (typeof options === "function") {
            callback = options;
          } else if (typeof options === "object") {
            key += JSON.stringify(options);
          }

          if (cache.has(key)) {
            return callback(cache.get(key));
          }

          const cbWithCache = (response) => {
            cache.set(key, response);
            return callback(response);
          };

          if (typeof options === "object") {
            return client.get(url, options, cbWithCache);
          }

          return client.get(url, cbWithCache);
        };
      }
    },
  });
}

function main() {
  const cachedHTTP = createCacheableClient(http);

  cachedHTTP.get("http://google.com/", (response) => {
    const { statusCode } = response;

    console.log(`Status: ${statusCode}`);
    cachedHTTP.get("http://google.com/", (response) => {
      const { statusCode } = response;

      console.log(`Status: ${statusCode}`);
    });
  });
}

main();
