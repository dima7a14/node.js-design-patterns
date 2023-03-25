import { totalSales as totalSalesRaw } from "./totalSales.js";

const CACHE_TTL = 30_000;
const cache = new Map();

export function totalSales(product, callback) {
	if (cache.has(product)) {
		console.log(`Cache hit: ${product}`);

		return callback(cache.get(product));
	}

	totalSalesRaw(product, (result) => {
		cache.set(product, result);
		cache.set(product, result);
		setTimeout(() => {
			cache.delete(product);
		}, CACHE_TTL);

		callback(result);
	});
}
