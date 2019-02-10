exports.getQuoteOfTheDay = () => {
  return $.ajax({
    method: "GET",
    url: "http://quotes.rest/qod.json"
  });
}