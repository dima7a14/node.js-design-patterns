import { Level } from "level";

const db = new Level("example-db", { valueEncoding: "json" });

export async function totalSales(product, callback) {
	const now = Date.now();
	let sum = 0;

	for await (const transaction of db.values()) {
		if (!product || transaction.product === product) {
			sum += transaction.amount;
		}
	}

	console.log(`totalSales() took: ${Date.now() - now}ms`);

	return callback(sum);
}
