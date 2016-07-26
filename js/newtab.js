// import $ from "jquery";
var background = chrome.extension.getBackgroundPage();
var NTInstance = background.NTInstance;
NTInstance.editing = false;
NTInstance.currentSettings = {
  "theme" : "light",
  "font" : "Work Sans",
  "hover" : "hoverPop",
  "background" : null,
  "faveSize" : "80"
};


const Actions = require("./actions.js");
const Calendar = require("./createCalendar.js");
const Favorites = require("./favorites.js");
const Util = require("./util.js");


$(document).ready(function() {

  Actions.loadUserSettings(NTInstance);
  Favorites.loadSavedFavorites(NTInstance);
  Favorites.loadPopularFavorites(NTInstance);
  Actions.setUserSettings(NTInstance.currentSettings);
  var calendar = Calendar.theCalendar;
  console.log(Calendar);
  $(".calendar-head").html("<span>" + Calendar.month_name[Calendar.month] + " " + Calendar.year + "</span");
  $(".calendar").append(calendar);
  $("#favorites").sortable();
  $("#favorites").sortable("disable");

  chrome.runtime.sendMessage({task: "checkFirstRun"}, function(res) {
    if(res.firstRun){
      Actions.showInitialLoad();
      Favorites.loadDefaultFavorites(NTInstance);
      Actions.triggerModal($(".onboardingModal"));
      $("#obInputTitle").focus();
    }

    // Hide edit icons
    $(".favorite").children().hide();
  });

  // Refresh time every second
  var currentTime = new Date().toLocaleTimeString(navigator.language, { hour : '2-digit', minute: '2-digit'} );
  $('#time').html(currentTime);
  var currentDate = new Date().toDateString();
  $('#date').html(currentDate);
  setInterval(function(){
    currentTime = new Date().toLocaleTimeString(navigator.language, { hour : '2-digit', minute: '2-digit'} );
    $('#time').html(currentTime);
  }, 1000);

  /*
    Handlers for the top right main user actions menu
  */
  $(document).on("click", ".userAction", function(e) {
     e.preventDefault();
     var clickElement = $(this).attr('id');
     //console.log(clickElement);
     switch(clickElement) {
        case "addFavorite":
          if($(".addModal .popularFavs").children().length === 0){
            $(".addExtra").hide();
          }
          var modalToOpen = $(".addModal");
          Actions.triggerModal(modalToOpen);
          $("#inputTitle").focus();
          break;

        case 'editMode':
          e.preventDefault();
          NTInstance.editing = !NTInstance.editing;
          $(".favorite").toggleClass("editing");
          $(".favorite").children().toggle();
          if(NTInstance.editing){
            Actions.triggerEditMode();
          }
          else{
            Actions.processEditedList(NTInstance);
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
  $(document).on("click", ".popFav", function(e){
    e.preventDefault();
    var selection = $(this)[0];
    var titletoAdd = selection.dataset.title;
    var urltoAdd = selection.dataset.url;
    var imgtoAdd = selection.dataset.imgurl;

    var newEntry = {
      "title" : titletoAdd,
      "url" : urltoAdd,
      "bgImg" : imgtoAdd
    };
    Favorites.saveFavorite(newEntry, NTInstance);
    $(this).remove();
    if($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
      $(".addExtra, .popularFavs").hide();
    }
  });
/*
  Handler for close button
*/
  $(document).on("click", ".closeBtn", function(e) {
    e.preventDefault();
    var modalToClose = $(this).closest(".modal");
    Actions.closeModal(modalToClose);
  });

  /*
    Handler for the add button on the Add a New Favorite menu
  */
  $(document).on("click", ".addBtn",  function(e){
    e.preventDefault();
    var titleVal = $("#inputTitle").val();
    var urlVal = $("#inputUrl").val();
    urlVal = Util.addHttp(urlVal);
    var isValidURL = Util.validateURL(urlVal);
    if(!isValidURL) {
      $(".addFormError").css("color", "red");
      $(".addFormError").text("Please enter a valid URL").show();
    }
    var imageVal = $("#inputImage").val();
    imageVal = Util.addHttp(imageVal);
    var isValidImgURL = Util.validateURL(imageVal);
    if(!isValidImgURL) {
      $(".addFormError").text("Please enter a valid Image URL").show();
    }
    if(!isValidURL && !isValidImgURL) {
      $(".addFormError").text("Please enter a valid URL & Image URL").show();
    }
    if((titleVal !== "") && (urlVal !== "" && isValidURL) && (imageVal !== "" && isValidImgURL)){
      var newEntry = {
        "title" : titleVal,
        "url" : urlVal,
        "bgImg" : imageVal
      };
      Favorites.saveFavorite(newEntry);

      if ($(".modal").length !== null) {
        Actions.closeModal($(".modal"));
      }
      $(".addFormError").hide();
    }
    else {
      $(".addFormError").show();
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


  $(document).on("click", ".updateBtn", function() {
    var newImageURL = $("input[name=themeBGImage]").val();
    var isValidURL = Util.validateURL(newImageURL);
    if(isValidURL) {
      NTInstance.setSetting("userThemeBG", newImageURL);
      $("body").css("background-image", "url('" + newImageURL + "')");
    }
    else {
      $(".bgURLError").show();
    }
  });
  $(document).on("click", ".removeBtn", function() {
    $("input[name=themeBGImage]").val("");
    // var isValidURL = validateURL(newImageURL);
    // if(isValidURL) {
      NTInstance.setSetting("userThemeBG", null);
      $("body").css("background-image", "none");
      $(".bgURLError").hide();
    // }
  });

  $('input[type=radio][name=theme-select]').change(function() {
    NTInstance.setSetting("userTheme", this.value);
    if (this.value === 'light') {
      $("body, .modal").css("background", "white");
      $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span, .addFormError").css("color", "black");
      $(".favorite").css("border", "1.5px solid black");
      $(".favorite i, .popFav").css("color", "white");

    }
    else if (this.value === 'dark') {
      $("body, .modal").css("background", "#3c3c3c");
      $("*").not(".bgURLError").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".favorite").css("border", "1.5px solid #d4d6e9");

    }

    else if (this.value === "fade") {
      $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
      $("*").not(".bgURLError").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".headerPanel").css("border", "none");
    }
  });


  $(document).on("change", ".hoverOption", function() {
    var hoverSelected = $(this).val();
    Actions.setHover(hoverSelected, NTInstance);
  });
  $(document).on("change", ".fontOption", function() {
    var fontSelected = $(this).val();
    Actions.setFont(fontSelected, NTInstance);
  });
  $(document).on("change", ".favoriteSize", function() {
    var sizeSelected = $(this).val();
    Actions.setSize(sizeSelected, NTInstance);
  });
  $(document).on("change", ".themeBGImageRepeat", function() {
    var bgStyleSelected = $(this).val();
    Actions.setBGStyle(bgStyleSelected, NTInstance);
  });
  /*
    Handlers for edit mode options on each of the favorites
  */
  $(document).on("click", ".optDel", function(e) {
    e.preventDefault();
    var favorite = $(this).parent();
    var linkToDelete = favorite.attr("href");
    Favorites.deleteFavorite(linkToDelete, NTInstance);
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
  $(document).on("click", ".favorite", function(e) {
    if($(this).hasClass("editing"))
      e.preventDefault();
  });
});
