'use strict';

// Calendar
var d = new Date();
var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var month = d.getMonth(); // 0 - 11
var year = d.getFullYear(); // 2016
var today = d.getDate();
var first_date = month_name[month] + " " + 1 + " " + year;
var tmp = new Date(first_date).toDateString();
var first_day = tmp.substring(0, 3);
var day_name = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
var day_no = day_name.indexOf(first_day);
var days = new Date(year, month + 1, 0).getDate();
var table = document.createElement("table");
var tr = document.createElement("tr");

var buildCalendar = function buildCalendar() {

  var tr = document.createElement("tr");
  // Row for day letters
  for (var c = 0; c <= 6; c++) {
    var td = document.createElement("td");
    var daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    td.innerHTML = daysOfTheWeek[c];
    tr.appendChild(td);
  }
  table.appendChild(tr);

  // Row for blank spaces
  tr = document.createElement("tr");
  for (c = 0; c <= 6; c++) {
    if (c === day_no) {
      break;
    }
    var td = document.createElement("td");
    td.innerHTML = "";
    tr.appendChild(td);
  }

  // Start counting days of the month
  var count = 1;
  for (; c <= 6; c++) {
    // console.log(c);
    var td = document.createElement("td");

    td.innerHTML = "<span>" + count + "</span>";
    //console.log(count, today);
    if (count === today) {
      td.classList.add("currentDay");
    }

    count++;
    tr.appendChild(td);
  }
  table.appendChild(tr);

  // rest of the date rows
  for (var r = 3; r <= 6; r++) {
    tr = document.createElement("tr");
    for (var c = 0; c <= 6; c++) {
      if (count > days) {
        table.appendChild(tr);
        return table;
      }
      var td = document.createElement("td");
      td.innerHTML = "<span>" + count + "</span>";
      if (count === today) {
        td.classList.add("currentDay");
      }
      count++;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};

//var calendar = buildCalendar();
module.exports = {
  buildCalendar: buildCalendar,
  month_name: month_name,
  month: month,
  year: year
};