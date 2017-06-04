const Util = require("./util.js");

class ThemeManager {
  constructor() {
    this.currentTheme = "fade";
  }

  init() {
    this.loadTheme();
  }

  getTheme() {
    return this.currentTheme;
  }

  setTheme(themeName) {
    switch(themeName) {
      case "fade" :
        this.setFadeTheme();
        break;
      case "light" :
        this.setLightTheme();
        break;
      case "dark" :
        this.setDarkTheme();
        break;
      default:
        this.setFadeTheme();
        break;
    }
  }

  setFadeTheme() {
    $("body").css({"background" : "white"});
    $(".modal, .headerPanel").css("background", "rgba(0,0,0,0.4)");
    $("*").not(".bgURLError, h3, i, .clearBtn, .addBtn, .settingsBtn, .removeBtn").css("color", "white");
    $("h3").css("color", "#333");
    // $("input, select, option").css("color", "white");
    $(".favorite").css({"border" : ".5px solid black"});
    $(".headerPanel").css("border", "none");
  }
  setLightTheme() {
    $("body, .modal, .headerPanel").css({"background" : "white"});
    $("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span, .addFormError, .addTodo, .clearBtn, input").css("color", "black");
    $(".favorite").css({"border" : ".5px solid black"});
    $(".favorite i, .popFav, .addTodo i").css("color", "white");
  }
  setDarkTheme() {
    $("body, .modal, .headerPanel").css({"background": "#3c3c3c"});
    $("*").not(".bgURLError").css("color", "white");
    $("input, select, option").css("color", "black");
    $(".favorite").css({"border" : "none"});
    // $(".favorite").css({"border": "1.5px solid #999", "boxShadow" : "0px 1px 1px 1px #666"});
  }


  saveTheme(theme) {
    Util.setBrowserSetting("currentTheme", theme);
  }

  loadTheme() {
    let currentTheme = Util.getBrowserSetting("currentTheme", "fade");
    this.setTheme(currentTheme);
  }

}

const themeManager = new ThemeManager();
module.exports = themeManager;
