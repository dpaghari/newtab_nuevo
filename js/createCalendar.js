// Calendar
let d = new Date();
let month_name = ['January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December'];

let month = d.getMonth(); // 0 - 11
let year = d.getFullYear(); // 2016
let today = d.getDate(); // 23

// January 1 2016
let first_date = month_name[month] + " " + 1 + " " + year;



// Sun January 1 2016
let tmp = new Date(first_date).toDateString();
// Sun
let first_day = tmp.substring(0, 3);
let day_name = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
// [0]
let day_no = day_name.indexOf(first_day);
let days = new Date(year, month+1, 0).getDate();
let table = document.createElement("table");
let theCalendar;

let tr = document.createElement("tr");
function buildCalendar() {

// Row for day labels
for(var c = 0; c < 7; c++) {
  var td = document.createElement("td");
  var daysOfTheWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  td.innerHTML = daysOfTheWeek[c];
  tr.appendChild(td);
}
table.appendChild(tr);

// Row for blank spaces
tr = document.createElement("tr");
for(c = 0;c < 7; c++) {
  if(c === day_no) {
    break;
  }
  var td = document.createElement("td");
  td.innerHTML = "";
  tr.appendChild(td);
}

// Start counting days of the month
var count = 1;
console.log(c);
for(; c < 7; c++) {
  var td = document.createElement("td");

  td.innerHTML = "<span>" + count + "</span>";
  console.log(count, today);
  if(count === today){
    td.classList.add("currentDay");
  }

  count++;
  tr.appendChild(td);
}
table.appendChild(tr);

// rest of the date rows
for(var r = 2; r < 7; r++) {

  tr = document.createElement("tr");
  for(c = 0; c <  7;c++) {
    if(count > days) {
      table.appendChild(tr);
      return table;
      //console.log("theCalendar: " + theCalendar);
    }
    var td = document.createElement("td");
    td.innerHTML = "<span>" + count + "</span>";
    if(count === today){
      td.classList.add("currentDay");
    }
    count++;
    tr.appendChild(td);
  }
  table.appendChild(tr);
}
}

theCalendar = buildCalendar();
module.exports = {
  theCalendar,
  month_name,
  month,
  year
};
