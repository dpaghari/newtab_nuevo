let getPromise = function(url) {
  return $.ajax({
    url: url,
    method: "GET"
  });
};

let validateURL = function (url) {
  // var regex = "";
  // console.log(typeof regex, url.match(regex));
  if(url.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \&\.\-]*)*\/?/) === null){
    return false;
  }
  else return true;
};

let addHttp = function (url) {
  var newUrl;
  if(url.match(/^(https?:\/\/)/) === null){
    var addHttp = "http://";
    newUrl = addHttp.concat(url);
    return newUrl;
  }

  return url;
};

module.exports = {
  getPromise,
  validateURL,
  addHttp
};
