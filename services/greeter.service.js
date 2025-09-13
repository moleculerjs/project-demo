"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "greeter",

	/**
	 * Settings. More info: https://moleculer.services/docs/0.15/services.html#Settings
	 */
	settings: {},

	/**
	 * Dependencies. More info: https://moleculer.services/docs/0.15/services.html#Dependencies
	 */
	dependencies: [],

	/**
	 * Actions. More info: https://moleculer.services/docs/0.15/actions.html
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hello: {
			rest: {
				method: "GET",
				path: "/hello"
			},
			graphql: {
				query: "hello: String"
			},
			async handler() {
				return "Hello Moleculer";
			}
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string"
			},
			graphql: {
				mutation: "welcome(name: String!): String"
			},
			/** @param {import('moleculer').Context<{name: String}>} ctx */
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		}
	},

	/**
	 * Events. More info: https://moleculer.services/docs/0.15/events.html
	 */
	events: {},

	/**
	 * Methods. More info: https://moleculer.services/docs/0.15/services.html#Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#created-event-handler
	 * @this {import('moleculer').Service}
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#started-event-handler
	 * @this {import('moleculer').Service}
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#stopped-event-handler
	 * @this {import('moleculer').Service}
	 */
	async stopped() {}
};
