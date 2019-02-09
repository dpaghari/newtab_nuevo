const Util = require("./util.js");

class ThemeManager {
  constructor() {
    this.currentTheme = "fade";
  }

  init() {
    this.loadTheme();
    const savedBgColor = Util.getBrowserSetting('userBGColor');
    this.setBgColor(savedBgColor);
  }

  getTheme() {
    return this.currentTheme;
  }

  setBgColor(color) {
    $('body').css('backgroundColor', color);
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
    $('body').addClass('theme-fade').removeClass('theme-light theme-dark');
  }
  setLightTheme() {
    $('body').addClass('theme-light').removeClass('theme-fade theme-dark');
  }
  setDarkTheme() {
    $('body').addClass('theme-dark').removeClass('theme-light theme-fade');
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
