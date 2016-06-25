// Calendar
let d = new Date();
let month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let month = d.getMonth(); // 0 - 11
let year = d.getFullYear(); // 2016
let today = d.getDate();
let first_date = month_name[month] + " " + 1 + " " + year;
let tmp = new Date(first_date).toDateString();
let first_day = tmp.substring(0, 3);
let day_name = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
let day_no = day_name.indexOf(first_day);
let days = new Date(year, month+1, 0).getDate();
let table = document.createElement("table");
let tr = document.createElement("tr");

let buildCalendar = function () {

var tr = document.createElement("tr");
// Row for day letters
for(var c = 0; c <= 6; c++) {
  var td = document.createElement("td");
  var daysOfTheWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  td.innerHTML = daysOfTheWeek[c];
  tr.appendChild(td);
}
table.appendChild(tr);

// Row for blank spaces
tr = document.createElement("tr");
for(c = 0;c <= 6; c++) {
  if(c === day_no) {
    break;
  }
  var td = document.createElement("td");
  td.innerHTML = "";
  tr.appendChild(td);
}

// Start counting days of the month
var count = 1;
for(; c <=6; c++) {
  // console.log(c);
  var td = document.createElement("td");

  td.innerHTML = "<span>" + count + "</span>";
  //console.log(count, today);
  if(count === today){
    td.classList.add("currentDay");
  }

  count++;
  tr.appendChild(td);
}
table.appendChild(tr);

// rest of the date rows
for(var r=3; r<= 6; r++) {
  tr = document.createElement("tr");
  for(var c = 0; c <= 6;c++) {
    if(count > days) {
      table.appendChild(tr);
      return table;
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

//var calendar = buildCalendar();
module.exports = {
  buildCalendar,
  month_name,
  month,
  year
};
