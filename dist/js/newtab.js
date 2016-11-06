"use strict";

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    // Prompt user for image to use for bookmark
    // and also the url.  Append to favorites
    var triggerModal = function triggerModal(modal) {
      $('.lightbox').fadeIn();
      // modal.fadeIn();
      modal.animate({
        "right": "0px"
      }, 400, "swing");
    };

    var closeModal = function closeModal(modal) {
      $('.lightbox').fadeOut();
      // modal.fadeOut();
      modal.animate({
        "right": "-400px"
      }, 300, "swing");
    };

    var triggerEditMode = function triggerEditMode() {
      $("#favorites").sortable("enable");
    };

    var processEditedList = function processEditedList(NTInstance) {
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
    };

    var loadUserSettings = function loadUserSettings(NTInstance) {
      var userTheme = NTInstance.getSetting("userTheme", "light");
      var userFont = NTInstance.getSetting("userFont", "Work Sans");
      var userHover = NTInstance.getSetting("userHover", "hoverPop");
      var userBGImg = NTInstance.getSetting("userThemeBG", null);
      var userFaveSize = NTInstance.getSetting("userFaveSize", "80");
      var userBGStyle = NTInstance.getSetting("userBGStyle", "repeat");
      NTInstance.currentSettings = {
        "theme": userTheme,
        "font": userFont,
        "hover": userHover,
        "background": userBGImg,
        "faveSize": userFaveSize,
        "bgStyle": userBGStyle
      };
      // console.log(NTInstance.currentSettings);
    };
    var setUserSettings = function setUserSettings(settings) {
      var cardSizeStr = settings.faveSize + "px " + (parseInt(settings.faveSize) + 40) + "px";

      // Set Theme Styles
      if (settings.theme === 'light') {
        $("body, .modal").css("background", "white");
        $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color", "black");
        $(".favorite").css({
          "border": "1.5px solid black",
          "padding": cardSizeStr,
          "transition": "0.3s transform, 0.3s margin"
        });
        $(".favorite i, .popFav").css("color", "white");
      } else if (settings.theme === 'dark') {
        $("body, .modal").css("background", "#3c3c3c");
        $("*").not(".bgURLError").css("color", "white");
        $("input, select, option").css("color", "black");
        $(".favorite").css({
          "border": "1.5px solid #d4d6e9",
          "padding": cardSizeStr,
          "transition": "0.3s transform, 0.3s margin"
        });
      } else if (settings.theme === "fade") {
        $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
        $("*").not(".bgURLError").css("color", "white");
        $("input, select, option").css("color", "black");
        $(".headerPanel").css("border", "none");
        $(".favorite").css({
          "padding": cardSizeStr,
          "transition": "0.3s transform, 0.3s margin"
        });
      }
      // Set BG Image Style
      if (settings.bgStyle === "cover") {
        $("body").css("background-size", settings.bgStyle);
      } else {
        $("body").css("background-repeat", settings.bgStyle);
        $("body").css("background-size", "auto");
      }
      // Set Font
      $("*").not("i").css("font-family", settings.font);

      var radios = $("input[name=theme-select]");
      $(radios).each(function (i, el) {
        if ($(el).val() === settings.theme) $(el).attr("checked", "checked");
      });
      // Set Background
      if (settings.background !== null) {
        $("body").css("background-image", "url(" + settings.background + ")");
        $("input[name=themeBGImage]").val(settings.background);
      }
      // Set Settings Options to their saved values
      $(".themeBGImageRepeat").val(settings.bgStyle);
      $(".favoriteSize").val(settings.faveSize);
      $("select.fontOption").val(settings.font);
      $("select.hoverOption").val(settings.hover);
    };

    // TO-DO: Could probably be implemented better
    var showInitialLoad = function showInitialLoad() {
      var $onboarding = $(".onboardingModal");
      var temp = $onboarding.html();
      // $onboarding.html("<img class='onboardLoad' src='/newtab/images/cubeload.svg'/><p class='onboardGreeting'>Setting up DashTab</p>");
      // setTimeout(function() {
      //   $onboarding.children().fadeOut("slow");
      // }, 3000);
      // setTimeout(function() {
      //   $onboarding.html("<img class='onboardLoad' src='/newtab/images/logo.jpg'/ alt='Dashtab Logo'><p class='onboardGreeting'>Welcome to DashTab!</p>");
      // }, 3500);
      // setTimeout(function() {
      //   $(".onboardGreeting, .onboardLoad").fadeOut("slow");
      //   // $onboarding.html(temp).children(".modalWrapper").hide();
      //   // $(".modalWrapper").fadeOut("slow");
      // }, 6000);
      // setTimeout(function() {
      //   // $(".onboardGreeting, .onboardLoad").fadeOut("slow");
      //   $onboarding.html(temp).children(".modalWrapper").hide();
      //   // $(".modalWrapper").fadeOut("slow");
      // }, 6500);
      // setTimeout(function() {
      //   $(".modalWrapper").fadeIn("slow");
      //   // $(".onboardGreeting").fadeOut("slow");
      // }, 7000);
    };

    var setFont = function setFont(fontName, NTInstance) {
      var newFontStack = fontName;
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
    };

    var setHover = function setHover(hoverName, NTInstance) {
      NTInstance.setSetting("userHover", hoverName);
      switch (hoverName) {

        case "hoverPop":
          $(".favorite").addClass("hoverPop").removeClass("hoverNone hoverHighlight");
          break;

        case "hoverHighlight":
          $(".favorite").addClass("hoverHighlight").removeClass("hoverNone hoverPop");
          break;

        case "hoverNone":
          $(".favorite").addClass("hoverNone").removeClass("hoverPop hoverHighlight");
          break;
      }
      //$(".favorite").addClass(hoverName).removeClass("hoverNone hoverHighlight");
    };

    var setSize = function setSize(sizeVal, NTInstance) {
      NTInstance.setSetting("userFaveSize", sizeVal);
      var cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
      $(".favorite").css({
        "padding": cardSizeStr,
        "transition": "0.4s padding, 0.3s transform, 0.3s margin"
      });
    };
    var setBGStyle = function setBGStyle(styleVal, NTInstance) {
      NTInstance.setSetting("userBGStyle", styleVal);
      if (styleVal === "cover") {
        $("body").css("background-size", styleVal);
      } else {
        $("body").css("background-repeat", styleVal);
        $("body").css("background-size", "auto");
      }
      // let cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
    };
    module.exports = {
      triggerModal: triggerModal,
      closeModal: closeModal,
      triggerEditMode: triggerEditMode,
      processEditedList: processEditedList,
      loadUserSettings: loadUserSettings,
      setUserSettings: setUserSettings,
      showInitialLoad: showInitialLoad,
      setFont: setFont,
      setHover: setHover,
      setSize: setSize,
      setBGStyle: setBGStyle
    };
  }, {}], 2: [function (require, module, exports) {
    // Calendar
    var d = new Date();
    var month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var month = d.getMonth(); // 0 - 11
    var year = d.getFullYear(); // 2016
    var today = d.getDate(); // 23

    // January 1 2016
    var first_date = month_name[month] + " " + 1 + " " + year;

    // Sun January 1 2016
    var tmp = new Date(first_date).toDateString();
    // Sun
    var first_day = tmp.substring(0, 3);
    var day_name = ['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"];
    // [0]
    var day_no = day_name.indexOf(first_day);
    var days = new Date(year, month + 1, 0).getDate();
    var table = document.createElement("table");
    var theCalendar = void 0;

    var tr = document.createElement("tr");
    function buildCalendar() {

      // Row for day labels
      for (var c = 0; c < 7; c++) {
        var td = document.createElement("td");
        var daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        td.innerHTML = daysOfTheWeek[c];
        tr.appendChild(td);
      }
      table.appendChild(tr);

      // Row for blank spaces
      tr = document.createElement("tr");
      for (c = 0; c < 7; c++) {
        if (c === day_no) {
          break;
        }
        var td = document.createElement("td");
        td.innerHTML = "";
        tr.appendChild(td);
      }

      // Start counting days of the month
      var count = 1;
      console.log(c);
      for (; c < 7; c++) {
        var td = document.createElement("td");

        td.innerHTML = "<span>" + count + "</span>";
        console.log(count, today);
        if (count === today) {
          td.classList.add("currentDay");
        }

        count++;
        tr.appendChild(td);
      }
      table.appendChild(tr);

      // rest of the date rows
      for (var r = 2; r < 7; r++) {

        tr = document.createElement("tr");
        for (c = 0; c < 7; c++) {
          if (count > days) {
            table.appendChild(tr);
            return table;
            //console.log("theCalendar: " + theCalendar);
          }
          var td = document.createElement("td");
          td.innerHTML = "<span>" + count + "</span>";
          if (count === today) {
            td.classList.add("currentDay");
          }
          count++;
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
    }

    theCalendar = buildCalendar();
    module.exports = {
      theCalendar: theCalendar,
      month_name: month_name,
      month: month,
      year: year
    };
  }, {}], 3: [function (require, module, exports) {
    var Util = require("./util.js");
    // let NTInstance;
    // let init = function(NT) {
    //   NTInstance = NT;
    // };
    // Add a new favorite to the favorites grid
    var addFavorite = function addFavorite(title, url, imageUrl, NTInstance) {
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
    var saveFavorite = function saveFavorite(entry, NTInstance) {
      var currentSaved = [];
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);
      if (savedFavorites !== null) {
        currentSaved = savedFavorites;
      }
      currentSaved.push(entry);
      NTInstance.setSetting("savedFavorites", currentSaved);
      addFavorite(entry.title, entry.url, entry.bgImg, NTInstance);
      $("#inputUrl").val("");
      $("#inputImage").val("");
    };

    var getPopularFavorites = function getPopularFavorites() {
      return $.ajax({
        url: "./popularFavs.json",
        method: "GET"
      });
    };

    var deleteFavorite = function deleteFavorite(delUrl, NTInstance) {
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
    var loadSavedFavorites = function loadSavedFavorites(NTInstance) {
      var savedItems = [];
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);
      if (savedFavorites !== null) {
        savedItems = savedFavorites;
        savedItems.forEach(function (item) {
          addFavorite(item.title, item.url, item.bgImg, NTInstance);
        });
      }
    };

    var loadPopularFavorites = function loadPopularFavorites(NTInstance) {
      var popFavs = getPopularFavorites();
      popFavs.then(function (res) {
        var response = JSON.parse(res);
        createPopularFavs(response, NTInstance);
      });
    };
    var loadDefaultFavorites = function loadDefaultFavorites(NTInstance) {
      var popFavs = Util.getPromise("/newtab/defaultFavs.json");
      popFavs.then(function (res) {
        var response = JSON.parse(res);
        createDefaultFavs(response, NTInstance);
      });
    };

    var createDefaultFavs = function createDefaultFavs(favorites, NTInstance) {
      var list = favorites.default_favorites;
      // console.log(list);
      for (var i = 0; i < list.length; i++) {
        var entry = {
          "title": list[i].title,
          "url": list[i].url,
          "bgImg": list[i].bgImg
        };
        // console.log(entry);
        saveFavorite(entry, NTInstance);
      }
    };

    var createPopularFavs = function createPopularFavs(favorites, NTInstance) {
      // console.log(NTInstance, favorites);
      var list = favorites.popular_favorites;
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);
      // console.log("saved", savedFavorites, "list", list);
      var match = [];
      //console.log(NTInstance);
      for (var i = 0; i < list.length; i++) {
        if (savedFavorites !== null) {
          match = savedFavorites.filter(function (el) {
            // console.log("curr", el.url, "list", list[i].url);
            return el.url === list[i].url;
          });
          // console.log(match);
        }

        if (match.length === 0) {
          var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg + ">" + list[i].title + "</a>";
          $(".popularFavs").append(favHTML);
        }
      }
    };

    module.exports = {

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
  }, { "./util.js": 5 }], 4: [function (require, module, exports) {
    // import $ from "jquery";
    var background = chrome.extension.getBackgroundPage();
    var NTInstance = background.NTInstance;
    NTInstance.editing = false;
    NTInstance.currentSettings = {
      "theme": "light",
      "font": "Work Sans",
      "hover": "hoverPop",
      "background": null,
      "faveSize": "80"
    };

    chrome.storage.local.get(function (res) {
      console.log(res);
    });

    console.log(NTInstance.getSetting("savedFavorites"));

    var Actions = require("./actions.js");
    var Calendar = require("./createCalendar.js");
    var Favorites = require("./favorites.js");
    var Util = require("./util.js");

    $(document).ready(function () {

      Actions.loadUserSettings(NTInstance);
      Favorites.loadSavedFavorites(NTInstance);
      Favorites.loadPopularFavorites(NTInstance);
      Actions.setUserSettings(NTInstance.currentSettings);
      var calendar = Calendar.theCalendar;
      // console.log(Calendar);
      $(".calendar-head").html("<span>" + Calendar.month_name[Calendar.month] + " " + Calendar.year + "</span");
      $(".calendar").append(calendar);
      $("#favorites").sortable();
      $("#favorites").sortable("disable");

      chrome.runtime.sendMessage({ task: "checkFirstRun" }, function (res) {
        if (res.firstRun) {
          // Actions.showInitialLoad();
          Favorites.loadDefaultFavorites(NTInstance);
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
            if ($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
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
            if (NTInstance.editing) {
              Actions.triggerEditMode();
            } else {
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
        Favorites.saveFavorite(newEntry, NTInstance);
        $(this).remove();
        var allPopFavs = $(".popularFavs").children();
        var popArr = [].slice.call(allPopFavs, 0);
        var match = popArr.filter(function (el) {
          return $(el).data("url") === urltoAdd;
        });
        $(match).hide();
        console.log($(".addModal .popularFavs").children().length, $(".onboardingModal .popularFavs").children().length);
        if ($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
          // console.log(one);
          $(".addExtra, .popularFavs").hide();
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
          $(".addFormError").css("color", "red");
          $(".addFormError").text("Please enter a valid URL").show();
        }
        var imageVal = $("#inputImage").val();
        imageVal = Util.addHttp(imageVal);
        var isValidImgURL = Util.validateURL(imageVal);
        if (!isValidImgURL) {
          $(".addFormError").text("Please enter a valid Image URL").show();
        }
        if (!isValidURL && !isValidImgURL) {
          $(".addFormError").text("Please enter a valid URL & Image URL").show();
        }
        if (titleVal !== "" && urlVal !== "" && isValidURL && imageVal !== "" && isValidImgURL) {
          var newEntry = {
            "title": titleVal,
            "url": urlVal,
            "bgImg": imageVal
          };
          Favorites.saveFavorite(newEntry, NTInstance);

          if ($(".modal").length !== null) {
            Actions.closeModal($(".modal"));
          }
          $(".addFormError").hide();
        } else {
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
        if (this.value === 'light') {
          $("body, .modal").css("background", "white");
          $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span, .addFormError").css("color", "black");
          $(".favorite").css("border", "1.5px solid black");
          $(".favorite i, .popFav").css("color", "white");
        } else if (this.value === 'dark') {
          $("body, .modal").css("background", "#3c3c3c");
          $("*").not(".bgURLError").css("color", "white");
          $("input, select, option").css("color", "black");
          $(".favorite").css("border", "1.5px solid #d4d6e9");
        } else if (this.value === "fade") {
          $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
          $("*").not(".bgURLError").css("color", "white");
          $("input, select, option").css("color", "black");
          $(".headerPanel").css("border", "none");
        }
      });

      $(document).on("change", ".hoverOption", function () {
        var hoverSelected = $(this).val();
        Actions.setHover(hoverSelected, NTInstance);
      });
      $(document).on("change", ".fontOption", function () {
        var fontSelected = $(this).val();
        Actions.setFont(fontSelected, NTInstance);
      });
      $(document).on("change", ".favoriteSize", function () {
        var sizeSelected = $(this).val();
        Actions.setSize(sizeSelected, NTInstance);
      });
      $(document).on("change", ".themeBGImageRepeat", function () {
        var bgStyleSelected = $(this).val();
        Actions.setBGStyle(bgStyleSelected, NTInstance);
      });
      /*
        Handlers for edit mode options on each of the favorites
      */
      $(document).on("click", ".optDel", function (e) {
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
      $(document).on("click", ".favorite", function (e) {
        if ($(this).hasClass("editing")) e.preventDefault();
      });
    });
  }, { "./actions.js": 1, "./createCalendar.js": 2, "./favorites.js": 3, "./util.js": 5 }], 5: [function (require, module, exports) {
    var getPromise = function getPromise(url) {
      return $.ajax({
        url: url,
        method: "GET"
      });
    };

    var validateURL = function validateURL(url) {
      // var regex = "";
      // console.log(typeof regex, url.match(regex));
      if (url.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \&\.\-]*)*\/?/) === null) {
        return false;
      } else return true;
    };

    var addHttp = function addHttp(url) {
      var newUrl;
      if (url.match(/^(https?:\/\/)/) === null) {
        var addHttp = "http://";
        newUrl = addHttp.concat(url);
        return newUrl;
      }

      return url;
    };

    module.exports = {
      getPromise: getPromise,
      validateURL: validateURL,
      addHttp: addHttp
    };
  }, {}] }, {}, [4]);
//# sourceMappingURL=newtab.js.map
