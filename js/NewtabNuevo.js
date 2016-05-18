export default class NewtabNuevo {
	constructor() {
		this.StorageObjects = null;
	}

	getSetting(name, defVal) {
		if(typeof this.StorageObjects.get(name) !== "undefined"){
			return this.StorageObjects.get(name);
		}
		else {
			if(typeof defVal === "undefined") return "";
			else return defValue;
		}
	}

	setSetting(name, defVal) {
		this.StorageObjects.set(name,defVal);
		var setting = {};
		setting[name] = defVal;
		chrome.storage.local.set(setting);
	}

	startup() {
		var firstRun = this.getSetting("FirstRun",true);
		if(firstRun){
				this.setSetting("FirstRun", false);
				this.openTab(chrome.extension.getURL("newtab/blank.html#newTab"));
		}
	}

	loadSettings() {
		chrome.storage.local.get(function(storedItems) {
	    console.log(storedItems);
			window.NTInstance.StorageObjects=new Map();
			for(var key in storedItems) {
				window.NTInstance.StorageObjects.set(key,storedItems[key]);
			}
		});
	}

	openTab(tabURL) {
		chrome.tabs.create({url: tabURL});
	}

}
