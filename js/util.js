// const $ = require("jquery");
module.exports = {
  getCookie,
  compareLists,
  getPromise,
  getCurrentTime,
  getParameterByName,
  getBrowser,
  getBrowserSetting,
  setBrowserSetting,
  jsonp,
  validateURL,
  addHttp
};

// Check if two lists are equal
function compareLists(list1, list2) {
  // If they aren't the same length
  if(list1.length !== list2.length) return false;
  for (var i = 0; i < list1.length; i++) {
    if(list2.indexOf(list1[i]) === -1) return false;
  }
  return true;
}
// Returns a promise object
function getPromise(data) {
  return $.ajax(data);
}

// Returns the current time as a string like "5:30 pm"
function getCurrentTime() {
  var currentTime = new Date().toLocaleTimeString(navigator.language, { hour : '2-digit', minute: '2-digit'} );
  return currentTime.toLowerCase();
}

// Uses chrome api to retrieve cookie name and value
function getCookie(cookieInfo = { domain: "", name: ""}) {

  if(cookieInfo.domain === "" && cookieInfo.name === "") return;

  var p = new Promise((resolve, reject) => {
    // Gets Cookies
    if(getBrowser() === "chrome"){
      chrome.cookies.getAll(cookieInfo, function(res) {
        // If cookie exists pass value into exists callback
        if(res.length > 0 && typeof res[0].value !== 'undefined'){
          var catFromCookie = JSON.stringify([res[0].value]);
          resolve(catFromCookie);
          // if(typeof exists === "function") exists(catFromCookie);
        }
        // If it doesn't call absent() callback
        else {
          resolve("");
          // if(typeof absent === "function") absent();
        }
      });
    }
    // Requires to be on same domain
    else {
      var name = cookieInfo.name + "=";
      var ca = document.cookie.split(';');
      var val;
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            val = c.substring(name.length, c.length);
            resolve(val);
        }
      }
      val = "";
      resolve(val);
    }
  });

  return p;

}

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  if(match !== null) {
    if(typeof match[1] !== "undefined")
      return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
}

function getBrowser() {
    var ua = window.navigator.userAgent || "";
    if (ua.indexOf("Chrome") > -1) {
        if (ua.indexOf("Edge") == -1) {
            return "chrome";
        } else {
            return "other";
        }
    } else if (ua.indexOf("Firefox") > -1) {
        return "firefox";
    } else if (ua.indexOf("MSIE 8.0") > -1) {

        return "ie8";
    } else {

        // Any other browser logic
        return "other";
    }
}

function setBrowserSetting(name, value) {
  var browser = getBrowser();
  var background, NTInstance;
  if(browser === "chrome" && typeof chrome.extension.getBackgroundPage() !== "undefined"){
    background = chrome.extension.getBackgroundPage();
    if(typeof background.NTInstance !== "undefined"){
      NTInstance = background.NTInstance;
      NTInstance.setSetting(name, value);
      console.log(`set setting ${name} to value: ${value}`);
    }
  }
  else {
    localStorage.setItem(name, value);
  }
}
function getBrowserSetting(name, defValue) {
  var background, NTInstance;
  var browser = getBrowser();
  var settingVal;
  if(browser === "chrome" && typeof chrome.extension.getBackgroundPage() !== "undefined"){
    background = chrome.extension.getBackgroundPage();

    if(typeof background.NTInstance !== "undefined"){
      NTInstance = background.NTInstance;
      settingVal = NTInstance.getSetting(name, defValue);

    }
  }
  else {
    settingVal = localStorage.getItem(name);
    if(settingVal === null) settingVal = defValue;
  }
  return settingVal;
}

function jsonp(url, callback) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
      delete window[callbackName];
      document.head.removeChild(script);
      callback(data);
  };

  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.head.appendChild(script);
}

function validateURL (url) {
  if(url.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \&\.\-]*)*\/?/) === null){
    return false;
  }
  else return true;
}

function addHttp (url) {
  var newUrl;
  if(url.match(/^(https?:\/\/)/) === null){
    var addHttp = "http://";
    newUrl = addHttp.concat(url);
    return newUrl;
  }
  return url;
};
