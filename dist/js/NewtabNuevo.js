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
				if (typeof defVal === "undefined") return "";else return defValue;
			}
		}
	}, {
		key: "setSetting",
		value: function setSetting(name, defVal) {
			this.StorageObjects.set(name, defVal);
			var setting = {};
			setting[name] = defVal;
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