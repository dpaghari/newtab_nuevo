const Util = require("./util.js");
const ActionsManager = require("./actions.js");
// const $ = require("jquery");
// let NTInstance;
// let init = function(NT) {
//   NTInstance = NT;
// };
// Add a new favorite to the favorites grid
function addFavorite (title, url, imageUrl, NTInstance) {
    var newListEntry = document.createElement("LI");
    var newFavorite = document.createElement("A");
    newFavorite.href = url;
    // console.log(imageExists(imageUrl));
    $.get(imageUrl)
      .done(function() {
        newFavorite.style.backgroundImage = "url(" + imageUrl + ")";
      }).fail(function() {
        newFavorite.style.backgroundImage = "url('/newtab/images/placeholder.png')";
    });
    newFavorite.style.backgroundSize = "cover";
    newFavorite.style.backgroundPosition = "center center";
    newFavorite.style.backgroundRepeat = "no-repeat";
    newFavorite.classList.add("favorite", NTInstance.currentSettings.hover);
    newFavorite.dataset.title = title;
    newFavorite.dataset.bgImg = imageUrl;
    var optDel = document.createElement("I");
    optDel.classList.add("fa", "fa-trash-o", "fa-lg", "fa-fw", "optDel");
    // var optEdit = document.createElement("I");
    // optEdit.classList.add("fa", "fa-pencil", "fa-lg", "fa-fw", "optEdit");
    newFavorite.appendChild(optDel);
    // newFavorite.appendChild(optEdit);
    newListEntry.appendChild(newFavorite);
    $("#favorites").append(newListEntry);
    let savedFaveSize = NTInstance.getSetting("userFaveSize", "60");
    ActionsManager.setSize(savedFaveSize, NTInstance);
    $(".favorite").children().hide();
}


  // Save favorite to local storage
function saveFavorite(entry, NTInstance) {
    var currentSaved = [];
    var savedFavorites = NTInstance.getSetting("savedFavorites", null);
    if(savedFavorites !== null){
      currentSaved = savedFavorites;
    }
    currentSaved.push(entry);
    NTInstance.setSetting("savedFavorites" , currentSaved);
    addFavorite(entry.title, entry.url, entry.bgImg, NTInstance);
    $("#inputUrl").val("");
    $("#inputImage").val("");
  }

function getPopularFavorites () {
    return $.ajax({
      url: "./popularFavs.json",
      method: "GET"
    });
}

function deleteFavorite (delUrl, NTInstance) {
    var savedFavorites = NTInstance.getSetting("savedFavorites", null);
    if(savedFavorites !== null){
    let filteredFavorites = savedFavorites.filter((item) => {
      if(item.url !== delUrl) return true;
    });
    NTInstance.setSetting("savedFavorites", filteredFavorites);
    }
}

  // Load saved favorites onload
function loadSavedFavorites(NTInstance) {
    var savedItems = [];
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);
      if(savedFavorites !== null){
      savedItems = savedFavorites;
      savedItems.forEach(function(item) {
        addFavorite(item.title, item.url, item.bgImg, NTInstance);
      });
      }
}

function loadPopularFavorites (NTInstance) {
    var popFavs = getPopularFavorites();
    popFavs.then(function(res) {
      var response = JSON.parse(res);
      createPopularFavs(response, NTInstance);
    });
}
function loadDefaultFavorites (NTInstance) {
    var popFavs = Util.getPromise("/newtab/defaultFavs.json");
    popFavs.then(function(res) {
      var response = JSON.parse(res);
      createDefaultFavs(response, NTInstance);
    });
}

function createDefaultFavs (favorites, NTInstance) {
    var list = favorites.default_favorites;

    for(var i = 0; i < list.length; i++){
      var entry = {
        "title" : list[i].title,
        "url" : list[i].url,
        "bgImg" : list[i].bgImg,
      };
      saveFavorite(entry, NTInstance);
    }
}

function createPopularFavs (favorites, NTInstance) {

    var list = favorites.popular_favorites;
    var savedFavorites = NTInstance.getSetting("savedFavorites", null);

    var match = [];

    for(var i = 0; i < list.length; i++){
      if(savedFavorites !== null){
        match = savedFavorites.filter((el) => {
          return el.url === list[i].url;
        });
      }

      if(match.length === 0){
        var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg +">" + list[i].title + "</a>";
        $(".popularFavs").append(favHTML);
      }
    }
}

module.exports = {
  addFavorite,
  saveFavorite,
  getPopularFavorites,
  deleteFavorite,
  loadSavedFavorites,
  loadPopularFavorites,
  loadDefaultFavorites,
  createDefaultFavs,
  createPopularFavs
};
