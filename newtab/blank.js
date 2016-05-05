var loadedFavorites = [];
chrome.runtime.sendMessage({task: "checkFirstRun"}, function(res) {
  console.log('checkfirstrun: ',res);
});
$(document).ready(function() {
  loadSavedFavorites();

  // Refresh time every second
  setInterval(function(e){
    currentTime = new Date().toLocaleTimeString(navigator.language, { hour : '2-digit', minute: '2-digit'} );
    $('#time').html(currentTime);
  }, 1000);
  var currentTime = new Date().toLocaleTimeString(navigator.language, { hour : '2-digit', minute: '2-digit'} );
  $('#time').html(currentTime);
  var currentDate = new Date().toDateString();
  $('#date').html(currentDate);

  $(document).on("click", ".addFavorite", function(e){
    e.preventDefault();
    triggerFavoriteModal();
    loadPopularFavorites();
  });
  $(document).on("click", "#closeBtn", function(e){
    e.preventDefault();
    closeModal();
  });
  $(document).on("click", ".popFav", function(e){
    e.preventDefault();
    var selection = $(this)[0];
    console.log(selection);
    var urltoAdd = selection.dataset.url;
    var imgtoAdd = selection.dataset.imgurl;
    var newEntry = {
      "url" : urltoAdd,
      "imgUrl" : imgtoAdd
    };
    saveFavorite(newEntry);
    $(this).remove();
  });
  $(document).on("click", ".addBtn", function(e){
    e.preventDefault();
    var urlVal = $("#inputUrl").val();
    var imageVal = $("#inputImage").val();
    var newFavorites = [];
    var newEntry = {
      "url" : urlVal,
      "imgUrl" : imageVal
    };
    saveFavorite(newEntry);
    closeModal();
  });


});


// Load saved favorites onload
function loadSavedFavorites() {
  var savedItems = [];
  chrome.storage.local.get("savedFavorites", function(res) {
    if(typeof res.savedFavorites !== "undefined"){
    savedItems = res.savedFavorites;
    savedItems.forEach(function(item, index) {
      addFavorite(item.url, item.imgUrl);
    });
    }
  });
}

function loadPopularFavorites() {
  var popFavs = getPopularFavorites();
  popFavs.then(function(res) {
    createPopularFavs(JSON.parse(res));
  });
}

function createPopularFavs(favorites) {
  var list = favorites.popular_favorites;
  for(var i = 0; i < list.length; i++){
    var favHTML = "<a href='#' class='popFav' data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg +">" + list[i].title + "</a>";
    $(".popularFavs").append(favHTML);
  }
  loadedFavorites = favorites.popular_favorites;
  // console.log(list);
}



// Prompt user for first run settings
function firstRun() {

}

// Prompt user for image to use for bookmark
// and also the url.  Append to favorites
function triggerFavoriteModal() {
  $('.lightbox').fadeIn();
  $('.addModal').fadeIn();
}

function closeModal() {
  $('.lightbox').fadeOut();
  $('.addModal').fadeOut();
}
// Add a new favorite to the favorites grid
function addFavorite(url, imageUrl) {
  var newFavorite = document.createElement("A");
  newFavorite.href = url;
  newFavorite.style.backgroundImage = "url(" + imageUrl + ")";
  newFavorite.style.backgroundSize = "cover";
  newFavorite.style.backgroundPosition = "center center";
  newFavorite.style.backgroundRepeat = "no-repeat";
  $("#favorites").append(newFavorite);
}

// Save favorite to local storage
function saveFavorite(entry) {
  chrome.storage.local.get("savedFavorites", function (res) {
    var currentSaved = [];
    if(typeof res.savedFavorites !== "undefined"){
      currentSaved = res.savedFavorites;
    }
    currentSaved.push(entry);
    chrome.storage.local.set({"savedFavorites" : currentSaved });
    addFavorite(entry.url, entry.imgUrl);
    $("#inputUrl").val("");
    $("#inputImage").val("");
  });
}


function getPopularFavorites() {
  return $.ajax({
    url: "./popularFavs.json",
    method: "GET"
  });
}
