function queueUp(targetObj, methods, readyProperty) {
	const queue = [];

	return new Proxy(targetObj, {
		get(target, property) {
			if (methods.includes(property)) {
				console.log(`Queue up method ${property}`);
				queue.push(
					new Proxy(target[property], {
						apply(fnTarget, thisArg, argumentsList) {
							return Reflect.apply(
								fnTarget,
								thisArg,
								argumentsList
							);
						},
					})
				);
				return () => {};
			} else {
				return Reflect.get(target, property);
			}
		},
		set(target, property, value) {
			if (property === readyProperty) {
				console.log("Object initialized");
				while (queue.length > 0) {
					const cb = queue.pop();
					console.log("Calling method from queue");
					cb();
				}
			}

			return Reflect.set(target, property, value);
		},
	});
}

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function main() {
	const obj = {
		print: (val) => console.log(`Printing value ${val}`),
		fetch: (url) => console.log(`Fetching resource ${url}`),
		upload: (content, path) =>
			console.log(`Uploading content ${content} to ${path}`),
	};
	const queuedUpObj = queueUp(obj, ["fetch", "upload"], "initialized");

	queuedUpObj.print("message");
	queuedUpObj.fetch("website");
	queuedUpObj.upload("index.html", "/server");
	await delay(1000);
	queuedUpObj.someProperty = true;
	queuedUpObj.initialized = true;
}

main();
