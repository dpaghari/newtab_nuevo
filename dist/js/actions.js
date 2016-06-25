'use strict';

// import $ from "jquery";
var NTInstance = void 0;
var init = function init(NT) {
  NTInstance = NT;
};
// Prompt user for image to use for bookmark
// and also the url.  Append to favorites
var triggerModal = function triggerModal(modal) {
  $('.lightbox').fadeIn();
  modal.fadeIn();
};

var closeModal = function closeModal(modal) {
  $('.lightbox').fadeOut();
  modal.fadeOut();
};

var triggerEditMode = function triggerEditMode() {
  $("#favorites").sortable("enable");
};

var processEditedList = function processEditedList() {
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

var loadUserSettings = function loadUserSettings() {
  var userTheme = NTInstance.getSetting("userTheme", "light");
  var userFont = NTInstance.getSetting("userFont", "Work Sans");
  var userHover = NTInstance.getSetting("userHover", "hoverPop");
  var userBGImg = NTInstance.getSetting("userThemeBG", null);
  NTInstance.currentSettings = {
    "theme": userTheme,
    "font": userFont,
    "hover": userHover,
    "background": userBGImg
  };
  // console.log(NTInstance.currentSettings);
};
var setUserSettings = function setUserSettings(settings) {
  if (settings.theme == 'light') {
    $("body, .modal").css("background", "white");
    $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color", "black");
    $(".favorite").css("border", "1.5px solid black");
    $(".favorite i, .popFav").css("color", "white");
  } else if (settings.theme == 'dark') {
    $("body, .modal").css("background", "#3c3c3c");
    $("*").not(".bgURLError").css("color", "white");
    $("input, select, option").css("color", "black");
    $(".favorite").css("border", "1.5px solid #d4d6e9");
  }
  $("*").not("i").css("font-family", settings.font);
  $("select.fontOption").val(settings.font);
  $("select.hoverOption").val(settings.hover);
  var radios = $("input[name=theme-select]");
  $(radios).each(function (i, el) {
    if ($(el).val() === settings.theme) $(el).attr("checked", "checked");
  });

  if (settings.background !== null) {
    $("body").css("background-image", "url(" + settings.background + ")");
    $("input[name=themeBGImage]").val(settings.background);
  }
};

// TO-DO: Could probably be implemented better
var showInitialLoad = function showInitialLoad() {
  var $onboarding = $(".onboardingModal");
  var temp = $onboarding.html();
  $onboarding.html("<img class='onboardLoad' src='/newtab/images/cubeload.svg'/><p class='onboardGreeting'>Setting up DashTab</p>");
  setTimeout(function () {
    $onboarding.children().fadeOut("slow");
  }, 3000);
  setTimeout(function () {
    $onboarding.html("<img class='onboardLoad' src='/newtab/images/logo.jpg'/ alt='Dashtab Logo'><p class='onboardGreeting'>Welcome to DashTab!</p>");
  }, 3500);
  setTimeout(function () {
    $(".onboardGreeting, .onboardLoad").fadeOut("slow");
    // $onboarding.html(temp).children(".modalWrapper").hide();
    // $(".modalWrapper").fadeOut("slow");
  }, 6000);
  setTimeout(function () {
    // $(".onboardGreeting, .onboardLoad").fadeOut("slow");
    $onboarding.html(temp).children(".modalWrapper").hide();
    // $(".modalWrapper").fadeOut("slow");
  }, 6500);
  setTimeout(function () {
    $(".modalWrapper").fadeIn("slow");
    // $(".onboardGreeting").fadeOut("slow");
  }, 7000);
};

var setFont = function setFont(fontName) {
  var newFontStack = fontName;
  NTInstance.setSetting("userFont", newFontStack);
  $("*").not("i").css("font-family", newFontStack);
};

module.exports = {
  init: init,
  triggerModal: triggerModal,
  closeModal: closeModal,
  triggerEditMode: triggerEditMode,
  processEditedList: processEditedList,
  loadUserSettings: loadUserSettings,
  setUserSettings: setUserSettings,
  showInitialLoad: showInitialLoad,
  setFont: setFont
};