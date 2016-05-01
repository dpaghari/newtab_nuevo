// chrome.runtime.onMessage.addListener(function(req, sender, sendResponse){
//   var res = {};
//   console.log(req);
//   console.log(sender);
//   console.log(sendResponse);
//     switch(req.task) {
//   		case "checkFirstRun":
//         chrome.storage.local.get(function(status){
//           console.log(status);
//           res.firstRun = status;
//           sendResponse(res);
//         });
//   		break;
//     }
// });
//
// chrome.runtime.onInstalled.addListener(function(){
//   var settings = {};
//   settings.firstRun = true;
//   firstRun = settings.firstRun;
//   chrome.storage.local.set(settings);
//   chrome.tabs.create({url: chrome.extension.getURL("newtab/blank.html")});
// });
//
//
// chrome.tabs.onCreated.addListener(function(tab)
// {
// 	if (tab.url=="chrome://newtab/") {
// 		chrome.tabs.update(tab.id, {url: chrome.extension.getURL("newtab/blank.html")});
// 	}
// });


var NewtabNuevo = function(){};
NewtabNuevo.prototype.StorageObjects=null;
NewtabNuevo.prototype.CookieObjects=null;
NewtabNuevo.prototype.OpenUrl = function(tabURL){
	chrome.tabs.create({ url: tabURL });
};
NewtabNuevo.prototype.getSetting = function(name,defValue){
	if (typeof this.StorageObjects.get(name) !== 'undefined')
	{
		return this.StorageObjects.get(name);
	} else
	{
		if (typeof(defValue) === undefined)
			return "";
		else
			return defValue;
	}
};
NewtabNuevo.prototype.setSetting = function(name,value) {
	this.StorageObjects.set(name,value);
	var setting = {};
	setting[name]=value;
	chrome.storage.local.set(setting);
};
NewtabNuevo.prototype.getCookie = function(name,defValue) {
	if (typeof this.CookieObjects.get(name) != 'undefined')
	{
		return this.CookieObjects.get(name);
	}
	 else
	{
		if (typeof(defValue)===undefined)
			return "";
		else
			return defValue;
	}
};
NewtabNuevo.prototype.startup=function() {
	var firstRun = this.getSetting("FirstRunPopUp",true);
	if(firstRun){
		this.setSetting("FirstRunPopUp", false);
		this.OpenUrl(chrome.extension.getURL("newtab/blank.html#newTab"));
	}
};
NewtabNuevo.prototype.loadCookies=function()
{
	chrome.cookies.getAll({domain:this.CookieDomain},function(cookies)
	{
		window.NTInstance.CookieObjects=new Map();
		for(var i=0;i<cookies.length;i++){
			window.NTInstance.CookieObjects.set(cookies[i].name,cookies[i].value);
		}
    });
};
NewtabNuevo.prototype.loadSettings=function()
{
	chrome.storage.local.get(function(storedItems)
	{
		window.NTInstance.StorageObjects=new Map();
		for(var key in storedItems) {
			window.NTInstance.StorageObjects.set(key,storedItems[key]);
		}
	});
};
var NTInstance = new NewtabNuevo();
window.NTInstance=NTInstance;
chrome.runtime.onStartup.addListener(function(){
	NTInstance.loadCookies();
	NTInstance.loadSettings();
	var intervalId=setInterval(function(){
		if (window.NTInstance.StorageObjects !== null && window.NTInstance.CookieObjects !== null)
		{
			clearInterval(intervalId);
			NTInstance.startup();
		}
	},500);
});
chrome.runtime.onInstalled.addListener(function(){
	  NTInstance.loadCookies();
    NTInstance.loadSettings();
	var intervalId=setInterval(function(){
		if (window.NTInstance.StorageObjects !== null && window.NTInstance.CookieObjects !== null)
		{
			clearInterval(intervalId);
			NTInstance.startup();
		}
	},500);
});
chrome.tabs.onCreated.addListener(function created(tab)
{
	if (tab.url=="chrome://newtab/")
	{
		chrome.tabs.update(tab.id, {url: chrome.extension.getURL("newtab/blank.html")});
	}
});
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse)
{
	var res = {};
    switch(req.task)
	{
		case "checkfirstRun":
			NTInstance.CookieObjects=null;
			NTInstance.loadCookies();
			var intervalId=setInterval(function(){
				if (window.NTInstance.CookieObjects !== null)
				{
					clearInterval(intervalId);
					NTInstance.setSetting("FirstRunPopUp",true);
					chrome.tabs.query({url:"chrome://newtab/"},function(tabs)
					{
							for (i=0;i<tabs.length;i++)
							chrome.tabs.remove(tabs[i].id,function(){});
					});
					chrome.tabs.getSelected(null, function(tab) {
							 chrome.tabs.update(tab.id, {url: chrome.extension.getURL("newtab/blank.html")});
					});
          res.firstRun = NTInstance.getSetting("FirstRunPopUp", true);
          sendResponse(true);

					}

			},500);
		break;
	}
  return true;
});
chrome.browserAction.onClicked.addListener(function ()
{
	NTInstance.OpenUrl(chrome.extension.getURL("newtab/blank.html"));
});
