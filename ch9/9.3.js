class WarehouseItem {
	constructor(id, initialState) {
		this.itemId = id;
		this.state = initialState;
		this.state.setContext(this);
	}

	setState(state) {
		this.state = state;
	}

	store(locationId) {
		return this.state.store(locationId);
	}

	deliver(address) {
		return this.state.deliver(address);
	}

	describe() {
		return this.state.describe();
	}
}

class ItemState {
	constructor(ctx) {
		if (ctx) {
			this.setContext(ctx);
		}
	}

	setContext(ctx) {
		this.ctx = ctx;
	}

	store() {
		throw new Error("store() must be implemented");
	}

	deliver() {
		throw new Error("deliver() must be implemented");
	}

	describe() {
		throw new Error("describe() must be implemented");
	}
}

class ArrivingState extends ItemState {
	store(locationId) {
		this.ctx.setState(new StoredState(this.ctx, locationId));
	}

	deliver(address) {
		console.warn(
			`Cannot deliver ${this.ctx.itemId} to the ${address}. The item has not stored yet.`
		);
	}

	describe() {
		return `Item ${this.ctx.itemId} is on its way to the warehouse`;
	}
}

class StoredState extends ItemState {
	constructor(ctx, locationId) {
		super(ctx);
		this.locationId = locationId;
	}

	store(locationId) {
		console.warn(
			`Cannot store Item ${this.ctx.itemId} in location ${locationId}. The item is already stored in location ${this.locationId}`
		);
	}

	deliver(address) {
		this.ctx.setState(new DeliveredState(this.ctx, address));
	}

	describe() {
		return `Item ${this.ctx.itemId} is stored in location ${this.locationId}`;
	}
}

class DeliveredState extends ItemState {
	constructor(ctx, address) {
		super(ctx);
		this.address = address;
	}

	store(locationId) {
		console.warn(
			`Cannot store Item ${this.ctx.itemId} in location ${locationId}. The item has been already delivered to ${this.address}`
		);
	}

	deliver(address) {
		console.warn(
			`Cannot deliver Item ${this.ctx.itemId} to the ${address}. The item has been already delivered to ${this.address}`
		);
	}

	describe() {
		return `Item ${this.ctx.itemId} was delivered to ${this.address}.`;
	}
}

function main() {
	const item = new WarehouseItem(5821, new ArrivingState());

	console.log(item.describe());
	item.store("1ZH3");
	console.log(item.describe());
	item.deliver("John Smith, 1st Avenue, New York");
	console.log(item.describe());
}

main();
