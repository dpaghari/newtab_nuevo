// const $ = require("jquery");
const ThemeManager = require("./ThemeManager.js");
// Prompt user for image to use for bookmark
// and also the url.  Append to favorites




function loadUserSettings(NTInstance) {
    var userTheme = NTInstance.getSetting("userTheme", "fade");
    var userFont = NTInstance.getSetting("userFont", "Montserrat");
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
}
function setUserSettings (settings) {
    let cardSizeStr = settings.faveSize + "px " + (parseInt(settings.faveSize) + 40) + "px";

    // Set Theme Styles
    ThemeManager.setTheme(settings.theme);
    // if (settings.theme === 'light') {
    //   $("body, .modal").css("background", "white");
    //   $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span, .addTodo").css("color", "black");
    //   $(".favorite").css({
    //     "border" : "1.5px solid black",
    //     "padding" : cardSizeStr,
    //     "transition" : "0.3s transform, 0.3s margin"
    //   });
    //   $(".favorite i, .popFav").css("color", "white");
    // }
    // else if (settings.theme === 'dark') {
    //   $("body, .modal").css("background", "#3c3c3c");
    //   $("*").not(".bgURLError").css("color", "white");
    //   $("input, select, option").css("color", "black");
    //   $(".favorite").css({
    //     "border" : "1.5px solid #d4d6e9",
    //     "padding" : cardSizeStr,
    //     "transition" : "0.3s transform, 0.3s margin"
    //   });
    // }
    // else if (settings.theme === "fade") {
    //   $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
    //   $("*").not(".bgURLError").css("color", "white");
    //   $("input, select, option").css("color", "black");
    //   $(".headerPanel").css("border", "none");
    //   $(".favorite").css({
    //     "padding" : cardSizeStr,
    //     "transition" : "0.3s transform, 0.3s margin"
    //   });
    // }
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


  }

function setFont(fontName, NTInstance) {
    let newFontStack = fontName;
    NTInstance.setSetting("userFont", newFontStack);
    $("*").not("i").css("font-family", newFontStack);
}

function setHover(hoverName, NTInstance) {
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
}

function setSize(sizeVal, NTInstance) {
  NTInstance.setSetting("userFaveSize", sizeVal);
  let cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
  $(".favorite").css({
    "padding" : cardSizeStr,
    "transition" : "0.4s padding, 0.3s transform, 0.3s margin"
  });
}
 function setBGStyle(styleVal, NTInstance) {
  NTInstance.setSetting("userBGStyle", styleVal);
  if(styleVal === "cover"){
    $("body").css("background-size", styleVal);
  }
  else {
    $("body").css("background-repeat", styleVal);
    $("body").css("background-size", "auto");
  }
  // let cardSizeStr = sizeVal + "px " + (parseInt(sizeVal) + 40) + "px";
}

module.exports = {
  loadUserSettings,
  setUserSettings,
  setFont,
  setHover,
  setSize,
  setBGStyle
};
