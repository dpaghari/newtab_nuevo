const API_KEY = "6b167297f22448a42863aa5276d11f30";
const API_ENDPOINT = "https://api.openweathermap.org/data/2.5";
const UNITS = "imperial";

exports.getWeather = (location) => {
  const endpoint = API_ENDPOINT + `/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=${UNITS}`;
  return $.ajax({
    url: endpoint,
    method: "GET"
  });
};


exports.getIconUrl = (iconCode) => {
  
  var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  return iconUrl;

};

