import { totalSales as totalSalesRaw } from "./totalSales.js";

const runningRequests = new Map();

export function totalSales(product, callback) {
	if (runningRequests.has(product)) {
		console.log(`Batching product: ${product}`);

		runningRequests.set(product, [
			...runningRequests.get(product),
			callback,
		]);
	} else {
		totalSalesRaw(product, (sum) => {
			runningRequests.get(product).forEach((cb) => cb(sum));
			runningRequests.delete(product);
		});

		runningRequests.set(product, [callback]);
	}
}
