"use strict";

var background = chrome.extension.getBackgroundPage();
var NTInstance = background.NTInstance;
NTInstance.editing = false;
NTInstance.currentSettings = {
  "theme": "light",
  "font": "Montserrat, sans-serif",
  "hover": "hoverPop"
};
// NTInstance.editedItem;

$(document).ready(function () {
  loadUserSettings();
  $("#favorites").sortable();
  $("#favorites").sortable("disable");
  chrome.runtime.sendMessage({ task: "checkFirstRun" }, function (res) {
    if (res.firstRun) {
      loadDefaultFavorites();
      triggerModal($(".onboardingModal"));
      $("#obInputTitle").focus();
    }
    loadSavedFavorites();
    loadPopularFavorites();
    setUserSettings(NTInstance.currentSettings);
    // Hide edit icons
    $(".favorite").children().hide();
  });

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
        if ($(".addModal .popularFavs").children().length === 0) {
          $(".addExtra").hide();
        }
        var modalToOpen = $(".addModal");
        triggerModal(modalToOpen);
        $("#inputTitle").focus();
        break;

      case 'editMode':
        e.preventDefault();
        NTInstance.editing = !NTInstance.editing;
        $(".favorite").toggleClass("editing");
        $(".favorite").children().toggle();
        if (NTInstance.editing) {
          triggerEditMode();
        } else {
          processEditedList();
        }
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
    // console.log(newEntry);
    saveFavorite(newEntry);
    // console.log($(this).closest(".popularFavs"));
    $(this).remove();
    if ($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
      $(".addExtra").hide();
    }
  });
  /*
    Handler for close button
  */
  $(document).on("click", ".closeBtn", function (e) {
    e.preventDefault();
    var modalToClose = $(this).parent();
    closeModal(modalToClose);

    if ($(this).parents('.onboardingModal').length) {
      var $arrowContainer = "\n        <div class=\"arrowContainer\">\n          <p>^</p>\n          <p>You can also add favorites by clicking the + icon</p>\n        </div>\n        ";
      $(".addFavorite").append($arrowContainer);
    }
  });
  $(document).on("click", ".closeEdit", function (e) {
    e.preventDefault();
    var modalToClose = $(this).parent();
    closeModal(modalToClose);
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
    urlVal = addHttp(urlVal);
    var isValidURL = validateURL(urlVal);

    if (!isValidURL) {
      $("#addFormError").text("Please enter a valid URL").show();
    }
    var imageVal = $("#inputImage").val();
    imageVal = addHttp(imageVal);
    var isValidImgURL = validateURL(imageVal);
    if (!isValidImgURL) {
      $("#addFormError").text("Please enter a valid Image URL").show();
    }
    if (!isValidURL && !isValidImgURL) {
      $("#addFormError").text("Please enter a valid URL & Image URL").show();
    }
    if (titleVal !== "" && urlVal !== "" && isValidURL && imageVal !== "" && isValidImgURL) {
      var newEntry = {
        "title": titleVal,
        "url": urlVal,
        "bgImg": imageVal
      };
      saveFavorite(newEntry);

      if ($(".modal").length !== null) {
        closeModal($(".modal"));
      }
      $("#addFormError").hide();
    } else {
      $("#addFormError").show();
    }
  });
  /*
    Handler for the accept changes in edit favorite menu
  */
  // $(document).on("click", ".editBtn", function(e){
  //   var itemToEdit = NTInstance.editedItem;
  //   console.log(itemToEdit);
  //   e.preventDefault();
  //   var titleVal = itemToEdit[0].dataset.title;
  //   var urlVal = $("#editInputUrl").val();
  //   var imageVal = $("#editInputImage").val();
  //   var newEntry = {
  //     "title" : titleVal,
  //     "url" : urlVal,
  //     "bgImg" : imageVal
  //   };
  //   saveFavorite(newEntry);
  //
  //   var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  //   for (var i = 0; i < savedFavorites.length; i++) {
  //     if(savedFavorites[i].url === itemToEdit.url) {
  //       savedFavorites.splice(i, 1);
  //     }
  //   }
  //   NTInstance.setSetting("savedFavorites", savedFavorites);
  //   if ($(".modal").length !== null) {
  //     closeModal($(".modal"));
  //   }
  //   $(itemToEdit).remove();
  //   NTInstance.editedItem = null;
  // });

  $('input[type=radio][name=theme-select]').change(function () {
    NTInstance.setSetting("userTheme", this.value);
    if (this.value == 'light') {
      $("body, .modal").css("background", "#f6f6f6");
      $("*").not(".addBtn").css("color", "black");
      $(".favorite").css("border", "1.5px solid black");
      $(".favorite i, .popFav").css("color", "white");
    } else if (this.value == 'dark') {
      $("body, .modal").css("background", "#3c3c3c");
      $("*").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".favorite").css("border", "1.5px solid #d4d6e9");
    }
  });

  $(document).on("change", ".hoverOption", function () {
    var hoverSelected = $(this).val();
    switch (hoverSelected) {

      case "pop":
        NTInstance.setSetting("userHover", "hoverPop");
        $(".favorite").addClass("hoverPop").removeClass("hoverNone hoverHighlight");
        break;

      case "highlight":
        NTInstance.setSetting("userHover", "hoverHighlight");
        $(".favorite").addClass("hoverHighlight").removeClass("hoverNone hoverPop");
        break;

      case "none":
        NTInstance.setSetting("userHover", "hoverNone");
        $(".favorite").addClass("hoverNone").removeClass("hoverPop hoverHighlight");
        break;
    }
  });
  $(document).on("change", ".fontOption", function () {
    // console.log($(this).val());
    var fontSelected = $(this).val();
    var newFontStack;
    switch (fontSelected) {
      case "Montserrat":
        newFontStack = "Montserrat, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
      case "Bebas_Neue":
        newFontStack = "BebasNeue, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
      case "Roboto_Mono":
        newFontStack = "Roboto Mono, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
      case "Raleway":
        newFontStack = "Raleway, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
      case "Pridi":
        newFontStack = "Pridi, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
      case "Work_Sans":
        newFontStack = "Work Sans, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
      case "Mitr":
        newFontStack = "Mitr, sans-serif";
        NTInstance.setSetting("userFont", newFontStack);
        $("*").not("i").css("font-family", newFontStack);
        break;
    }
  });

  /*
    Handlers for edit mode options on each of the favorites
  */
  $(document).on("click", ".optDel", function (e) {
    e.preventDefault();
    var favorite = $(this).parent();
    var linkToDelete = favorite.attr("href");
    deleteFavorite(linkToDelete);
    $(this).parent().remove();
  });
  $(document).on("click", ".optEdit", function (e) {
    e.preventDefault();
    // Open Edit Modal
    NTInstance.editedItem = $(this).parent();
    var favorite = $(this).parent();
    $(".editedItem").text(favorite[0].dataset.title);
    favorite.addClass("changingVals");
    triggerModal($(".editModal"));
    $("#editInputUrl").focus();
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
      addFavorite(item.title, item.url, item.bgImg);
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
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  var match = [];
  //console.log(NTInstance);
  for (var i = 0; i < list.length; i++) {
    if (savedFavorites !== null) {
      match = $.grep(savedFavorites, function (e) {
        return e.url === list[i].url;
      });
    }
    // var popularFav = {
    //   "title" : list[i].title,
    //   "url" : list[i].url,
    //   "bgImg" : list[i].bgImg
    // };

    if (match.length === 0) {
      var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg + ">" + list[i].title + "</a>";
      $(".popularFavs").append(favHTML);
    }
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
function addFavorite(title, url, imageUrl) {
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
  addFavorite(entry.title, entry.url, entry.bgImg);
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
  $("#favorites").sortable("enable");
}

function processEditedList() {
  var reorderedList = $("#favorites").children();
  var processedList = [];
  for (var i = 0; i < reorderedList.length; i++) {
    var newEntry = {
      "title": reorderedList[i].childNodes[0].dataset.title,
      "url": reorderedList[i].childNodes[0].href,
      "bgImg": reorderedList[i].childNodes[0].dataset.bgImg
    };
    processedList.push(newEntry);
  }
  NTInstance.setSetting("savedFavorites", processedList);
  $("#favorites").sortable("disable");
}

function validateURL(url) {
  // var regex = "";
  // console.log(typeof regex, url.match(regex));
  if (url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/) === null) {

    return false;
  } else return true;
}

function addHttp(url) {
  var newUrl;
  if (url.match(/^(https?:\/\/)/) === null) {
    var addHttp = "http://";
    newUrl = addHttp.concat(url);
    return newUrl;
  }
}

function loadUserSettings() {
  var userTheme = NTInstance.getSetting("userTheme", "light");
  var userFont = NTInstance.getSetting("userFont", "Montserrat, sans-serif");
  var userHover = NTInstance.getSetting("userHover", "hoverPop");
  NTInstance.currentSettings = {
    "theme": userTheme,
    "font": userFont,
    "hover": userHover
  };
  // console.log(NTInstance.currentSettings);
}
function setUserSettings(settings) {
  if (settings.theme == 'light') {
    $("body, .modal").css("background", "#f6f6f6");
    $("*").not(".addBtn").css("color", "black");
    $(".favorite").css("border", "1.5px solid black");
    $(".favorite i, .popFav").css("color", "white");
  } else if (settings.theme == 'dark') {
    $("body, .modal").css("background", "#3c3c3c");
    $("*").css("color", "white");
    $("input, select, option").css("color", "black");
    $(".favorite").css("border", "1.5px solid #d4d6e9");
  }
  $("*").not("i").css("font-family", settings.font);
}