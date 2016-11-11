// const $ = require("jquery");

// Prompt user for image to use for bookmark
// and also the url.  Append to favorites
let triggerModal = function(modal) {
    $('.lightbox').fadeIn();
    // modal.fadeIn();
    modal.animate({
      "right" : "0px"
    }, 400, "swing");

};

let closeModal = function (modal) {
    $('.lightbox').fadeOut();
    // modal.fadeOut();
    modal.animate({
      "right" : "-400px"
    }, 300, "swing");
};

let triggerEditMode = function () {
    $("#favorites").sortable("enable");
};

let processEditedList = function (NTInstance) {
    var reorderedList = [].slice.call($("#favorites").children(), 0);


    var processedList = [];
    for (var i = 0; i < reorderedList.length; i++) {
      // console.log(reorderedList[i].childNodes[0].dataset.title);
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

let loadUserSettings = function(NTInstance) {
    var userTheme = NTInstance.getSetting("userTheme", "light");
    var userFont = NTInstance.getSetting("userFont", "Work Sans");
    var userHover = NTInstance.getSetting("userHover", "hoverPop");
    var userBGImg = NTInstance.getSetting("userThemeBG", null);
    var userFaveSize = NTInstance.getSetting("userFaveSize", "80");
    var userBGStyle = NTInstance.getSetting("userBGStyle", "repeat");
    NTInstance.currentSettings = {
      "theme" : userTheme,
      "font" : userFont,
      "hover" : userHover,
      "background" : userBGImg,
      "faveSize" : userFaveSize,
      "bgStyle" : userBGStyle
    };
    // console.log(NTInstance.currentSettings);
};
let setUserSettings = function (settings) {
    let cardSizeStr = settings.faveSize + "px " + (parseInt(settings.faveSize) + 40) + "px";

    // Set Theme Styles
    if (settings.theme === 'light') {
      $("body, .modal").css("background", "white");
      $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color", "black");
      $(".favorite").css({
        "border" : "1.5px solid black",
        "padding" : cardSizeStr,
        "transition" : "0.3s transform, 0.3s margin"
      });
      $(".favorite i, .popFav").css("color", "white");
    }
    else if (settings.theme === 'dark') {
      $("body, .modal").css("background", "#3c3c3c");
      $("*").not(".bgURLError").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".favorite").css({
        "border" : "1.5px solid #d4d6e9",
        "padding" : cardSizeStr,
        "transition" : "0.3s transform, 0.3s margin"
      });
    }
    else if (settings.theme === "fade") {
      $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
      $("*").not(".bgURLError").css("color", "white");
      $("input, select, option").css("color", "black");
      $(".headerPanel").css("border", "none");
      $(".favorite").css({
        "padding" : cardSizeStr,
        "transition" : "0.3s transform, 0.3s margin"
      });
    }
    // Set BG Image Style
    if(settings.bgStyle === "cover"){
      $("body").css("background-size", settings.bgStyle);
    }
    else {
      $("body").css("background-repeat", settings.bgStyle);
      $("body").css("background-size", "auto");

    }
    // Set Font
    $("*").not("i").css("font-family", settings.font);

    var radios = $("input[name=theme-select]");
    $(radios).each(function(i, el) {
      if($(el).val() === settings.theme)
        $(el).attr("checked", "checked");
    });
    // Set Background
    if(settings.background !== null) {
      $("body").css("background-image", "url(" + settings.background +")");
      $("input[name=themeBGImage]").val(settings.background);
    }
    // Set Settings Options to their saved values
    $(".themeBGImageRepeat").val(settings.bgStyle);
    $(".favoriteSize").val(settings.faveSize);
    $("select.fontOption").val(settings.font);
    $("select.hoverOption").val(settings.hover);


  };

  // TO-DO: Could probably be implemented better
let showInitialLoad = function () {
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

let setFont = function(fontName, NTInstance) {
    let newFontStack = fontName;
    NTInstance.setSetting("userFont", newFontStack);
    $("*").not("i").css("font-family", newFontStack);
};

let setHover = function(hoverName, NTInstance) {
  NTInstance.setSetting("userHover", hoverName);
  switch(hoverName) {

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

let setSize = function(sizeVal, NTInstance) {
  NTInstance.setSetting("userFaveSize", sizeVal);
  let cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
  $(".favorite").css({
    "padding" : cardSizeStr,
    "transition" : "0.4s padding, 0.3s transform, 0.3s margin"
  });
};
let setBGStyle = function(styleVal, NTInstance) {
  NTInstance.setSetting("userBGStyle", styleVal);
  if(styleVal === "cover"){
    $("body").css("background-size", styleVal);
  }
  else {
    $("body").css("background-repeat", styleVal);
    $("body").css("background-size", "auto");
  }
  // let cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
};
module.exports = {
  triggerModal,
  closeModal,
  triggerEditMode,
  processEditedList,
  loadUserSettings,
  setUserSettings,
  showInitialLoad,
  setFont,
  setHover,
  setSize,
  setBGStyle
};
