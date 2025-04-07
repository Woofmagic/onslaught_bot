/**
 * Project: Onslaught Discord Bot
 * File: events/ready.js
 * Author: Woofmagic
 * Created: 2025-04-06
 * Last Modified: 2025-04-06
 *
 * Description:
 * `ready` is an event listener that runs *once*, and it runs
 * when the Discord bot has registered all of its commands and
 * events to the REST API without error.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-07: Creation of the file.
 */

// (1): Require relevant modules:
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		if (!client) return;

		try {
			console.log(`> ${client.user.tag} (${client.application.id}) now online!`);

		}
		catch (error) {

			console.log(`> Failed ClientReady Event:\n> ${error.message}`);

		}
	},
};
