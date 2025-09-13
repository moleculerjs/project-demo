"use strict";

const { Service: DbService } = require("@moleculer/database");
const _ = require("lodash");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('@moleculer/database').DatabaseMixinOptions} DatabaseMixinOptions  Moleculer's Database Service Mixin Options
 */

/**
 *
 * @param {DatabaseMixinOptions} opts
 * @returns ServiceSchema
 */
module.exports = function (opts) {
	const collection = opts?.collection;

	opts = _.defaultsDeep(opts, {
		adapter:
			// In production use MongoDB
			process.env.DB_URI?.startsWith("mongodb://")
				? {
						type: "MongoDB",
						options: {
							uri: process.env.DB_URI
						}
					}
				: {
						type: "NeDB",
						options:
							// In unit/integration tests use in-memory DB. Jest sets the NODE_ENV automatically
							// During dev use file storage
							process.env.NODE_ENV === "test"
								? {
										neDB: {
											inMemoryOnly: true
										}
									}
								: `./data/${collection}.db`
					},
		strict: false
	});

	const cacheCleanEventName = `cache.clean.${collection}`;

	/** @type {MoleculerDB & ServiceSchema} */
	const schema = {
		/**
		 * Mixins. More info: https://moleculer.services/docs/0.15/services.html#Mixins
		 */
		mixins: [
			// @moleculer/database config: More info: https://github.com/moleculerjs/database
			DbService(opts)
		],

		/**
		 * Events. More info: https://moleculer.services/docs/0.15/events.html
		 */
		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName]() {
				await this.broker.cacher?.clean(`${this.fullName}.*`);
			}
		},

		/**
		 * Service started lifecycle event handler
		 * More info: https://moleculer.services/docs/0.15/lifecycle.html#started-event-handler
		 * @this {import('moleculer').Service}
		 */
		async started() {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const adapter = await this.getAdapter();
				const count = await adapter.count();
				if (count == 0) {
					this.logger.info(
						`The '${collection}' collection is empty. Seeding the collection...`
					);
					await this.seedDB();
					this.logger.info("Seeding is done. Number of records:", await adapter.count());
				}
			}
		}
	};

	return schema;
};
