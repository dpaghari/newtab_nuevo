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
    // const $ = require("jquery");

    // Prompt user for image to use for bookmark
    // and also the url.  Append to favorites
    function triggerModal(modal) {
      $('.lightbox').fadeIn();
      // modal.fadeIn();
      modal.animate({
        "right": "0px"
      }, 400, "swing");
    }

    function closeModal(modal) {
      $('.lightbox').fadeOut();
      // modal.fadeOut();
      modal.animate({
        "right": "-400px"
      }, 300, "swing");
    }

    function triggerEditMode() {
      $("#favorites").sortable("enable");
    }

    function loadUserSettings(NTInstance) {
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
    }
    function setUserSettings(settings) {
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
    }

    function setFont(fontName, NTInstance) {
      var newFontStack = fontName;
      NTInstance.setSetting("userFont", newFontStack);
      $("*").not("i").css("font-family", newFontStack);
    }

    function setHover(hoverName, NTInstance) {
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
    }

    function setSize(sizeVal, NTInstance) {
      NTInstance.setSetting("userFaveSize", sizeVal);
      var cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
      $(".favorite").css({
        "padding": cardSizeStr,
        "transition": "0.4s padding, 0.3s transform, 0.3s margin"
      });
    }
    function setBGStyle(styleVal, NTInstance) {
      NTInstance.setSetting("userBGStyle", styleVal);
      if (styleVal === "cover") {
        $("body").css("background-size", styleVal);
      } else {
        $("body").css("background-repeat", styleVal);
        $("body").css("background-size", "auto");
      }
      // let cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
    }

    module.exports = {
      triggerModal: triggerModal,
      closeModal: closeModal,
      triggerEditMode: triggerEditMode,
      loadUserSettings: loadUserSettings,
      setUserSettings: setUserSettings,
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

      for (; c < 7; c++) {
        var td = document.createElement("td");

        td.innerHTML = "<span>" + count + "</span>";
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
    var ActionsManager = require("./actions.js");
    // const $ = require("jquery");
    // let NTInstance;
    // let init = function(NT) {
    //   NTInstance = NT;
    // };
    // Add a new favorite to the favorites grid
    function addFavorite(title, url, imageUrl, NTInstance) {
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
      var savedFaveSize = NTInstance.getSetting("userFaveSize", "60");
      ActionsManager.setSize(savedFaveSize, NTInstance);
      $(".favorite").children().hide();
    }

    // Save favorite to local storage
    function saveFavorite(entry, NTInstance) {
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
    }

    function getPopularFavorites() {
      return $.ajax({
        url: "./popularFavs.json",
        method: "GET"
      });
    }

    function deleteFavorite(delUrl, NTInstance) {
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);
      if (savedFavorites !== null) {
        var filteredFavorites = savedFavorites.filter(function (item) {
          if (item.url !== delUrl) return true;
        });
        NTInstance.setSetting("savedFavorites", filteredFavorites);
      }
    }

    // Load saved favorites onload
    function loadSavedFavorites(NTInstance) {
      var savedItems = [];
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);
      if (savedFavorites !== null) {
        savedItems = savedFavorites;
        savedItems.forEach(function (item) {
          addFavorite(item.title, item.url, item.bgImg, NTInstance);
        });
      }
    }

    function loadPopularFavorites(NTInstance) {
      var popFavs = getPopularFavorites();
      popFavs.then(function (res) {
        var response = JSON.parse(res);
        createPopularFavs(response, NTInstance);
      });
    }
    function loadDefaultFavorites(NTInstance) {
      var popFavs = Util.getPromise("/newtab/defaultFavs.json");
      popFavs.then(function (res) {
        var response = JSON.parse(res);
        createDefaultFavs(response, NTInstance);
      });
    }

    function createDefaultFavs(favorites, NTInstance) {
      var list = favorites.default_favorites;

      for (var i = 0; i < list.length; i++) {
        var entry = {
          "title": list[i].title,
          "url": list[i].url,
          "bgImg": list[i].bgImg
        };
        saveFavorite(entry, NTInstance);
      }
    }

    function createPopularFavs(favorites, NTInstance) {

      var list = favorites.popular_favorites;
      var savedFavorites = NTInstance.getSetting("savedFavorites", null);

      var match = [];

      for (var i = 0; i < list.length; i++) {
        if (savedFavorites !== null) {
          match = savedFavorites.filter(function (el) {
            return el.url === list[i].url;
          });
        }

        if (match.length === 0) {
          var favHTML = "<a href='#' class='popFav' data-title=" + list[i].title + " data-url=" + list[i].url + " data-imgurl=" + list[i].bgImg + ">" + list[i].title + "</a>";
          $(".popularFavs").append(favHTML);
        }
      }
    }

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
  }, { "./actions.js": 1, "./util.js": 6 }], 4: [function (require, module, exports) {

    // const $ = require("jquery");

    var background = chrome.extension.getBackgroundPage();
    var NTInstance = background.NTInstance;
    NTInstance.editing = false;
    NTInstance.currentSettings = {
      "theme": "light",
      "font": "Work Sans",
      "hover": "hoverPop",
      "background": null,
      "faveSize": "60"
    };

    chrome.storage.local.get(function (res) {
      console.log(res);
    });

    var ActionsManager = require("./actions.js");
    var Calendar = require("./createCalendar.js");
    var FavoritesManager = require("./favorites.js");
    var Util = require("./util.js");
    var Todos = require("./todos.js");

    $(document).ready(function () {

      ActionsManager.loadUserSettings(NTInstance);
      FavoritesManager.loadSavedFavorites(NTInstance);
      FavoritesManager.loadPopularFavorites(NTInstance);
      ActionsManager.setUserSettings(NTInstance.currentSettings);
      var calendar = Calendar.theCalendar;
      // console.log(Calendar);
      $(".calendar-head").html("<span>" + Calendar.month_name[Calendar.month] + " " + Calendar.year + "</span");
      $(".calendar").append(calendar);
      $("#favorites").sortable();
      $("#favorites").sortable("disable");

      chrome.runtime.sendMessage({ task: "checkFirstRun" }, function (res) {
        if (res.firstRun) {
          // ActionsManager.showInitialLoad();
          FavoritesManager.loadDefaultFavorites(NTInstance);
          ActionsManager.triggerModal($(".onboardingModal"));
          $("#obInputTitle").focus();
        } else {
          var savedTodos;

          (function () {
            var $todoList = $(".todos");
            savedTodos = Todos.getSavedTodos();

            savedTodos.forEach(function (el, idx) {
              Todos.addNewTodoToDOM(el, $todoList);
            });
          })();
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

        switch (clickElement) {
          case "addFavorite":
            if ($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
              $(".addExtra").hide();
            }
            var modalToOpen = $(".addModal");
            ActionsManager.triggerModal(modalToOpen);
            $("#inputTitle").focus();
            break;

          case 'editMode':
            e.preventDefault();
            $(".favorite").toggleClass("editing");
            $(".favorite").children().toggle();
            if (!NTInstance.editing) {
              NTInstance.editing = !NTInstance.editing;
              ActionsManager.triggerEditMode();
            } else {
              (function () {
                $("#favorites").sortable("disable");
                var newFaves = [].slice.call($(".favorite"), 0);
                var reorderedFaves = [];
                newFaves.forEach(function (el) {
                  var _el$dataset = el.dataset,
                      title = _el$dataset.title,
                      bgImg = _el$dataset.bgImg;

                  var newFave = {
                    "title": title,
                    "url": el.href,
                    "bgImg": bgImg
                  };
                  reorderedFaves.push(newFave);
                });

                NTInstance.setSetting("savedFavorites", reorderedFaves);
              })();
            }
            break;

          case 'openSettings':
            e.preventDefault();
            var settingsModal = $(".settingsModal");
            ActionsManager.triggerModal(settingsModal);

            break;

          case 'openOnboarding':
            e.preventDefault();
            var onBoardingModal = $(".onboardingModal");
            ActionsManager.triggerModal(onBoardingModal);
            break;

          case 'openCalendar':
            e.preventDefault();
            var calendarModal = $(".calendarModal");
            ActionsManager.triggerModal(calendarModal);
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
        FavoritesManager.saveFavorite(newEntry, NTInstance);
        $(this).remove();
        var allPopFavs = $(".popularFavs").children();
        var popArr = [].slice.call(allPopFavs, 0);
        var match = popArr.filter(function (el) {
          return $(el).data("url") === urltoAdd;
        });
        $(match).hide();
        if ($(".addModal .popularFavs").children().length === 0 || $(".onboardingModal .popularFavs").children().length === 0) {
          $(".addExtra, .popularFavs").hide();
        }
      });
      /*
        Handler for close button
      */
      $(document).on("click", ".closeBtn", function (e) {
        e.preventDefault();
        var modalToClose = $(this).closest(".modal");
        ActionsManager.closeModal(modalToClose);
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
          FavoritesManager.saveFavorite(newEntry, NTInstance);

          if ($(".modal").length !== null) {
            ActionsManager.closeModal($(".modal"));
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
        ActionsManager.setHover(hoverSelected, NTInstance);
      });
      $(document).on("change", ".fontOption", function () {
        var fontSelected = $(this).val();
        ActionsManager.setFont(fontSelected, NTInstance);
      });
      $(document).on("change", ".favoriteSize", function () {
        var sizeSelected = $(this).val();
        ActionsManager.setSize(sizeSelected, NTInstance);
      });
      $(document).on("change", ".themeBGImageRepeat", function () {
        var bgStyleSelected = $(this).val();
        ActionsManager.setBGStyle(bgStyleSelected, NTInstance);
      });
      /*
        Handlers for edit mode options on each of the favorites
      */
      $(document).on("click", ".optDel", function (e) {
        e.preventDefault();

        var linkToDelete = $(this).parent().attr("href");
        console.log(linkToDelete);
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
      $(document).on("click", ".favorite", function (e) {
        if ($(this).hasClass("editing")) e.preventDefault();
      });

      $(".todoForm").on("submit", function (e) {
        e.preventDefault();
        var $todoList = $(".todos");
        var $newTodo = $(".newTodo").val();
        Todos.addNewTodoToDOM({ "item": $newTodo, "isDone": false }, $todoList);
        Todos.saveTodo($newTodo);
        $(".newTodo").val("");
      });
      $(document).on("click", ".addTodo", function () {
        $(".todoForm").submit();
      });
      $(document).on("click", ".todoItem", function () {
        $(this).toggleClass("complete");
        var childCheckbox = $(this).find("input[type='checkbox']");
        if ($(this).hasClass("complete")) childCheckbox.prop("checked", true);else childCheckbox.prop("checked", false);

        Todos.saveTodoList();
      });
    });
  }, { "./actions.js": 1, "./createCalendar.js": 2, "./favorites.js": 3, "./todos.js": 5, "./util.js": 6 }], 5: [function (require, module, exports) {
    var Util = require("./util.js");

    function addNewTodoToDOM(todo, location) {
      var item = todo.item,
          isDone = todo.isDone;

      var isChecked = isDone ? "checked" : "";
      var complete = isDone ? "complete" : "";
      var todoHTML = "<li class=\"todoItem " + complete + "\"><input type=\"checkbox\" " + isChecked + "/><span>" + item + "</span></li>";
      $(location).append(todoHTML);
    }

    function saveTodo(todo) {
      var newTodoItem = {
        item: todo,
        isDone: false
      };
      var existingTodos = Util.getBrowserSetting("todos", []);
      existingTodos.push(newTodoItem);
      Util.setBrowserSetting("todos", existingTodos);
    }

    function getSavedTodos() {
      var savedTodos = Util.getBrowserSetting("todos", []);
      return savedTodos;
    }

    function saveTodoList() {
      var currentTodos = [].slice.call($("li.todoItem"));
      var updatedTodos = [];
      currentTodos.forEach(function (el) {
        var todoEntry = {
          "item": $(el).find("span").text(),
          "isDone": $(el).find("input").prop("checked")
        };
        updatedTodos.push(todoEntry);
      });
      console.log(updatedTodos);
      Util.setBrowserSetting("todos", updatedTodos);
    }

    module.exports = {
      addNewTodoToDOM: addNewTodoToDOM,
      saveTodo: saveTodo,
      getSavedTodos: getSavedTodos,
      saveTodoList: saveTodoList
    };
  }, { "./util.js": 6 }], 6: [function (require, module, exports) {
    // const $ = require("jquery");
    module.exports = {
      getCookie: getCookie,
      compareLists: compareLists,
      getPromise: getPromise,
      getCurrentTime: getCurrentTime,
      getParameterByName: getParameterByName,
      getBrowser: getBrowser,
      getBrowserSetting: getBrowserSetting,
      setBrowserSetting: setBrowserSetting,
      jsonp: jsonp,
      validateURL: validateURL,
      addHttp: addHttp
    };

    // Check if two lists are equal
    function compareLists(list1, list2) {
      // If they aren't the same length
      if (list1.length !== list2.length) return false;
      for (var i = 0; i < list1.length; i++) {
        if (list2.indexOf(list1[i]) === -1) return false;
      }
      return true;
    }
    // Returns a promise object
    function getPromise(data) {
      return $.ajax(data);
    }

    // Returns the current time as a string like "5:30 pm"
    function getCurrentTime() {
      var currentTime = new Date().toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
      return currentTime.toLowerCase();
    }

    // Uses chrome api to retrieve cookie name and value
    function getCookie() {
      var cookieInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { domain: "", name: "" };


      if (cookieInfo.domain === "" && cookieInfo.name === "") return;

      var p = new Promise(function (resolve, reject) {
        // Gets Cookies
        if (getBrowser() === "chrome") {
          chrome.cookies.getAll(cookieInfo, function (res) {
            // If cookie exists pass value into exists callback
            if (res.length > 0 && typeof res[0].value !== 'undefined') {
              var catFromCookie = JSON.stringify([res[0].value]);
              resolve(catFromCookie);
              // if(typeof exists === "function") exists(catFromCookie);
            }
            // If it doesn't call absent() callback
            else {
                resolve("");
                // if(typeof absent === "function") absent();
              }
          });
        }
        // Requires to be on same domain
        else {
            var name = cookieInfo.name + "=";
            var ca = document.cookie.split(';');
            var val;
            for (var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                val = c.substring(name.length, c.length);
                resolve(val);
              }
            }
            val = "";
            resolve(val);
          }
      });

      return p;
    }

    function getParameterByName(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      if (match !== null) {
        if (typeof match[1] !== "undefined") return decodeURIComponent(match[1].replace(/\+/g, ' '));
      }
    }

    function getBrowser() {
      var ua = window.navigator.userAgent || "";
      if (ua.indexOf("Chrome") > -1) {
        if (ua.indexOf("Edge") == -1) {
          return "chrome";
        } else {
          return "other";
        }
      } else if (ua.indexOf("Firefox") > -1) {
        return "firefox";
      } else if (ua.indexOf("MSIE 8.0") > -1) {

        return "ie8";
      } else {

        // Any other browser logic
        return "other";
      }
    }

    function setBrowserSetting(name, value) {
      var browser = getBrowser();
      var background, NTInstance;
      if (browser === "chrome" && typeof chrome.extension.getBackgroundPage() !== "undefined") {
        // console.log("ayy", chrome.extension.getBackgroundPage());
        background = chrome.extension.getBackgroundPage();
        if (typeof background.NTInstance !== "undefined") {
          NTInstance = background.NTInstance;
          NTInstance.setSetting(name, value);
          // console.log(name, value);
        }
      } else {
        localStorage.setItem(name, value);
      }
    }
    function getBrowserSetting(name, defValue) {
      var background, NTInstance;
      var browser = getBrowser();
      var settingVal;
      if (browser === "chrome" && typeof chrome.extension.getBackgroundPage() !== "undefined") {
        background = chrome.extension.getBackgroundPage();

        if (typeof background.NTInstance !== "undefined") {
          NTInstance = background.NTInstance;
          settingVal = NTInstance.getSetting(name, defValue);
        }
      } else {
        settingVal = localStorage.getItem(name);
        if (settingVal === null) settingVal = defValue;
      }
      // console.log(name, defValue, settingVal);
      return settingVal;
    }

    function jsonp(url, callback) {
      var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      window[callbackName] = function (data) {
        delete window[callbackName];
        document.head.removeChild(script);
        callback(data);
      };

      var script = document.createElement('script');
      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
      document.head.appendChild(script);
    }

    function validateURL(url) {
      // var regex = "";
      // console.log(typeof regex, url.match(regex));
      if (url.match(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \&\.\-]*)*\/?/) === null) {
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
      return url;
    };
  }, {}] }, {}, [4]);
//# sourceMappingURL=newtab.js.map
