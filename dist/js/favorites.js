"use strict";

var NTInstance = void 0;
var init = function init(NT) {
  NTInstance = NT;
};
// Add a new favorite to the favorites grid
var addFavorite = function addFavorite(title, url, imageUrl) {
  var newListEntry = document.createElement("LI");
  var newFavorite = document.createElement("A");
  newFavorite.href = url;
  // console.log(imageExists(imageUrl));
  $.get(imageUrl).done(function () {
    newFavorite.style.backgroundImage = "url(" + imageUrl + ")";
  }).fail(function () {
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
  $(".favorite").children().hide();
};

// Save favorite to local storage
var saveFavorite = function saveFavorite(entry) {
  var currentSaved = [];
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if (savedFavorites !== null) {
    currentSaved = savedFavorites;
  }
  currentSaved.push(entry);
  NTInstance.setSetting("savedFavorites", currentSaved);
  addFavorite(entry.title, entry.url, entry.bgImg);
  $("#inputUrl").val("");
  $("#inputImage").val("");
};

var getPopularFavorites = function getPopularFavorites() {
  return $.ajax({
    url: "./popularFavs.json",
    method: "GET"
  });
};

var deleteFavorite = function deleteFavorite(delUrl) {
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if (savedFavorites !== null) {
    savedFavorites.forEach(function (item, index) {
      if (item.url === delUrl) {
        savedFavorites.splice(index, 1);
      }
    });
    NTInstance.setSetting("savedFavorites", savedFavorites);
  }
};

// Load saved favorites onload
var loadSavedFavorites = function loadSavedFavorites() {
  var savedItems = [];
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if (savedFavorites !== null) {
    savedItems = savedFavorites;
    savedItems.forEach(function (item) {
      addFavorite(item.title, item.url, item.bgImg);
    });
  }
};

var loadPopularFavorites = function loadPopularFavorites() {
  var popFavs = getPopularFavorites();
  popFavs.then(function (res) {
    var response = JSON.parse(res);
    createPopularFavs(response);
  });
};
var loadDefaultFavorites = function loadDefaultFavorites() {
  var popFavs = getPromise("/newtab/defaultFavs.json");
  popFavs.then(function (res) {
    var response = JSON.parse(res);
    createDefaultFavs(response);
  });
};

var createDefaultFavs = function createDefaultFavs(favorites) {
  var list = favorites.default_favorites;
  // console.log(list);
  for (var i = 0; i < list.length; i++) {
    var entry = {
      "title": list[i].title,
      "url": list[i].url,
      "bgImg": list[i].bgImg
    };
    // console.log(entry);
    saveFavorite(entry);
  }
};

var createPopularFavs = function createPopularFavs(favorites) {
  console.log(NTInstance, favorites);
  var list = favorites.popular_favorites;
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  var match = [];
  //console.log(NTInstance);
  for (var i = 0; i < list.length; i++) {
    if (savedFavorites !== null) {
      match = $.grep(savedFavorites, function (e) {
        return e.url === list[i].url;
      });
    }

    if (match.length === 0) {
      var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg + ">" + list[i].title + "</a>";
      $(".popularFavs").append(favHTML);
    }
  }
};

module.exports = {
  init: init,
  addFavorite: addFavorite,
  saveFavorite: saveFavorite,
  getPopularFavorites: getPopularFavorites,
  deleteFavorite: deleteFavorite,
  loadSavedFavorites: loadSavedFavorites,
  loadPopularFavorites: loadPopularFavorites,
  loadDefaultFavorites: loadDefaultFavorites,
  createDefaultFavs: createDefaultFavs,
  createPopularFavs: createPopularFavs
};