"use strict";

var getPromise = function getPromise(url) {
  return $.ajax({
    url: url,
    method: "GET"
  });
};

var validateURL = function validateURL(url) {
  // var regex = "";
  // console.log(typeof regex, url.match(regex));
  if (url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/) === null) {
    return false;
  } else return true;
};

var addHttp = function addHttp(url) {
  var newUrl;
  if (url.match(/^(https?:\/\/)/) === null) {
    var addHttp = "http://";
    newUrl = addHttp.concat(url);
    return newUrl;
  }

  return url;
};

module.exports = {
  getPromise: getPromise,
  validateURL: validateURL,
  addHttp: addHttp
};