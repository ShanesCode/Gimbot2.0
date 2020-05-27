const sqlite3 = require('sqlite3').verbose();

function dateNumberRow(firstDateInRow, firstDateInNextRow, verticalChar, cellWidth) {
    const dateArray = [];
    let cellWidthReduc = 0;
    let dateNumber = firstDateInRow;
    let dateNumberRowString = '';
    for (dateNumber; dateNumber < firstDateInNextRow; dateNumber++) {
        dateArray.push(dateNumber);

        cellWidthReduc = dateNumber.toString().length;
        dateNumberRowString += verticalChar + dateNumber.toString() + dateSpacing(cellWidth - cellWidthReduc);
    }
    return dateNumberRowString;
}

function dateSpacing(numberOfSpaces) {
    const spaceChar = ' ';
    return spaceChar.repeat(numberOfSpaces);
}

function baseCalendarRow(firstDateInRow, firstDateInNextRow, verticalChar, cellWidth, calendarWidth, dateRow, dateFloor) {
            return dateNumberRow(firstDateInRow, firstDateInNextRow, verticalChar, cellWidth)
            + '\n' + dateRow.repeat(calendarWidth) + '\n' + dateFloor.repeat(calendarWidth) + '\n';
}

function extraDatesRow(firstDateInRow, firstDateInNextRow, verticalChar, cellWidth, dateFloor, extraDates, dateEventsPlaceholder) {
            return dateNumberRow(firstDateInRow, firstDateInNextRow, verticalChar, cellWidth)
            + '\n' + dateEventsPlaceholder.repeat(extraDates) + '\n' + dateFloor.repeat(extraDates) + '\n';
}

function populateCalendar() {
    
}

module.exports = {
    daysInMonth: (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    },
    dateTemplate: (calendarWidth, numberOfDaysInMonth, baseCalendarLength) => {
        const verticalChar = '|';
        const dateFloor = '|_______';
        const cellWidth = 7;
		const calendarCeiling = '________';

        const dateRow = verticalChar + dateSpacing(cellWidth);
        const extraDates = numberOfDaysInMonth - baseCalendarLength;
        const dateEventsPlaceholder = dateRow;

        const baseCalendarCeiling = calendarCeiling.repeat(calendarWidth) + '\n';

        const firstDateInRow1 = 1;
        const firstDateInRow2 = 1 + calendarWidth;
        const firstDateInRow3 = 1 + 2 * calendarWidth;
        const firstDateInRow4 = 1 + 3 * calendarWidth;
        const firstDateInRow5 = 1 + 4 * calendarWidth;

        return  baseCalendarCeiling
            + baseCalendarRow(firstDateInRow1, firstDateInRow2, verticalChar, cellWidth, calendarWidth, dateRow, dateFloor)
            + baseCalendarRow(firstDateInRow2, firstDateInRow3, verticalChar, cellWidth, calendarWidth, dateRow, dateFloor)
            + baseCalendarRow(firstDateInRow3, firstDateInRow4, verticalChar, cellWidth, calendarWidth, dateRow, dateFloor)
            + baseCalendarRow(firstDateInRow4, firstDateInRow5, verticalChar, cellWidth, calendarWidth, dateRow, dateFloor)
            + extraDatesRow(firstDateInRow5, numberOfDaysInMonth + 1, verticalChar, cellWidth, dateFloor, extraDates, dateEventsPlaceholder);
    },

    getEventData: (month, year) => {
        const events = [];
        const startOfMonth = new Date(year, month, 1).getTime();
        const endOfMonth = new Date(year, month + 1, 0).getTime();

        const db = new sqlite3.Database('./db/events.db', (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
        });

        db.all('SELECT * FROM events WHERE Date BETWEEN ? AND ? ORDER BY DATE asc', [startOfMonth, endOfMonth], (err, rows) => {
            if (err) {
                return console.log(err.message);
            }
            else if (rows) {

                rows.forEach((row) => {
                    const eventExactDate = new Date(parseFloat(row.Date));
                    const eventDate = eventExactDate.getDate();
                    const eventTitle = row.Title;
                    events.push({ eventTitle, eventDate });
                });

                return events;

            }
            else {
                console.log('No events this month');
            }
        });

        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    },
};