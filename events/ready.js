/**
 * Project: Onslaught Discord Bot
 * File: events/ready.js
 * Author: Woofmagic
 * Created: 2025-04-07
 * Last Modified: 2025-04-07
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

		// (): If client is unavailable, we do nothing:
		if (!client) return;

		// (): If the client is available, we go ahead and simply log something:
		try {

			// (): Log this basic message:
			console.log(`> ${client.user.tag} (${client.application.id}) now online!`);

			// (): Return from the event:
			return;

		}

		// (): If there is an error in logging some nonsense...
		catch (error) {

			// (): ... log the error, whatever it is:
			console.log(`> Failed ClientReady Event:\n> ${error.message}`);

		}
	},
};
