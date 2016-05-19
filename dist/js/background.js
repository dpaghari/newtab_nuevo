"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NewtabNuevo = function () {
	function NewtabNuevo() {
		_classCallCheck(this, NewtabNuevo);

		this.StorageObjects = null;
	}

	_createClass(NewtabNuevo, [{
		key: "getSetting",
		value: function getSetting(name, defVal) {
			if (typeof this.StorageObjects.get(name) !== "undefined") {
				return this.StorageObjects.get(name);
			} else {
				if (typeof defVal === "undefined") return "";else return defVal;
			}
		}
	}, {
		key: "setSetting",
		value: function setSetting(name, val) {
			this.StorageObjects.set(name, val);
			var setting = {};
			setting[name] = val;
			chrome.storage.local.set(setting);
		}
	}, {
		key: "startup",
		value: function startup() {
			var firstRun = this.getSetting("FirstRun", true);
			if (firstRun) {
				this.setSetting("FirstRun", false);
				this.openTab(chrome.extension.getURL("newtab/blank.html#newTab"));
			}
		}
	}, {
		key: "loadSettings",
		value: function loadSettings() {
			chrome.storage.local.get(function (storedItems) {
				console.log(storedItems);
				window.NTInstance.StorageObjects = new Map();
				for (var key in storedItems) {
					window.NTInstance.StorageObjects.set(key, storedItems[key]);
				}
			});
		}
	}, {
		key: "openTab",
		value: function openTab(tabURL) {
			chrome.tabs.create({ url: tabURL });
		}
	}]);

	return NewtabNuevo;
}();

var NTInstance = new NewtabNuevo();
window.NTInstance = NTInstance;
NTInstance.loadSettings();
chrome.runtime.onStartup.addListener(function () {

	var intervalId = setInterval(function () {

		if (window.NTInstance.StorageObjects !== null) {
			clearInterval(intervalId);
			NTInstance.startup();
		}
	}, 500);
});
chrome.runtime.onInstalled.addListener(function () {

	// chrome.storage.local.set({"firstRun": true});
	// NTInstance.setSetting("firstRun", true);
	chrome.tabs.create({ url: chrome.extension.getURL("newtab/blank.html") });
});
chrome.tabs.onCreated.addListener(function created(tab) {
	if (tab.url == "chrome://newtab/") {
		chrome.tabs.update(tab.id, { url: chrome.extension.getURL("newtab/blank.html") });
	}
});

// Messaging Event Listeners
chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
	var res = {};
	switch (req.task) {
		case "checkFirstRun":
			var firstRun = NTInstance.getSetting("FirstRun", true);
			res.firstRun = firstRun;
			if (firstRun) {
				sendResponse(res);
				NTInstance.setSetting("FirstRun", false);
			}
			sendResponse(res);
			break;

		default:
			console.log("default");
			break;

	}
});

// Open a new tab when you click on extension icon
chrome.browserAction.onClicked.addListener(function () {
	NTInstance.openTab(chrome.extension.getURL("newtab/blank.html"));
});