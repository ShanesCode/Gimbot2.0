const sqlite3 = require('sqlite3').verbose();

let events = [];

const verticalChar = '|';
const dateFloor = '|_______';
const cellWidth = 7;
const calendarCeiling = '________';

const dateRow = verticalChar + dateSpacing(cellWidth);

let month = 0;
let year = 0;

function constructRow(type, firstDateInRow, firstDateInNextRow) {
    let cellWidthReduc = 0;
    let dateNumber = firstDateInRow;
    let constructRowString = '';
    for (dateNumber; dateNumber < firstDateInNextRow; dateNumber++) {
        if (type == 'dateNumberRow') {
            cellWidthReduc = dateNumber.toString().length;
            constructRowString += verticalChar + dateNumber.toString() + dateSpacing(cellWidth - cellWidthReduc);
        }
        else if (type == 'dateEventRow') {
            constructRowString += verticalChar + populateCalendar(dateNumber);
        }
    }
    return constructRowString;
}

function dateSpacing(numberOfSpaces) {
    const spaceChar = ' ';
    return spaceChar.repeat(numberOfSpaces);
}

function baseCalendarRow(firstDateInRow, firstDateInNextRow, calendarWidth) {
            return constructRow('dateNumberRow', firstDateInRow, firstDateInNextRow)
            + '\n' + constructRow('dateEventRow', firstDateInRow, firstDateInNextRow) + '\n' + dateFloor.repeat(calendarWidth) + '\n';
}

function extraDatesRow(firstDateInRow, firstDateInNextRow, extraDates) {
            return constructRow('dateNumberRow', firstDateInRow, firstDateInNextRow)
            + '\n' + constructRow('dateEventRow', firstDateInRow, firstDateInNextRow) + '\n' + dateFloor.repeat(extraDates) + '\n';
}

function populateCalendar(date) {
    console.log('date: ', date);
    let eventString = dateSpacing(cellWidth);
    for(let i = 0; i < events.length; i++) {
        if (events[i].eventDate == date) {
            const title = events[i].eventTitle.split(' ')[0];
            console.log('Event:', title, 'is being held on day:', date);

            if (title.length == cellWidth) {
                eventString = title;
            }
            else if (title.length > cellWidth) {
                eventString = title.slice(0, 7);
            }
            else {
                const fillerLength = (cellWidth - title.length);
                const filler = ' ';
                eventString = title + filler.repeat(fillerLength);
            }
        }
    }

    return eventString;
}

module.exports = {
    getMonthAndYear: (argMonth, argYear) => {
        month = argMonth, year = argYear;
        return;
    },
    daysInMonth: () => {
        return new Date(year, month + 1, 0).getDate();
    },
    calendarBuilder: (calendarWidth, numberOfDaysInMonth, baseCalendarLength) => {

        const baseCalendarCeiling = calendarCeiling.repeat(calendarWidth) + '\n';

        const extraDates = numberOfDaysInMonth - baseCalendarLength;

        const firstDateInRow1 = 1;
        const firstDateInRow2 = 1 + calendarWidth;
        const firstDateInRow3 = 1 + 2 * calendarWidth;
        const firstDateInRow4 = 1 + 3 * calendarWidth;
        const firstDateInRow5 = 1 + 4 * calendarWidth;

        return  baseCalendarCeiling
            + baseCalendarRow(firstDateInRow1, firstDateInRow2, calendarWidth, dateRow)
            + baseCalendarRow(firstDateInRow2, firstDateInRow3, calendarWidth, dateRow)
            + baseCalendarRow(firstDateInRow3, firstDateInRow4, calendarWidth, dateRow)
            + baseCalendarRow(firstDateInRow4, firstDateInRow5, calendarWidth, dateRow)
            + extraDatesRow(firstDateInRow5, numberOfDaysInMonth + 1, extraDates);
    },
    getEventData: () => {
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
                console.log('rows: ', rows);

                rows.forEach((row) => {
                    const eventExactDate = new Date(parseFloat(row.Date));
                    const eventDate = eventExactDate.getDate();
                    const eventTitle = row.Title;
                    console.log('eventTitle: ', eventTitle, 'eventDate: ', eventDate);
                    events.push({ eventTitle, eventDate });
                });

                return console.log('events1: ', events);

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
    clearEvents: () => {
        return events = [];
    },
};