var background = chrome.extension.getBackgroundPage();
var NTInstance = background.NTInstance;
NTInstance.editing = false;
NTInstance.currentSettings = {
  "theme" : "light",
  "font" : "Work Sans",
  "hover" : "hoverPop",
  "background" : null
};


// Calendar
let d = new Date();
let month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let month = d.getMonth(); // 0 - 11
let year = d.getFullYear(); // 2016
let today = d.getDate();
let first_date = month_name[month] + " " + 1 + " " + year;
let tmp = new Date(first_date).toDateString();
let first_day = tmp.substring(0, 3);
let day_name = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
let day_no = day_name.indexOf(first_day);
let days = new Date(year, month+1, 0).getDate();
let table = document.createElement("table");
let tr = document.createElement("tr");


$(document).ready(function() {

  loadUserSettings();
  setUserSettings(NTInstance.currentSettings);
  loadPopularFavorites();
  loadSavedFavorites();
  var calendar = buildCalendar();
  $(".calendar-head").html("<span>" + month_name[month] + " " + year + "</span");
  $(".calendar").append(calendar);
  $("#favorites").sortable();
  $("#favorites").sortable("disable");

  chrome.runtime.sendMessage({task: "checkFirstRun"}, function(res) {
    if(res.firstRun){
      showInitialLoad();
      loadDefaultFavorites();
      triggerModal($(".onboardingModal"));
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
          triggerModal(modalToOpen);
          $("#inputTitle").focus();
          break;

        case 'editMode':
          e.preventDefault();
          NTInstance.editing = !NTInstance.editing;
          $(".favorite").toggleClass("editing");
          $(".favorite").children().toggle();
          if(NTInstance.editing){
            triggerEditMode();
          }
          else{
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
    // console.log(newEntry);
    saveFavorite(newEntry);
    // console.log($(this).closest(".popularFavs"));
    $(this).remove();
    if($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
      $(".addExtra").hide();
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
  $(document).on("click", ".closeEdit", function(e) {
    e.preventDefault();
    var modalToClose = $(this).parent();
    closeModal(modalToClose);
  });

  $(document).on("click", '.arrowContainer', function() {
    $(this).remove();
  });

  /*
    Handler for the add button on the Add a New Favorite menu
  */
  $(document).on("click", ".addBtn",  function(e){
    e.preventDefault();
    var titleVal = $("#inputTitle").val();
    var urlVal = $("#inputUrl").val();
    urlVal = addHttp(urlVal);
    var isValidURL = validateURL(urlVal);

    if(!isValidURL) {
      $("#addFormError").text("Please enter a valid URL").show();
    }
    var imageVal = $("#inputImage").val();
    imageVal = addHttp(imageVal);
    var isValidImgURL = validateURL(imageVal);
    if(!isValidImgURL) {
      $("#addFormError").text("Please enter a valid Image URL").show();
    }
    if(!isValidURL && !isValidImgURL) {
      $("#addFormError").text("Please enter a valid URL & Image URL").show();
    }
    if((titleVal !== "") && (urlVal !== "" && isValidURL) && (imageVal !== "" && isValidImgURL)){
      var newEntry = {
        "title" : titleVal,
        "url" : urlVal,
        "bgImg" : imageVal
      };
      saveFavorite(newEntry);

      if ($(".modal").length !== null) {
        closeModal($(".modal"));
      }
      $("#addFormError").hide();
    }
    else {
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


  $(document).on("click", ".updateBtn", function() {
    var newImageURL = $("input[name=themeBGImage]").val();
    var isValidURL = validateURL(newImageURL);
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
    if (this.value == 'light') {
      $("body, .modal").css("background", "white");
      $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color", "black");
      $(".favorite").css("border", "1.5px solid black");
      $(".favorite i, .popFav").css("color", "white");

    }
    else if (this.value == 'dark') {
      $("body, .modal").css("background", "#3c3c3c");
      $("*").not(".bgURLError").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".favorite").css("border", "1.5px solid #d4d6e9");

    }
  });


  $(document).on("change", ".hoverOption", function() {
    var hoverSelected = $(this).val();
    switch(hoverSelected) {

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
  $(document).on("change", ".fontOption", function() {
    // console.log($(this).val());
    var fontSelected = $(this).val();
    var newFontStack;
    switch(fontSelected) {
      case "Montserrat":
      newFontStack = "Montserrat";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "BebasNeue":
      newFontStack = "BebasNeue";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "Roboto Mono":
      newFontStack = "Roboto Mono";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "Raleway":
      newFontStack = "Raleway";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "Pridi":
      newFontStack = "Pridi";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "Work Sans":
      newFontStack = "Work Sans";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "Mitr":
      newFontStack = "Mitr";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
      case "Museo Sans":
      newFontStack = "MuseoSans";
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
      break;
    }
  });

  /*
    Handlers for edit mode options on each of the favorites
  */
  $(document).on("click", ".optDel", function(e) {
    e.preventDefault();
    var favorite = $(this).parent();
    var linkToDelete = favorite.attr("href");
    deleteFavorite(linkToDelete);
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


function deleteFavorite(delUrl) {
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if(savedFavorites !== null){
  savedFavorites.forEach(function(item, index) {
    if(item.url === delUrl) {
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
    if(savedFavorites !== null){
    savedItems = savedFavorites;
    savedItems.forEach(function(item) {
      addFavorite(item.title, item.url, item.bgImg);
    });
    }
}

function loadPopularFavorites() {
  var popFavs = getPopularFavorites();
  popFavs.then(function(res) {
    var response = JSON.parse(res);
    createPopularFavs(response);
  });
}
function loadDefaultFavorites() {
  var popFavs = getPromise("/newtab/defaultFavs.json");
  popFavs.then(function(res) {
    var response = JSON.parse(res);
    createDefaultFavs(response);
  });
}

function createDefaultFavs(favorites) {
  var list = favorites.default_favorites;
  // console.log(list);
  for(var i = 0; i < list.length; i++){
    var entry = {
      "title" : list[i].title,
      "url" : list[i].url,
      "bgImg" : list[i].bgImg,
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
  for(var i = 0; i < list.length; i++){
    if(savedFavorites !== null){
    match = $.grep(savedFavorites, function(e) {
      return e.url === list[i].url;
    });
    }
    // var popularFav = {
    //   "title" : list[i].title,
    //   "url" : list[i].url,
    //   "bgImg" : list[i].bgImg
    // };

    if(match.length === 0){
      var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg +">" + list[i].title + "</a>";
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
  $(".favorite").children().hide();
}


// Save favorite to local storage
function saveFavorite(entry) {
  var currentSaved = [];
  var savedFavorites = NTInstance.getSetting("savedFavorites", null);
  if(savedFavorites !== null){
    currentSaved = savedFavorites;
  }
  currentSaved.push(entry);
  NTInstance.setSetting("savedFavorites" , currentSaved);
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
  if(url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/) === null){
    return false;
  }
  else return true;
}

function addHttp(url) {
  var newUrl;
  if(url.match(/^(https?:\/\/)/) === null){
    var addHttp = "http://";
    newUrl = addHttp.concat(url);
    return newUrl;
  }

  return url;
}

function loadUserSettings() {
  var userTheme = NTInstance.getSetting("userTheme", "light");
  var userFont = NTInstance.getSetting("userFont", "Work Sans");
  var userHover = NTInstance.getSetting("userHover", "hoverPop");
  var userBGImg = NTInstance.getSetting("userThemeBG", null);
  NTInstance.currentSettings = {
    "theme" : userTheme,
    "font" : userFont,
    "hover" : userHover,
    "background" : userBGImg
  };
  // console.log(NTInstance.currentSettings);
}
function setUserSettings(settings) {
  if (settings.theme == 'light') {
    $("body, .modal").css("background", "white");
    $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color", "black");
    $(".favorite").css("border", "1.5px solid black");
    $(".favorite i, .popFav").css("color", "white");
  }
  else if (settings.theme == 'dark') {
    $("body, .modal").css("background", "#3c3c3c");
    $("*").not(".bgURLError").css("color", "white");
    $("input, select, option").css("color", "black");
    $(".favorite").css("border", "1.5px solid #d4d6e9");
  }
  $("*").not("i").css("font-family", settings.font);
  $("select.fontOption").val(settings.font);
  $("select.hoverOption").val(settings.hover);
  var radios = $("input[name=theme-select]");
  $(radios).each(function(i, el) {
    if($(el).val() === settings.theme)
      $(el).attr("checked", "checked");
  });

  if(settings.background !== null) {
    $("body").css("background-image", "url(" + settings.background +")");
    $("input[name=themeBGImage]").val(settings.background);
  }

}
// TO-DO: Could probably be implemented better
function showInitialLoad() {
  var $onboarding = $(".onboardingModal");
  var temp = $onboarding.html();
  $onboarding.html("<img class='onboardLoad' src='/newtab/images/cubeload.svg'/><p class='onboardGreeting'>Setting up DashTab</p>");
  setTimeout(function() {
    $onboarding.children().fadeOut("slow");
  }, 3000);
  setTimeout(function() {
    $onboarding.html("<img class='onboardLoad' src='/newtab/images/logo.jpg'/ alt='Dashtab Logo'><p class='onboardGreeting'>Welcome to DashTab!</p>");
  }, 3500);
  setTimeout(function() {
    $(".onboardGreeting, .onboardLoad").fadeOut("slow");
    // $onboarding.html(temp).children(".modalWrapper").hide();
    // $(".modalWrapper").fadeOut("slow");
  }, 6000);
  setTimeout(function() {
    // $(".onboardGreeting, .onboardLoad").fadeOut("slow");
    $onboarding.html(temp).children(".modalWrapper").hide();
    // $(".modalWrapper").fadeOut("slow");
  }, 6500);
  setTimeout(function() {
    $(".modalWrapper").fadeIn("slow");
    // $(".onboardGreeting").fadeOut("slow");
  }, 7000);
}

function buildCalendar() {

var tr = document.createElement("tr");
// Row for day letters
for(var c = 0; c <= 6; c++) {
  var td = document.createElement("td");
  var daysOfTheWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  td.innerHTML = daysOfTheWeek[c];
  tr.appendChild(td);
}
table.appendChild(tr);

// Row for blank spaces
tr = document.createElement("tr");
for(c = 0;c <= 6; c++) {
  if(c === day_no) {
    break;
  }
  var td = document.createElement("td");
  td.innerHTML = "";
  tr.appendChild(td);
}

// Start counting days of the month
var count = 1;
for(; c <=6; c++) {
  // console.log(c);
  var td = document.createElement("td");

  td.innerHTML = "<span>" + count + "</span>";
  //console.log(count, today);
  if(count === today){
    td.classList.add("currentDay");
  }

  count++;
  tr.appendChild(td);
}
table.appendChild(tr);

// rest of the date rows
for(var r=3; r<= 6; r++) {
  tr = document.createElement("tr");
  for(var c = 0; c <= 6;c++) {
    if(count > days) {
      table.appendChild(tr);
      return table;
    }
    var td = document.createElement("td");
    td.innerHTML = "<span>" + count + "</span>";
    if(count === today){
      td.classList.add("currentDay");
    }
    count++;
    tr.appendChild(td);
  }
  table.appendChild(tr);
}
}
