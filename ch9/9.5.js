import superagent from "superagent";

class AsyncQueue {
	constructor() {
		this.queue = [];
		this.isDone = false;
	}

	enqueue(task) {
		if (!this.isDone) {
			this.queue.push(task);
		}
	}

	done() {
		this.isDone = true;
	}

	[Symbol.asyncIterator]() {
		return {
			next: async () => {
				const task = this.queue.shift();

				if (!task || this.isDone) {
					return { done: true };
				}

				try {
					const taskResult = await task();

					return {
						done: false,
						value: taskResult,
					};
				} catch (err) {
					return {
						done: false,
						value: `Calling ${task} ended up with an error: ${err.message}`,
					};
				}
			},
		};
	}
}

function getURL(url) {
	return superagent.get(url).then((res) => res.status);
}

async function main() {
	const queue = new AsyncQueue();

	queue.enqueue(() => getURL("https://google.com/"));
	queue.enqueue(() => getURL("https://github.com/"));
	queue.enqueue(() => getURL("https://npmjs.com/"));
	queue.enqueue(() => getURL("https://nodejs.org/"));

	for await (const result of queue) {
		console.log(result);
	}

	console.log("End of the first queue");

	queue.done();

	queue.enqueue(() => getURL("https://google.com/"));
	queue.enqueue(() => getURL("https://github.com/"));
	queue.enqueue(() => getURL("https://npmjs.com/"));
	queue.enqueue(() => getURL("https://nodejs.org/"));

	for await (const result of queue) {
		console.log(result);
	}

	console.log("End of the second queue");
}

main();
