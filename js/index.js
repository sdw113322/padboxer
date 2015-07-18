var Index = (function() {
	var modal = {};
	var name = [];
	var evolution = [];
	var ultimate = [];
	var complete = [false,false,false];
	
	function loadingComplete( id ){
		modal.trigger("success",[id]);
		complete[id - 1] = true;
		for(var i=0;i<3;i++){
			if(complete[i] === false)
				return;
		}
		modal.modal('hide');
	}
	function externalLoad(){
		modal.modal('show');
		$.ajax({
			dataType: 'jsonp',
			url: "http://tidal-outlook-93517.appspot.com/source3.php", 
			success: function(data){
				var string = JSON.stringify(data);
				window.localStorage.padboxer_name = string;
				loadingComplete(3);
			},
			error: function(request,error) 
			{
			 //alert ( "錯誤: " + error );
			}
		});
		$.ajax({
			dataType: 'jsonp',
			url: "http://tidal-outlook-93517.appspot.com/source1.php", 
			success: function(data){
				var string = JSON.stringify(data);
				window.localStorage.padboxer_evolution = string;
				loadingComplete(1);
			},
			error: function(request,error) 
			{
			 //alert ( "錯誤: " + error );
			}
		});
		$.ajax({
			dataType: 'jsonp',
			url: "http://tidal-outlook-93517.appspot.com/source2.php", 
			success: function(data){
				var string = JSON.stringify(data);
				window.localStorage.padboxer_ultimate = string;
				loadingComplete(2);
			},
			error: function(request,error) 
			{
			 //alert ( "錯誤: " + error );
			}
		});
		window.localStorage.padboxer_time = new Date();
	}
	
	return{
		setModal: function(input){
			modal = input;
		},
		load: function(){
			if(window.localStorage.getItem("evolution") !== null){
				//for version <= 2.3
				window.localStorage.removeItem("time");
				window.localStorage.removeItem("name");
				window.localStorage.removeItem("evolution");
				window.localStorage.removeItem("ultimate");
				externalLoad();
			}else if(window.localStorage.getItem("padboxer_time") === null){
				//for new user
				externalLoad();
			}else{
				//test if update time is 7 days before or not
				var now = new Date();
				var updated = new Date(window.localStorage.padboxer_time);
				if(now - updated > (86400000 * 7))
					externalLoad();
			}
			name = JSON.parse(window.localStorage.padboxer_name);
			evolution = JSON.parse(window.localStorage.padboxer_evolution);
			ultimate = JSON.parse(window.localStorage.padboxer_ultimate);
		},
		get: function(no,item){
			switch(item){
				case "name":
				for(var i in name)
					if(Number(name[i].no) === no)
						return name[i];
				break;
				case "evolution":
				for(var j in evolution)
					if(Number(evolution[j].no) === no)
						return evolution[j];
				break;
				case "ultimate":
				var result = [];
				for(var k in ultimate)
					if(Number(ultimate[k].no) == no)
						result.push(ultimate[k]);
				break;		
			}
		}	
	}
})();