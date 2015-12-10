
/*
 * Minimal classList shim for IE 9
 * By Devon Govett
 * MIT LICENSE
 */
if(!("classList"in document.documentElement)&&Object.defineProperty&&typeof HTMLElement!=="undefined"){Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){function t(t){return function(n){var r=e.className.split(/\s+/),i=r.indexOf(n);t(r,i,n);e.className=r.join(" ")}}var e=this;var n={add:t(function(e,t,n){~t||e.push(n)}),remove:t(function(e,t){~t&&e.splice(t,1)}),toggle:t(function(e,t,n){~t?e.splice(t,1):e.push(n)}),contains:function(t){return!!~e.className.split(/\s+/).indexOf(t)},item:function(t){return e.className.split(/\s+/)[t]||null}};Object.defineProperty(n,"length",{get:function(){return e.className.split(/\s+/).length}});return n}})} 

var events = (function(){
	var topics = {};
	var hOP = topics.hasOwnProperty;

	return {
    	subscribe: function(topic, listener) {
      		if(!hOP.call(topics, topic)) topics[topic] = [];
      		var index = topics[topic].push(listener) -1;
  			return {
    			remove: function() {
      				delete topics[topic][index];
    			}
  			};
    	},
    	publish: function(topic, info) {
			if(!hOP.call(topics, topic)) return;
      		topics[topic].forEach(function(item) {
      			item(info != undefined ? info : {});
      		});
    	}
  	};
})();

var platform = platform = {
	refreshClick: false,
	helperData: {"layoutId": "fixture", "isAlarmSet": false},
	msisdn: '',
	config: {},
	response: '',
	

	callHike : function(name, args){
	 	//AndroidFunction[name].apply(null, args);
	 	//fixture.setAlarm();
	},

	setHelperData: function(){

	},

	getHelperData: function(){

	},

	log: function (message) {
		popupBridge.logFromJS("cricket-fever", message);
		console.log(message);
	},

	debug: function(object){
		popupBridge.logFromJS("cricket-fever", JSON.stringify(object));
	},
	logAnalytics: function(isUI, type, analyticEvents){
		analyticEvents = JSON.stringify(analyticEvents);

		popupBridge.logAnalytics(isUI, type,analyticEvents );
		platform.log("analytic with isui = "+ isUI + " type = "+ type + " analyticEvents = "+ analyticEvents);
	}

};

function onStop (func) {
	func();
}

function setData(msisdn, helperData){
	platform.log("inSetData");

	if(!msisdn){
		platform.log("msisdn is null");
	}
	
	else{
		platform.log("msisdn: "+msisdn);
		platform.log("helperData: "+helperData);

		platform.msisdn = msisdn;

		if (helperData != null && helperData !=''){
			platform.helperData = JSON.parse(helperData);
			if(typeof platform.helperData.debug == "undefined" ) {
				platform.helperData.debug = true;
			}
		}

		setDataCallback();
	}
}

function pullNavigator(){
	platform.debug(navigator);
};

function onResume(){
	platform.log("in on resume");
	if (typeof liveScore != "undefined" && liveScore != null) liveScore.pollServerForNewScore();
	platform.log(" on resume called");
}

function onPause(){
	platform.log("in on pause");
	if (typeof liveScore != "undefined" && liveScore != null) clearTimeout(liveScore.timer);
	platform.log(" on pause called");
}

window.onerror = function(error, url, line){
	// platform.debug({'type': 'jserror', 'text': error, 'file': url, 'line': line});
	// platform.log('error: ' + error + url + line);
	// if(platform.helperData !=null && platform.helperData.debug){
		
	// 	var analyticEvents = {};
	// 	analyticEvents["ek"] = "html_error";
	// 	analyticEvents["state"] = platform.card;	
	// 	analyticEvents["line"] = line;	
	// 	analyticEvents["err_code"] = error;	

	// 	analyticEvents["matchId"] = document.getElementsByClassName("cricket-card")[0].getAttribute("data-matchid");

	// 	platform.logAnalytics("false", "html_error",analyticEvents);
	// }
};

window.onload = function(){
	
};

var addRippleEffect = function (e) {
    var target = e.target;
    if(target.tagName == "IMG" || target.tagName == "img"  ){
    	target = target.parentNode;
    }
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}

var fireAppInit = function(){
	if (fireappload != undefined){
		events.publish('/fire/page/load/');
	} else {
		setTimeout(function(){
			fireAppInit();
		}, 10);
	}
};

events.subscribe('/platform/app.init/', function(){
	
	// checks if all present images have loaded before 
	// calculating the onLoadFinished height for native

	var images = document.querySelectorAll('img');
	var num_of_images = images.length;
	var img_loaded = 0;

	platform.log(num_of_images);
	platform.log(img_loaded);

	var imgload = events.subscribe('/img/loaded/', function(){
		img_loaded++;

		platform.log('/img/loaded/ | images loaded' + img_loaded);
		if (img_loaded === num_of_images) {
			platform.log('equal images');
			fireAppInit();
			imgload.remove();
		}
	});

	if (num_of_images > 0){
		for (var i = 0; i < num_of_images; i++){
			platform.log(images[i]);
			if (images[i].complete){
				events.publish('/img/loaded/');
				platform.log('image already loaded: ' + img_loaded);
			} else {
				images[i].addEventListener('load', function(ev){
					platform.log('images onload event');
					events.publish('/img/loaded/');
				});
			}
		}	
	} else {
		fireAppInit();	
		imgload.remove();
	}
});

function progressFinished(){}
// platform.bindEvents();

var tappedElementCount = document.getElementsByClassName("tappingEffect");

if(tappedElementCount.length){
	for(var i=0; i< tappedElementCount.length;i++){
		tappedElementCount[i].addEventListener("touchstart", function(){
			this.classList.add("tapped");
		});
		tappedElementCount[i].addEventListener("touchend", function(){
			this.classList.remove("tapped");
		});
		tappedElementCount[i].addEventListener("touchcancel", function(){
			this.classList.remove("tapped");
		});
		tappedElementCount[i].addEventListener("touchleave", function(){
			this.classList.remove("tapped");
		});
	}
}