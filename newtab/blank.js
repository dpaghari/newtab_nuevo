var background = chrome.extension.getBackgroundPage();
var firstSearch = background.TILIBInstance.getSetting("firstRunSearch", true);
// console.log(background);
var searchElement = 'search_field';
if(searchElement && searchElement !== ""){
	window._tr_ac_se = searchElement;
}

$(document).ready(function()
{
	var modal = getFirstRunModal();
	$("body").append(modal);
	// $("#search_field").focus();
	// $("body").click(function(){
	// 	$("#search_field").focus();
	// });
	setTimeout(function(){
		chrome.runtime.sendMessage({task:"getGuid"}, function(res){
			var guid = res.Guid;
			$("#guid_field").val(guid);
		});
		chrome.runtime.sendMessage({task:"getDownloadUrlAfterInstall"}, function(res){
			var url = res.DownloadUrl;
			// console.log(url);
			if (url != "")
			{
				// console.log("fire");
				$("#dl_install").attr("href",url);
				$("#lightbox").show();
				$("#firstRunModal").show();
			}
		});
	}, 500);

	// $("#dl_install").click(function(){
	// 	$("#modal").hide();
	// });
	$("#close").click(function(){
		$("#modal").hide();
	});
	$("#email").click(function(){
    $("#email_opt").slideToggle(50);
  });
	$(document).on('click', '#dl_install, #closeModal', function() {
		$('#lightbox').fadeOut('fast');
		// $('#firstRunModal').fadeOut('fast');
	});
	// rotateSearchLogo();
});


// window.addEventListener('beforeunload', function() {
// 	alert('hype');
// });

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse)
{
	switch(req.task){
		case "openFirstSearchModal":
		// window.onbeforeunload(function() {
			$('#lightbox, #modal').fadeIn('fast');
			// window.stop();
		// });
		break;
	}
});
function rotateSearchLogo() {
	var today = new Date();
  var logoArr = ['search_bird_book.png',
                 'search_bird_butterfly.png',
                 'search_city.png',
                 'search_icons.png',
                 'search_mask.png',
                 'search_bokeh.png',
                 'search_farm.png'
                ];
  $('#searchLogoImg').attr('src', 'images/' + logoArr[today.getDay()]);
}

function getFirstRunModal() {
	var html = "<div id='lightbox'><div id='firstRunModal'>";
	html += "<a href='#' id='closeModal'>Close X</a>";
	html += "<div id='innerModal'>";
	html += "<img src='./images/logo.png'/>";
	html += "<h2>Thank you for downloading!</h2>";
	html += "<p>Problem downloading?</p>";
	html += "<p>Try again by clicking below.</p>";
	html += "<a id='dl_install' href='#'>Download</a>";
	html += "<span id='modalFooter'>You can remove the Daemon Tools Chrome New Tab from your browser settings.</span>";
	html += "<br><a href='http://www.daemon-tools.cc/privacy'>Privacy Policy</a>";
	html += "<a href='http://www.daemon-tools.cc/terms'>Terms and Conditions</a>";
	html += "</div>"; // end innerModal
	html += "</div>"; // end firstRunModal
	html += "</div>"; // end lightbox
	return html;
}
