var NewtabNuevo = require("NewtabNuevo");

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
      var firstRun = NTInstance.getSetting("FirstRun",true);
      console.log("firstRun", firstRun);
			res.firstRun = firstRun;
      if(firstRun){
				sendResponse(res.firstRun);
        NTInstance.setSetting("FirstRun", false);
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
