var NewtabNuevo = function(){};
NewtabNuevo.prototype.StorageObjects=null;
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

NewtabNuevo.prototype.startup=function() {
	var firstRun = this.getSetting("FirstRunPopUp",true);
	if(firstRun){
		this.setSetting("FirstRunPopUp", false);
		this.OpenUrl(chrome.extension.getURL("newtab/blank.html#newTab"));
	}
};

NewtabNuevo.prototype.loadSettings=function()
{
	chrome.storage.local.get(function(storedItems)
	{
    console.log(storedItems);
		window.NTInstance.StorageObjects=new Map();
		for(var key in storedItems) {
			window.NTInstance.StorageObjects.set(key,storedItems[key]);
		}
	});
};


var NTInstance = new NewtabNuevo();
window.NTInstance=NTInstance;
chrome.runtime.onStartup.addListener(function(){
	NTInstance.loadSettings();
	var intervalId=setInterval(function(){
		if (window.NTInstance.StorageObjects !== null)
		{
			clearInterval(intervalId);
			NTInstance.startup();
		}
	},500);
});
chrome.runtime.onInstalled.addListener(function(){
		// chrome.storage.local.set({"firstRun": true});
    // NTInstance.setSetting("firstRun", true);
    chrome.tabs.create({url: chrome.extension.getURL("newtab/blank.html")});
});
chrome.tabs.onCreated.addListener(function created(tab){
	if (tab.url=="chrome://newtab/") {
		chrome.tabs.update(tab.id, {url: chrome.extension.getURL("newtab/blank.html")});
	}
});

// Messaging Event Listeners
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
	var res = {};
  switch(req.task) {
		case "checkfirstRun":
			console.log('task', req.task);
      var firstRun = NTInstance.getSetting("firstRun",true);
      console.log("firstRun", firstRun);
      if(firstRun){
				sendResponse(firstRun);
        NTInstance.setSetting("firstRun", false);
      }
		break;
	}
  return true;
});

// Open a new tab when you click on extension icon
chrome.browserAction.onClicked.addListener(function ()
{
	NTInstance.OpenUrl(chrome.extension.getURL("newtab/blank.html"));
});
