const background = chrome.extension.getBackgroundPage();
const NTInstance = background.NTInstance;
NTInstance.editing = false;
NTInstance.currentSettings = {
  "theme" : "light",
  "font" : "Montserrat",
  "hover" : "hoverPop",
  "background" : null,
  "faveSize" : "60"
};


// chrome.storage.local.get(function(res){
//   console.log(res);
// });

const SettingsManager = require("./SettingsManager.js");
const Calendar = require("./createCalendar.js");
const FavoritesManager = require("./FavoritesManager.js");
const Util = require("./util.js");
const Todos = require("./todos.js");
const ThemeManager = require("./ThemeManager.js");


$(document).ready(function() {
  SettingsManager.loadUserSettings(NTInstance);
  FavoritesManager.loadSavedFavorites(NTInstance);
  FavoritesManager.loadPopularFavorites(NTInstance);
  SettingsManager.setUserSettings(NTInstance.currentSettings);
  var calendar = Calendar.theCalendar;
  $(".calendar-head").html("<span>" + Calendar.month_name[Calendar.month] + " " + Calendar.year + "</span");
  $(".calendar").append(calendar);
  $("#favorites").sortable();
  $("#favorites").sortable("disable");
  chrome.runtime.sendMessage({task: "checkFirstRun"}, function(res) {
    if(res.firstRun){
      FavoritesManager.loadDefaultFavorites(NTInstance);
      triggerModal($(".addModal"));
      // triggerModal($(".onboardingModal"));
      $("#obInputTitle").focus();
    }
    else {
      let $todoList = $(".todos");
      var savedTodos = Todos.getSavedTodos();
      savedTodos.forEach((el, idx) => {
        Todos.addNewTodoToDOM(el, $todoList);
      });
      let hidePopFaves = NTInstance.getSetting("hidePopFaves", false);

      if(hidePopFaves) {
        $(".popularFavs, .addExtra, .hidePopFaves").hide();
      }
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

     switch(clickElement) {
        case "addFavorite":
          if($(".addModal .popularFavs").children().length === 0){
            $(".addExtra").hide();
          }
          var modalToOpen = $(".addModal");
          triggerModal(modalToOpen);
          $("#inputTitle").focus();
          break;

        case 'editMode':
          e.preventDefault();
          $(".favorite").toggleClass("editing");
          $(".favorite").children().toggle();
          if(!NTInstance.editing){
            $("#favorites").sortable("enable");
          }
          else{
            $("#favorites").sortable("disable");
            let newFaves = [].slice.call($(".favorite"),0);
            let reorderedFaves = [];
              newFaves.forEach((el) => {
              let { title, bgImg } = el.dataset;
              let newFave = {
                "title" : title,
                "url" : el.href,
                "bgImg" : bgImg
              };
              reorderedFaves.push(newFave);
            });
            NTInstance.setSetting("savedFavorites", reorderedFaves);
          }
          NTInstance.editing = !NTInstance.editing;
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
        case 'openTodos':
          e.preventDefault();
          var todosModal = $(".todosModal");
          triggerModal(todosModal);
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
    FavoritesManager.saveFavorite(newEntry, NTInstance);
    $(this).remove();
    var allPopFavs = $(".popularFavs").children();
    var popArr = [].slice.call(allPopFavs, 0);
    var match = popArr.filter(function(el) {
      return $(el).data("url") === urltoAdd;
    });
    $(match).hide();
    if($(".addModal .popularFavs").children().length === 0) {
      NTInstance.setSetting("hidePopFaves", true);
      $(".addExtra, .popularFavs, .hidePopFaves").hide();
    }
  });
/*
  Handler for close button
*/
  $(document).on("click", ".closeBtn", function(e) {
    e.preventDefault();
    var modalToClose = $(this).closest(".modal");
    closeModal(modalToClose);
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
      FavoritesManager.saveFavorite(newEntry, NTInstance);

      if ($(".modal").length !== null) {
        closeModal($(".modal"));
      }
      $(".addFormError").hide();
      $(".addFavForm input").val("");
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

    ThemeManager.setTheme(this.value);

    // if (this.value === 'light') {
    //   $("body, .modal, .headerPanel").css({"background" : "white"});
    //   $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span, .addFormError, .addTodo").css("color", "black");
    //   $(".favorite").css({"border" : "1.5px solid black"});
    //   $(".favorite i, .popFav").css("color", "white");
    //
    // }
    // else if (this.value === 'dark') {
    //   $("body, .modal, .headerPanel").css({"background": "#3c3c3c", "boxShadow": "0px 1px 1px 1px #666"});
    //   $("*").not(".bgURLError").css("color", "white");
    //   $("input, select, option").css("color", "black");
    //   $(".favorite").css({"border": "1.5px solid #999", "boxShadow" : "0px 1px 1px 1px #666"});
    //
    // }
    //
    // else if (this.value === "fade") {
    //
    //   $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
    //   $("*").not(".bgURLError").css("color", "white");
    //   $("input, select, option").css("color", "black");
    //   $(".headerPanel").css("border", "none");
    // }
  });


  $(document).on("change", ".hoverOption", function() {
    var hoverSelected = $(this).val();
    SettingsManager.setHover(hoverSelected, NTInstance);
  });
  $(document).on("change", ".fontOption", function() {
    var fontSelected = $(this).val();
    SettingsManager.setFont(fontSelected, NTInstance);
  });
  $(document).on("change", ".favoriteSize", function() {
    var sizeSelected = $(this).val();
    SettingsManager.setSize(sizeSelected, NTInstance);
  });
  $(document).on("change", ".themeBGImageRepeat", function() {
    var bgStyleSelected = $(this).val();
    SettingsManager.setBGStyle(bgStyleSelected, NTInstance);
  });
  /*
    Handlers for edit mode options on each of the favorites
  */
  $(document).on("click", ".optDel", function(e) {
    e.preventDefault();


    var linkToDelete = $(this).parent().attr("href");
    FavoritesManager.deleteFavorite(linkToDelete, NTInstance);
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

  $(".todoForm").on("submit", (e) => {
    e.preventDefault();
    let $todoList = $(".todos");
    let $newTodo = $(".newTodo").val();
    Todos.addNewTodoToDOM( {"item" : $newTodo, "isDone" : false }, $todoList);
    Todos.saveTodo($newTodo);
    $(".newTodo").val("");
  });
  $(document).on("click", ".addTodo", () => {
    $(".todoForm").submit();
  });
  $(document).on("click", ".todoItem", function () {
    $(this).toggleClass("complete");
    var childCheckbox = $(this).find("input[type='checkbox']");
    if($(this).hasClass("complete"))
    childCheckbox.prop("checked", true);
    else
    childCheckbox.prop("checked", false);


    Todos.saveTodoList();
  });

  $(document).on("click", ".hidePopFaves", function() {
    NTInstance.setSetting("hidePopFaves", true);
    $(".popularFavs, .addExtra, .hidePopFaves").hide();
  });
  $(document).on("click", ".clearBtn", function() {
    Todos.clearAllTodos();
  });

  $(document).on("click", ".delTodo", function() {
    $(this).parent().remove();
    Todos.saveTodoList();
  });

});

function triggerModal(modal) {
    $('.lightbox').fadeIn();
    // modal.fadeIn();
    modal.animate({
      "right" : "0px"
    }, 300);

}

function closeModal (modal) {
    $('.lightbox').fadeOut();
    // modal.fadeOut();
    modal.animate({
      "right" : "-425px"
    }, 300);
}

function triggerEditMode () {
    $("#favorites").sortable("enable");
}
