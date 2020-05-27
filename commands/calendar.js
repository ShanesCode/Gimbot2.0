// const sqlite3 = require('sqlite3').verbose();
const calendarHandler = require('./handlers/calendarHandler.js');

module.exports = {
	name: 'calendar',
	description: 'View the calendar of events (NOT YET AVAILABLE)',
	cooldown: 1,
	execute(message, args) {
		const currentDateTime = new Date();
		const currentMonth = 1 + currentDateTime.getMonth();
		const currentYear = currentDateTime.getFullYear();

		let month = currentMonth;
		let year = currentYear;

		if (args.length > 0) {
			if (typeof args[0] === 'string') {
				const monthString = args[0].toUpperCase();

				switch(true) {
					case monthString.includes('JAN') : month = 0; break;
					case monthString.includes('FEB') : month = 1; break;
					case monthString.includes('MAR') : month = 2; break;
					case monthString.includes('APR') : month = 3; break;
					case monthString.includes('MAY') : month = 4; break;
					case monthString.includes('JUN') : month = 5; break;
					case monthString.includes('JUL') : month = 6; break;
					case monthString.includes('AUG') : month = 7; break;
					case monthString.includes('SEP') : month = 8; break;
					case monthString.includes('OCT') : month = 9; break;
					case monthString.includes('NOV') : month = 10; break;
					case monthString.includes('DEC') : month = 11; break;
				}
			}
			else {
				// Subtract one due to months in JS spanning 0-11 not 1-12.
				month = args[0] - 1;
			}
		}

		if (args.length == 2) {
			year = args[1];
		}

		const numberOfDaysInMonth = calendarHandler.daysInMonth(month, year);
		console.log('month: ', month, ' year: ', year, ' monthLength: ', numberOfDaysInMonth);

		const baseCalendarLength = 28;
		const maxCalendarWidth = 7;

		calendarHandler.getEventData(month, year);

		const calendar = calendarHandler.dateTemplate(maxCalendarWidth, numberOfDaysInMonth, baseCalendarLength);

		message.channel.send('```' + calendar + '```');

		/*
			```
			_________________________________________________________
			|       |       |       |       |       |       |       |
			|       |       |       |       |       |       |       |
			|_______|_______|_______|_______|_______|_______|_______|
			|       |       |       |       |       |       |       |
			|       |       |       |       |       |       |       |
			|_______|_______|_______|_______|_______|_______|_______|
			|       |       |       |       |       |       |       |
			|       |       |       |       |       |       |       |
			|_______|_______|_______|_______|_______|_______|_______|
			|       |       |       |       |       |       |       |
			|       |       |       |       |       |       |       |
			|_______|_______|_______|_______|_______|_______|_______|
			|       |       |       |
			|       |       |       |
			|_______|_______|_______|
			```
		*/
	},
};
