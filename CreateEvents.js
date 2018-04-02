var ics = require('ics');
var fs = require('fs');

// I changed this file!!!

// set dates
var startDate = new Date(2018, 8, 4);
var currentDate = new Date(startDate);
var endDate = new Date(2019, 4, 23);
// list of no class days
var noClass = []

var classesPerDay = 4;
var classCount = 0; // "nth" class of the year (current class)
var classStartingTimes = [
	{ hour: 9, minute: 0 },
	{ hour: 10, minute: 15 },
	{ hour: 13, minute: 0 },
	{ hour: 14, minute: 15 }
];

// user's classes (should be a length of 7 in real life)
var classes = ['Compsci', 'Physics', 'Free', 'Math', 'Bio', 'Econ'];

var isWeekend = function(date) {
	if (date.getDay() == 0 || date.getDay() == 6) {
		return true;
	}
	return false;
}
var dayAfter = function(date) {
	return date.getDate()+1;
}

// initialize 'events' array; will be filled in the following loop
var events = [];

while (currentDate < endDate) {

	if (isWeekend(currentDate)) {
		currentDate.setDate(dayAfter(currentDate));
		continue;
	}
	else if (noClass.length != 0 && currentDate == noClass[0]) {
		noClass.splice(0,1);
		currentDate.setDate(dayAfter(currentDate));
		continue;
	}

	for (var i = 0; i < classesPerDay; i++) {
		var className = classes[classCount % classes.length];
		events.push({
			title: className,
			start: [currentDate.getFullYear(),
					currentDate.getMonth()+1,
					currentDate.getDate(),
					classStartingTimes[i].hour,
					classStartingTimes[i].minute],
		    duration: {hours: 1}
		});

		classCount++;
	}

	currentDate.setDate(dayAfter(currentDate));
}

// create the events
var response = ics.createEvents(events);

// write the ics file
if (response.error) {
	console.log(response.error);
} else {
	fs.writeFileSync('./events.ics', response.value);
}