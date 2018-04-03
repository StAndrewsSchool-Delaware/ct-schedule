var ics = require('ics');
var fs = require('fs');

// set dates
var startDate = new Date(2018, 8, 4);
var currentDate = new Date(startDate);
var endDate = new Date(2019, 4, 23);
// list of no class days
var noClass = [];
var classesPerDay = 4;
var classCount = 0; // "nth" class of the year (current class)
var classStartingTimes = [
	{ hour: 9, minute: 0 },
	{ hour: 10, minute: 15 },
	{ hour: 13, minute: 0 },
	{ hour: 14, minute: 15 }
];

// user's classes
var classes = ['Compsci', 'Physics', 'Free', 'Math', 'Bio', 'Econ'];

// initialize 'events' array; will be filled in the following loop with all schedules classes
var events = [];

while (currentDate <= endDate) {

	if (isWeekend(currentDate)) {
		currentDate.setDate(dayAfter(currentDate));
		continue;
	}
	else if (noSchool(currentDate)) {
		noClass.splice(0,1);
		currentDate.setDate(dayAfter(currentDate));
		continue;
	}

	for (var i = 0; i < classesPerDay; i++) {
		var className = classes[classCount % classes.length];
		var classTime = {hour: classStartingTimes[i].hour,
						 minute: classStartingTimes[i].minute};

		events.push({
			title: className,
			start: [currentDate.getFullYear(),
					currentDate.getMonth()+1,
					currentDate.getDate(),
					classTime.hour,
					classTime.minute],
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



// function definitions

function dayAfter (date) {
	return date.getDate()+1;
}

function isWeekend (date) {
	return date.getDay() == 0 || date.getDay() == 6;
}

function noSchool (date) {
	return noClass.length != 0 && date == noClass[0];
}