"use strict";

var background = chrome.extension.getBackgroundPage();
var NTInstance = background.NTInstance;

$(document).ready(function () {
  chrome.runtime.sendMessage({ task: "checkFirstRun" }, function (res) {
    if (res.firstRun) {
      loadDefaultFavorites();
      triggerModal($(".onboardingModal"));
    }
  });
  loadSavedFavorites();
  loadPopularFavorites();
  chrome.storage.local.get(null, function (items) {
    console.log(items);
  });
  // Hide edit icons
  $(".favorite").children().hide();
  // Refresh time every second
  var currentTime = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
  $('#time').html(currentTime);
  var currentDate = new Date().toDateString();
  $('#date').html(currentDate);
  setInterval(function () {
    currentTime = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
    $('#time').html(currentTime);
  }, 1000);

  /*
    Handlers for the top right main user actions menu
  */
  $(document).on("click", ".userAction", function (e) {
    e.preventDefault();
    var clickElement = $(this).attr('id');
    //console.log(clickElement);
    switch (clickElement) {
      case "addFavorite":
        var modalToOpen = $(".addModal");
        triggerModal(modalToOpen);
        break;

      case 'editMode':
        e.preventDefault();
        triggerEditMode();
        break;

      case 'openSettings':
        e.preventDefault();
        var settingsModal = $(".settingsModal");
        triggerModal(settingsModal);
        break;

      case 'openOnboarding':
        e.preventDefault();
        var onBoardingModal = $(".onboardingModal");
        triggerModal(onBoardingModal);
        break;

      case 'openCalendar':
        e.preventDefault();
        var calendarModal = $(".calendarModal");
        triggerModal(calendarModal);
        break;
    }
  });

  /*
    Handler for the suggested favorites in the Add New Favorite menu
  */
  $(document).on("click", ".popFav", function (e) {
    e.preventDefault();
    var selection = $(this)[0];
    var titletoAdd = selection.dataset.title;
    var urltoAdd = selection.dataset.url;
    var imgtoAdd = selection.dataset.imgurl;

    var newEntry = {
      "title": titletoAdd,
      "url": urltoAdd,
      "bgImg": imgtoAdd
    };
    console.log(newEntry);
    saveFavorite(newEntry);
  });

  $(document).on("click", ".closeBtn", function (e) {
    e.preventDefault();
    var modalToClose = $(this).parent();
    closeModal(modalToClose);

    if ($(this).parents('.onboardingModal').length) {
      var $arrowContainer = "\n        <div class=\"arrowContainer\">\n          <p>^</p>\n          <p>You can also add favorites by clicking the + icon</p>\n        </div>\n        ";
      $(".addFavorite").append($arrowContainer);
    }
  });

  $(document).on("click", '.arrowContainer', function () {
    $(this).remove();
  });

  /*
    Handler for the add button on the Add a New Favorite menu
  */
  $(document).on("click", ".addBtn", function (e) {
    e.preventDefault();
    var titleVal = $("#inputTitle").val();
    var urlVal = $("#inputUrl").val();
    var imageVal = $("#inputImage").val();
    var newEntry = {
      "title": titleVal,
      "url": urlVal,
      "bgImg": imageVal
    };
    saveFavorite(newEntry);

    if ($(".modal").length !== null) {
      closeModal($(".modal"));
    }
  });

  /*
    Handlers for edit mode options on each of the favorites
  */
  $(document).on("click", ".optDel", function (e) {
    e.preventDefault();
    var linkToDelete = $(this).parent().attr("href");
    console.log(linkToDelete);
    deleteFavorite(linkToDelete);
    $(this).parent().remove();
  });
  $(document).on("click", ".optEdit", function (e) {
    e.preventDefault();
    // Open Edit Modal
  });
  $(document).on("click", ".favorite", function (e) {
    if ($(this).hasClass("editing")) e.preventDefault();
  });
});

function deleteFavorite(delUrl) {
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if (savedFavorites !== null) {
    savedFavorites.forEach(function (item, index) {
      if (item.url === delUrl) {
        savedFavorites.splice(index, 1);
      }
    });
    NTInstance.setSetting("savedFavorites", savedFavorites);
  }
}

// Load saved favorites onload
function loadSavedFavorites() {
  var savedItems = [];
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if (savedFavorites !== null) {
    savedItems = savedFavorites;
    savedItems.forEach(function (item) {
      addFavorite(item.url, item.bgImg);
    });
  }
}

function loadPopularFavorites() {
  var popFavs = getPopularFavorites();
  popFavs.then(function (res) {
    var response = JSON.parse(res);
    createPopularFavs(response);
  });
}
function loadDefaultFavorites() {
  var popFavs = getPromise("/newtab/defaultFavs.json");
  popFavs.then(function (res) {
    var response = JSON.parse(res);
    createDefaultFavs(response);
  });
}

function createDefaultFavs(favorites) {
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
}

function createPopularFavs(favorites) {
  var list = favorites.popular_favorites;
  for (var i = 0; i < list.length; i++) {
    var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg + ">" + list[i].title + "</a>";
    $(".popularFavs").append(favHTML);
  }
}

// Prompt user for image to use for bookmark
// and also the url.  Append to favorites
function triggerModal(modal) {
  $('.lightbox').fadeIn();
  modal.fadeIn();
}

function closeModal(modal) {
  $('.lightbox').fadeOut();
  modal.fadeOut();
}
// Add a new favorite to the favorites grid
function addFavorite(url, imageUrl) {
  var newFavorite = document.createElement("A");
  newFavorite.href = url;
  newFavorite.style.backgroundImage = "url(" + imageUrl + ")";
  newFavorite.style.backgroundSize = "cover";
  newFavorite.style.backgroundPosition = "center center";
  newFavorite.style.backgroundRepeat = "no-repeat";
  newFavorite.classList.add("favorite");
  var optDel = document.createElement("I");
  optDel.classList.add("fa", "fa-trash-o", "fa-lg", "fa-fw", "optDel");
  var optEdit = document.createElement("I");
  optEdit.classList.add("fa", "fa-pencil", "fa-lg", "fa-fw", "optEdit");
  newFavorite.appendChild(optDel);
  newFavorite.appendChild(optEdit);
  $("#favorites").append(newFavorite);
  $(".favorite").children().hide();
}

// Save favorite to local storage
function saveFavorite(entry) {
  var currentSaved = [];
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if (savedFavorites !== null) {
    currentSaved = savedFavorites;
  }
  currentSaved.push(entry);
  NTInstance.setSetting("savedFavorites", currentSaved);
  addFavorite(entry.url, entry.bgImg);
  $("#inputUrl").val("");
  $("#inputImage").val("");
}

function getPopularFavorites() {
  return $.ajax({
    url: "./popularFavs.json",
    method: "GET"
  });
}
function getPromise(url) {
  return $.ajax({
    url: url,
    method: "GET"
  });
}
function triggerEditMode() {
  var favorites = $(".favorite");
  favorites.toggleClass("editing");
  favorites.children().toggle();
}