"use strict";!function e(t,a,r){function n(i,s){if(!a[i]){if(!t[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);var d=new Error("Cannot find module '"+i+"'");throw d.code="MODULE_NOT_FOUND",d}var c=a[i]={exports:{}};t[i][0].call(c.exports,function(e){var a=t[i][1][e];return n(a?a:e)},c,c.exports,e,t,a,r)}return a[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)n(r[i]);return n}({1:[function(e,t,a){var r=function(e){$(".lightbox").fadeIn(),e.animate({right:"0px"},400,"swing")},n=function(e){$(".lightbox").fadeOut(),e.animate({right:"-400px"},300,"swing")},o=function(){$("#favorites").sortable("enable")},i=function(e){for(var t=$("#favorites").children(),a=[],r=0;r<t.length;r++){var n={title:t[r].childNodes[0].dataset.title,url:t[r].childNodes[0].href,bgImg:t[r].childNodes[0].dataset.bgImg};a.push(n)}e.setSetting("savedFavorites",a),$("#favorites").sortable("disable")},s=function(e){var t=e.getSetting("userTheme","light"),a=e.getSetting("userFont","Work Sans"),r=e.getSetting("userHover","hoverPop"),n=e.getSetting("userThemeBG",null),o=e.getSetting("userFaveSize","80"),i=e.getSetting("userBGStyle","repeat");e.currentSettings={theme:t,font:a,hover:r,background:n,faveSize:o,bgStyle:i}},l=function(e){var t=e.faveSize+"px "+(parseInt(e.faveSize)+40)+"px";"light"==e.theme?($("body, .modal").css("background","white"),$("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color","black"),$(".favorite").css({border:"1.5px solid black",padding:t,transition:"0.3s transform"}),$(".favorite i, .popFav").css("color","white")):"dark"==e.theme&&($("body, .modal").css("background","#3c3c3c"),$("*").not(".bgURLError").css("color","white"),$("input, select, option").css("color","black"),$(".favorite").css({border:"1.5px solid #d4d6e9",padding:t,transition:"0.3s transform"})),"cover"===e.bgStyle?$("body").css("background-size",e.bgStyle):($("body").css("background-repeat",e.bgStyle),$("body").css("background-size","auto")),$(".favoriteSize").val(e.faveSize),$("*").not("i").css("font-family",e.font),$("select.fontOption").val(e.font),$("select.hoverOption").val(e.hover);var a=$("input[name=theme-select]");$(a).each(function(t,a){$(a).val()===e.theme&&$(a).attr("checked","checked")}),null!==e.background&&($("body").css("background-image","url("+e.background+")"),$("input[name=themeBGImage]").val(e.background))},d=function(){var e=$(".onboardingModal"),t=e.html();e.html("<img class='onboardLoad' src='/newtab/images/cubeload.svg'/><p class='onboardGreeting'>Setting up DashTab</p>"),setTimeout(function(){e.children().fadeOut("slow")},3e3),setTimeout(function(){e.html("<img class='onboardLoad' src='/newtab/images/logo.jpg'/ alt='Dashtab Logo'><p class='onboardGreeting'>Welcome to DashTab!</p>")},3500),setTimeout(function(){$(".onboardGreeting, .onboardLoad").fadeOut("slow")},6e3),setTimeout(function(){e.html(t).children(".modalWrapper").hide()},6500),setTimeout(function(){$(".modalWrapper").fadeIn("slow")},7e3)},c=function(e,t){var a=e;t.setSetting("userFont",a),$("*").not("i").css("font-family",a)},u=function(e,t){switch(t.setSetting("userHover",e),e){case"hoverPop":$(".favorite").addClass("hoverPop").removeClass("hoverNone hoverHighlight");break;case"hoverHighlight":$(".favorite").addClass("hoverHighlight").removeClass("hoverNone hoverPop");break;case"hoverNone":$(".favorite").addClass("hoverNone").removeClass("hoverPop hoverHighlight")}},g=function(e,t){t.setSetting("userFaveSize",e);var a=e+"px "+(parseInt(e)+40)+"px";$(".favorite").css({padding:a,transition:"0.4s padding, 0.3s transform"})},v=function(e,t){t.setSetting("userBGStyle",e),"cover"===e?$("body").css("background-size",e):($("body").css("background-repeat",e),$("body").css("background-size",auto))};t.exports={triggerModal:r,closeModal:n,triggerEditMode:o,processEditedList:i,loadUserSettings:s,setUserSettings:l,showInitialLoad:d,setFont:c,setHover:u,setSize:g,setBGStyle:v}},{}],2:[function(e,t,a){var r=new Date,n=["January","February","March","April","May","June","July","August","September","October","November","December"],o=r.getMonth(),i=r.getFullYear(),s=r.getDate(),l=n[o]+" 1 "+i,d=new Date(l).toDateString(),c=d.substring(0,3),u=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],g=u.indexOf(c),v=new Date(i,o+1,0).getDate(),h=document.createElement("table"),f=(document.createElement("tr"),function(){for(var e=document.createElement("tr"),t=0;6>=t;t++){var a=document.createElement("td"),r=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];a.innerHTML=r[t],e.appendChild(a)}for(h.appendChild(e),e=document.createElement("tr"),t=0;6>=t&&t!==g;t++){var a=document.createElement("td");a.innerHTML="",e.appendChild(a)}for(var n=1;6>=t;t++){var a=document.createElement("td");a.innerHTML="<span>"+n+"</span>",n===s&&a.classList.add("currentDay"),n++,e.appendChild(a)}h.appendChild(e);for(var o=3;6>=o;o++){e=document.createElement("tr");for(var t=0;6>=t;t++){if(n>v)return h.appendChild(e),h;var a=document.createElement("td");a.innerHTML="<span>"+n+"</span>",n===s&&a.classList.add("currentDay"),n++,e.appendChild(a)}h.appendChild(e)}});t.exports={buildCalendar:f,month_name:n,month:o,year:i}},{}],3:[function(e,t,a){var r=e("./util.js"),n=function(e,t,a,r){var n=document.createElement("LI"),o=document.createElement("A");o.href=t,$.get(a).done(function(){o.style.backgroundImage="url("+a+")"}).fail(function(){o.style.backgroundImage="url('/newtab/images/placeholder.png')"}),o.style.backgroundSize="cover",o.style.backgroundPosition="center center",o.style.backgroundRepeat="no-repeat",o.classList.add("favorite",r.currentSettings.hover),o.dataset.title=e,o.dataset.bgImg=a;var i=document.createElement("I");i.classList.add("fa","fa-trash-o","fa-lg","fa-fw","optDel"),o.appendChild(i),n.appendChild(o),$("#favorites").append(n),$(".favorite").children().hide()},o=function(e,t){var a=[],r=t.getSetting("savedFavorites",null);null!==r&&(a=r),a.push(e),t.setSetting("savedFavorites",a),n(e.title,e.url,e.bgImg,t),$("#inputUrl").val(""),$("#inputImage").val("")},i=function(){return $.ajax({url:"./popularFavs.json",method:"GET"})},s=function(e,t){var a=t.getSetting("savedFavorites",null);null!==a&&(a.forEach(function(t,r){t.url===e&&a.splice(r,1)}),t.setSetting("savedFavorites",a))},l=function(e){var t=[],a=e.getSetting("savedFavorites",null);null!==a&&(t=a,t.forEach(function(t){n(t.title,t.url,t.bgImg,e)}))},d=function(e){var t=i();t.then(function(t){var a=JSON.parse(t);g(a,e)})},c=function(e){var t=r.getPromise("/newtab/defaultFavs.json");t.then(function(t){var a=JSON.parse(t);u(a,e)})},u=function(e,t){for(var a=e.default_favorites,r=0;r<a.length;r++){var n={title:a[r].title,url:a[r].url,bgImg:a[r].bgImg};o(n,t)}},g=function(e,t){for(var a=e.popular_favorites,r=t.getSetting("savedFavorites",null),n=[],o=0;o<a.length;o++)if(null!==r&&(n=$.grep(r,function(e){return e.url===a[o].url})),0===n.length){var i="<a href='#' class='popFav' data-title="+a[o].title+" data-url="+a[o].url+" data-imgurl="+a[o].bgImg+">"+a[o].title+"</a>";$(".popularFavs").append(i)}};t.exports={addFavorite:n,saveFavorite:o,getPopularFavorites:i,deleteFavorite:s,loadSavedFavorites:l,loadPopularFavorites:d,loadDefaultFavorites:c,createDefaultFavs:u,createPopularFavs:g}},{"./util.js":5}],4:[function(e,t,a){var r=chrome.extension.getBackgroundPage(),n=r.NTInstance;n.editing=!1,n.currentSettings={theme:"light",font:"Work Sans",hover:"hoverPop",background:null,faveSize:"80"};var o=e("./actions.js"),i=e("./createCalendar.js"),s=e("./favorites.js"),l=e("./util.js");$(document).ready(function(){o.loadUserSettings(n),s.loadSavedFavorites(n),s.loadPopularFavorites(n),o.setUserSettings(n.currentSettings);var e=i.buildCalendar();$(".calendar-head").html("<span>"+i.month_name[i.month]+" "+i.year+"</span"),$(".calendar").append(e),$("#favorites").sortable(),$("#favorites").sortable("disable"),chrome.runtime.sendMessage({task:"checkFirstRun"},function(e){e.firstRun&&(o.showInitialLoad(),s.loadDefaultFavorites(n),o.triggerModal($(".onboardingModal")),$("#obInputTitle").focus()),$(".favorite").children().hide()});var t=(new Date).toLocaleTimeString(navigator.language,{hour:"2-digit",minute:"2-digit"});$("#time").html(t);var a=(new Date).toDateString();$("#date").html(a),setInterval(function(){t=(new Date).toLocaleTimeString(navigator.language,{hour:"2-digit",minute:"2-digit"}),$("#time").html(t)},1e3),$(document).on("click",".userAction",function(e){e.preventDefault();var t=$(this).attr("id");switch(t){case"addFavorite":0===$(".addModal .popularFavs").children().length&&$(".addExtra").hide();var a=$(".addModal");o.triggerModal(a),$("#inputTitle").focus();break;case"editMode":e.preventDefault(),n.editing=!n.editing,$(".favorite").toggleClass("editing"),$(".favorite").children().toggle(),n.editing?o.triggerEditMode():o.processEditedList(n);break;case"openSettings":e.preventDefault();var r=$(".settingsModal");o.triggerModal(r);break;case"openOnboarding":e.preventDefault();var i=$(".onboardingModal");o.triggerModal(i);break;case"openCalendar":e.preventDefault();var s=$(".calendarModal");o.triggerModal(s)}}),$(document).on("click",".popFav",function(e){e.preventDefault();var t=$(this)[0],a=t.dataset.title,r=t.dataset.url,o=t.dataset.imgurl,i={title:a,url:r,bgImg:o};s.saveFavorite(i,n),$(this).remove(),0!==$(".addModal .popularFavs").children().length&&0!==$(".onboardingModal .popularFavs").children().length||$(".addExtra, .popularFavs").hide()}),$(document).on("click",".closeBtn",function(e){e.preventDefault();var t=$(this).closest(".modal");o.closeModal(t)}),$(document).on("click",".addBtn",function(e){e.preventDefault();var t=$("#inputTitle").val(),a=$("#inputUrl").val();a=l.addHttp(a);var r=l.validateURL(a);r||$("#addFormError").text("Please enter a valid URL").show();var n=$("#inputImage").val();n=l.addHttp(n);var i=l.validateURL(n);if(i||$("#addFormError").text("Please enter a valid Image URL").show(),r||i||$("#addFormError").text("Please enter a valid URL & Image URL").show(),""!==t&&""!==a&&r&&""!==n&&i){var d={title:t,url:a,bgImg:n};s.saveFavorite(d),null!==$(".modal").length&&o.closeModal($(".modal")),$("#addFormError").hide()}else $("#addFormError").show()}),$(document).on("click",".updateBtn",function(){var e=$("input[name=themeBGImage]").val(),t=l.validateURL(e);t?(n.setSetting("userThemeBG",e),$("body").css("background-image","url('"+e+"')")):$(".bgURLError").show()}),$(document).on("click",".removeBtn",function(){$("input[name=themeBGImage]").val(""),n.setSetting("userThemeBG",null),$("body").css("background-image","none"),$(".bgURLError").hide()}),$("input[type=radio][name=theme-select]").change(function(){n.setSetting("userTheme",this.value),"light"==this.value?($("body, .modal").css("background","white"),$("*").not(".addBtn, .settingsBtn, .bgURLError, .currentDay span").css("color","black"),$(".favorite").css("border","1.5px solid black"),$(".favorite i, .popFav").css("color","white")):"dark"==this.value&&($("body, .modal").css("background","#3c3c3c"),$("*").not(".bgURLError").css("color","white"),$("input, select, option").css("color","black"),$(".favorite").css("border","1.5px solid #d4d6e9"))}),$(document).on("change",".hoverOption",function(){var e=$(this).val();o.setHover(e,n)}),$(document).on("change",".fontOption",function(){var e=$(this).val();o.setFont(e,n)}),$(document).on("change",".favoriteSize",function(){var e=$(this).val();o.setSize(e,n)}),$(document).on("change",".themeBGImageRepeat",function(){var e=$(this).val();o.setBGStyle(e,n)}),$(document).on("click",".optDel",function(e){e.preventDefault();var t=$(this).parent(),a=t.attr("href");s.deleteFavorite(a,n),$(this).parent().remove()}),$(document).on("click",".favorite",function(e){$(this).hasClass("editing")&&e.preventDefault()})})},{"./actions.js":1,"./createCalendar.js":2,"./favorites.js":3,"./util.js":5}],5:[function(e,t,a){var r=function(e){return $.ajax({url:e,method:"GET"})},n=function(e){return null!==e.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)},o=function i(e){var t;if(null===e.match(/^(https?:\/\/)/)){var i="http://";return t=i.concat(e)}return e};t.exports={getPromise:r,validateURL:n,addHttp:o}},{}]},{},[4]);
//# sourceMappingURL=newtab.js.map
