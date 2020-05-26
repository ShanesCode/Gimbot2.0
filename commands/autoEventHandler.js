const sqlite3 = require('sqlite3').verbose();

module.exports = {
    addToEvent: (nameOfUser, eventID) => {
        console.log('adding ', nameOfUser, ' to event ', eventID);
        let currentAttendees = 'None';
        let eventTitle = '';
        let eventExactDate = new Date();
        let eventDate = '';

        const db = new sqlite3.Database('./db/events.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
            });

        db.get('SELECT * FROM events WHERE ID = ?', [eventID], (err, rows) => {
            if (err) {
                return console.log(err.message);
            }
            else {
                currentAttendees = rows.Attendees;
                if (currentAttendees == 'None') {
                    currentAttendees = nameOfUser;
                }
                else {
                    currentAttendees = currentAttendees.concat(', ', nameOfUser);
                }
                console.log('currentAttendees: ', currentAttendees);
                eventTitle = rows.Title;
                eventExactDate = new Date(parseFloat(rows.Date));
                eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();

                db.run('UPDATE events SET Attendees = ? WHERE ID = ?', [currentAttendees, eventID], (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    else {
                        console.log(nameOfUser + ' is going to ' + eventTitle + ' on ' + eventDate);
                    }
                });
            }
        });

        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    },

    removeFromEvent: (nameOfUser, eventID) => {
        console.log('removing ', nameOfUser, ' from event ', eventID);
        let currentAttendees = '';
        let eventTitle = '';
        let eventExactDate = new Date();
        let eventDate = '';

        const db = new sqlite3.Database('./db/events.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to the events SQlite database.');
            });

        db.get('SELECT * FROM events WHERE ID = ?', [eventID], (err, rows) => {
            if (err) {
                return console.log(err.message);
            }
            else {
                currentAttendees = rows.Attendees;
                if (currentAttendees.includes(`, ${nameOfUser}, `)) {
                    currentAttendees = currentAttendees.replace(`, ${nameOfUser}, `, ', ');
                    console.log(1);
                }
                else if (currentAttendees.includes(`, ${nameOfUser}`)) {
                    currentAttendees = currentAttendees.replace(`, ${nameOfUser}`, '');
                    console.log(2);
                }
                else if (currentAttendees.includes(`${nameOfUser}, `)) {
                    currentAttendees = currentAttendees.replace(`${nameOfUser}, `, '');
                    console.log(3);
                }
                else if (currentAttendees.includes(nameOfUser)) {
                    currentAttendees = currentAttendees.replace(nameOfUser, 'None');
                    console.log(4);
                }
                else {
                    console.log(`${nameOfUser} is not listed as attending this event.`);
                    return;
                }
                console.log('currentAttendees: ', currentAttendees);
                eventTitle = rows.Title;
                eventExactDate = new Date(parseFloat(rows.Date));
                eventDate = eventExactDate.getDate() + '/' + (eventExactDate.getMonth() + 1) + '/' + eventExactDate.getFullYear();

                db.run('UPDATE events SET Attendees = ? WHERE ID = ?', [currentAttendees, eventID], (err) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    else {
                        console.log(nameOfUser + ' is no longer going to ' + eventTitle + ' on ' + eventDate);
                    }
                });
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