let date = new Date(), // Tue Jul 26 2016 12:50:16 GMT-0700 (Pacific Daylight Time)
month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
month = date.getMonth(), // [0-11]
year = date.getFullYear(), // [2016]
today = date.getDate(),  // 26
first_date = month_names[month] + " " + 1 + " " + year,  // first of the month
temp = new Date(first_date).toDateString(),   // Fri Jan 01 2016
first_day = tmp.substring(0,3),  // Fri
day_names = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"],
day_num = day_names.indexOf(first_day),     // current day name
days = new Date(year, month + 1, 0).getDate(), // number of days in a month

table = document.createElement("table"),
table_row = document.createElement("tr");

let theCalendar;

let buildCalendar = function() {

  let tr = document.createElement("tr");


};
