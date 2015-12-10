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





var fireAppInit = function(){
	if (fireappload != undefined){
		events.publish('/fire/page/load/');
		setTimeout(function(){
			events.publish('/fire/page/load/');
		}, 500);
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

	console.log(num_of_images);
	console.log(img_loaded);

	var imgload = events.subscribe('/img/loaded/', function(){
		img_loaded++;

		console.log('/img/loaded/ | images loaded' + img_loaded);
		if (img_loaded === num_of_images) {
			console.log('equal images');
			fireAppInit();
			imgload.remove();
		}
	});

	if (num_of_images > 0){
		for (var i = 0; i < num_of_images; i++){
			console.log(images[i]);
			if (images[i].complete){
				events.publish('/img/loaded/');
				console.log('image already loaded: ' + img_loaded);
			} else {
				images[i].addEventListener('load', function(ev){
					console.log('images onload event');
					events.publish('/img/loaded/');
				});
			}
		}	
	} else {
		fireAppInit();	
		imgload.remove();
	}
});

var fireappload = events.subscribe('/fire/page/load/', function(){
    var card = document.getElementById("popUpCard");
    var height = card.getBoundingClientRect();
    var bodyEle = document.body.getBoundingClientRect();


 
  
});
           
window.onload=function(){
   console.log("in set height");

   events.publish('/platform/app.init/');
   console.log("done set height");

    var imgELem = document.getElementsByClassName('icons')
   
   for( var i=0;i<imgELem.length;i++) { imgELem[i].classList.add('wcAnimate');}
   document.getElementById('actionPopUp').classList.add('wcAnimate2');
   document.getElementById('laterBtn').classList.add('wcAnimate2');
}











var d0pop = (function(){

	var api={} ,state = {current:0 } ,data ={},cache = {};

	cache = {
				exploreBtn : document.getElementById('exploreBtn'),
				// feature1   : document.getElementById('feature1'),
				// feature2   : document.getElementById('feature2'),
				// feature3   : document.getElementById('feature3'),
				// feature4   : document.getElementById('feature4'),
				// feature5   : document.getElementById('feature5'),
				// feature6   : document.getElementById('feature6'),
				// feature1   : document.getElementById('feature1'),
				actionPopUp: document.getElementById('actionPopUp'),
				laterBtn   : document.getElementById('laterBtn'),
				homeBtn    : document.getElementById('homeBtn'),
				skipBtn    : document.getElementById('skipBtn'),
				nextBtn    : document.getElementById('nextBtn'),
				backBtn    : document.getElementById('backBtn'),
				popUpCard  : document.getElementById('popUpCard')



	};

	api = {

		init:function(){
				api.bindHandlers();

		},


		bindHandlers:function(){

				cache.exploreBtn.onclick = function(){
					cache.actionPopUp.style.zIndex = "0";
					state.current++;
					api.showFeature();
					api.toggleHomeScreen('hide');
						
				};

				cache.homeBtn.onclick = function(){
						// navigate to home screen
				}				

				cache.nextBtn.onclick = function(){

					api.hideScreen();
					state.current++;
					api.showFeature();

				}

				cache.backBtn.onclick = function(){

					api.hideScreen();
					state.current--;
					api.showFeature();
				}


				cache.skipBtn.onclick = function(){
						api.dismissPopUp();
				}

				cache.laterBtn.onclick = function(){
						api.dismissPopUp();
				}

		},

		dismissPopUp:function(){
			popupBridge.onSubmit("{'screen':'cancel'}", null);
		},

		showFeature:function(){
			var feature = api.getCurrentFeature();
			feature.style.display="block";
			feature.classList.add('showElemCls');
						
			window.setTimeout(function(){
				feature.classList.add(feature.getAttribute('id')+'Cls');
			},200);				
		},

		hideScreen:function(){
			var feature = api.getCurrentFeature();
			feature.style.display="none";
			feature.classList.add('hideElem');

		},

		toggleHomeScreen:function(action){
			if(action=='show'){
				popUpCard.style.display	= "block";
				popUpCard.classList.add('showElemCls');
			}
			else if(action=='hide'){
				popUpCard.style.display	= "none";
				popUpCard.classList.add('hidelem');
			}
		},


		getCurrentFeature:function(){
			var feature = document.getElementById('feature'+state.current);
			var startFeatureName = feature.getAttribute('data-anim-name');
			return document.getElementById(startFeatureName);

		}


	}

	return api;



	
})();


d0pop.init();


