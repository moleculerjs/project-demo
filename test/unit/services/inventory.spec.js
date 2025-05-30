"use strict";

const { ServiceBroker } = require("moleculer");
const ChannelMiddleware = require("@moleculer/channels").Middleware;
const TestService = require("../../../services/inventory.service");

describe("Test 'inventory' service", () => {
	const broker = new ServiceBroker({
		logger: false,
		middlewares: [
			ChannelMiddleware({
				adapter: {
					type: "NATS"
				}
			})
		]
	});
	// Mock adapter methods
	broker.channelAdapter.init = jest.fn();
	broker.channelAdapter.connect = jest.fn();
	broker.channelAdapter.disconnect = jest.fn();
	broker.channelAdapter.subscribe = jest.fn();
	broker.channelAdapter.unsubscribe = jest.fn();
	broker.channelAdapter.publish = jest.fn();

	const service = broker.createService(TestService);

	// Store the reference to the original orderProduct method
	const ORIGINAL_ORDER_PRODUCT = service.orderProduct;
	service.orderProduct = jest.fn();

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	it("should call orderProduct method", async () => {
		const payload = {
			_id: "123456789",
			name: "iPhone"
		};

		// Use helper method to trigger the handler
		service.emitLocalChannelHandler("order.more", payload);

		// Check if inventory's method was called
		expect(service.orderProduct).toBeCalledTimes(1);
		expect(service.orderProduct).toBeCalledWith(payload);
	});

	it("should orderProduct", async () => {
		const roundSpy = jest.spyOn(Math, "round");
		const randomSpy = jest.spyOn(Math, "random");
		const loggerSpy = jest.spyOn(service.logger, "info");

		await ORIGINAL_ORDER_PRODUCT({ name: "My Product" });

		expect(roundSpy).toBeCalledTimes(2);
		expect(randomSpy).toBeCalledTimes(2);
		expect(loggerSpy).toBeCalledTimes(1);
	});
});
