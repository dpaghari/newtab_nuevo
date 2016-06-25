"use strict";

// import $ from "jquery";
var background = chrome.extension.getBackgroundPage();
var NTInstance = background.NTInstance;
NTInstance.editing = false;
NTInstance.currentSettings = {
  "theme": "light",
  "font": "Work Sans",
  "hover": "hoverPop",
  "background": null
};

var Actions = require("./actions.js");
var Calendar = require("./createCalendar.js");
var Favorites = require("./favorites.js");
var Util = require("./util.js");
$(document).ready(function () {
  console.log(NTInstance);
  Actions.init(NTInstance);
  Actions.loadUserSettings();
  Actions.setUserSettings(NTInstance.currentSettings);
  console.log(NTInstance);
  Favorites.init(NTInstance);
  Favorites.loadPopularFavorites();
  Favorites.loadSavedFavorites();

  var calendar = Calendar.buildCalendar();
  $(".calendar-head").html("<span>" + Calendar.month_name[Calendar.month] + " " + Calendar.year + "</span");
  $(".calendar").append(calendar);
  $("#favorites").sortable();
  $("#favorites").sortable("disable");

  chrome.runtime.sendMessage({ task: "checkFirstRun" }, function (res) {
    if (res.firstRun) {
      Actions.showInitialLoad();
      Favorites.loadDefaultFavorites();
      Actions.triggerModal($(".onboardingModal"));
      $("#obInputTitle").focus();
    }

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
          Actions.triggerEditMode();
        } else {
          Actions.processEditedList();
        }
        break;

      case 'openSettings':
        e.preventDefault();
        var settingsModal = $(".settingsModal");
        Actions.triggerModal(settingsModal);

        break;

      case 'openOnboarding':
        e.preventDefault();
        var onBoardingModal = $(".onboardingModal");
        Actions.triggerModal(onBoardingModal);
        break;

      case 'openCalendar':
        e.preventDefault();
        var calendarModal = $(".calendarModal");
        Actions.triggerModal(calendarModal);
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
    Favorites.saveFavorite(newEntry);
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
    var modalToClose = $(this).closest(".modal");
    Actions.closeModal(modalToClose);
  });
  $(document).on("click", ".closeEdit", function (e) {
    e.preventDefault();
    var modalToClose = $(this).parent();
    Actions.closeModal(modalToClose);
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
    urlVal = Util.addHttp(urlVal);
    var isValidURL = Util.validateURL(urlVal);

    if (!isValidURL) {
      $("#addFormError").text("Please enter a valid URL").show();
    }
    var imageVal = $("#inputImage").val();
    imageVal = Util.addHttp(imageVal);
    var isValidImgURL = Util.validateURL(imageVal);
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
      Favorites.saveFavorite(newEntry);

      if ($(".modal").length !== null) {
        Actions.closeModal($(".modal"));
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

  $(document).on("click", ".updateBtn", function () {
    var newImageURL = $("input[name=themeBGImage]").val();
    var isValidURL = Util.validateURL(newImageURL);
    if (isValidURL) {
      NTInstance.setSetting("userThemeBG", newImageURL);
      $("body").css("background-image", "url('" + newImageURL + "')");
    } else {
      $(".bgURLError").show();
    }
  });
  $(document).on("click", ".removeBtn", function () {
    $("input[name=themeBGImage]").val("");
    // var isValidURL = validateURL(newImageURL);
    // if(isValidURL) {
    NTInstance.setSetting("userThemeBG", null);
    $("body").css("background-image", "none");
    $(".bgURLError").hide();
    // }
  });

  $('input[type=radio][name=theme-select]').change(function () {
    NTInstance.setSetting("userTheme", this.value);
    if (this.value == 'light') {
      $("body, .modal").css("background", "white");
      $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color", "black");
      $(".favorite").css("border", "1.5px solid black");
      $(".favorite i, .popFav").css("color", "white");
    } else if (this.value == 'dark') {
      $("body, .modal").css("background", "#3c3c3c");
      $("*").not(".bgURLError").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".favorite").css("border", "1.5px solid #d4d6e9");
    }
  });

  $(document).on("change", ".hoverOption", function () {
    var hoverSelected = $(this).val();
    switch (hoverSelected) {

      case "hoverPop":
        NTInstance.setSetting("userHover", "hoverPop");
        $(".favorite").addClass("hoverPop").removeClass("hoverNone hoverHighlight");
        break;

      case "hoverHighlight":
        NTInstance.setSetting("userHover", "hoverHighlight");
        $(".favorite").addClass("hoverHighlight").removeClass("hoverNone hoverPop");
        break;

      case "hoverNone":
        NTInstance.setSetting("userHover", "hoverNone");
        $(".favorite").addClass("hoverNone").removeClass("hoverPop hoverHighlight");
        break;
    }
  });
  $(document).on("change", ".fontOption", function () {
    // console.log($(this).val());
    var fontSelected = $(this).val();
    Actions.setFont(fontSelected);
    // switch(fontSelected) {
    //   case "Montserrat":
    //   Actions.setFont(fontSelected);
    //
    //   break;
    //   case "BebasNeue":
    //   newFontStack = "BebasNeue";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    //   case "Roboto Mono":
    //   newFontStack = "Roboto Mono";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    //   case "Raleway":
    //   newFontStack = "Raleway";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    //   case "Pridi":
    //   newFontStack = "Pridi";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    //   case "Work Sans":
    //   newFontStack = "Work Sans";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    //   case "Mitr":
    //   newFontStack = "Mitr";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    //   case "Museo Sans":
    //   newFontStack = "MuseoSans";
    //   NTInstance.setSetting("userFont", newFontStack);
    //   $("*").not("i").css("font-family", newFontStack);
    //   break;
    // }
  });

  /*
    Handlers for edit mode options on each of the favorites
  */
  $(document).on("click", ".optDel", function (e) {
    e.preventDefault();
    var favorite = $(this).parent();
    var linkToDelete = favorite.attr("href");
    Favorites.deleteFavorite(linkToDelete);
    $(this).parent().remove();
  });
  // $(document).on("click", ".optEdit", function(e) {
  //   e.preventDefault();
  //   // Open Edit Modal
  //   NTInstance.editedItem = $(this).parent();
  //   var favorite = $(this).parent();
  //   $(".editedItem").text(favorite[0].dataset.title);
  //   favorite.addClass("changingVals");
  //   triggerModal($(".editModal"));
  //   $("#editInputUrl").focus();
  //
  // });
  $(document).on("click", ".favorite", function (e) {
    if ($(this).hasClass("editing")) e.preventDefault();
  });
});