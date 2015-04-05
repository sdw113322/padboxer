var Material = (function() {
	var materials = [];
	function countMaterial() {
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		var box = dataLoad("box");
		var allNeed = [];
		var PAllNeed = [];
		for(var i in box){
			var text =  box[i].no;
			var choice =  box[i].choice;
			var priority = box[i].priority;
			var quantity = box[i].quantity;
			if(text in evolution){
				if(evolution[text].status == 'y'){
					var j = 0;
					for(j=0;j<evolution[text].need.length;j++){
						if(evolution[text].need[j] in allNeed){
							allNeed[evolution[text].need[j]] += Number(quantity);
						}else{
							allNeed[evolution[text].need[j]] = Number(quantity);
						}
						if(priority>0)
							if(evolution[text].need[j] in PAllNeed)
								PAllNeed[evolution[text].need[j]] += Number(priority);
							else
								PAllNeed[evolution[text].need[j]] = Number(priority);
					}
				}
				else if(evolution[text].status == 'u'){
					if(choice > 0){
						var k = 1;
						var ultimateNeed = ultimate[k].need;
						while(ultimate[k].result!=choice){
							k++;
							ultimateNeed = ultimate[k].need;
						}
						for(j=0;j<ultimateNeed.length;j++){
							if(ultimateNeed[j] in allNeed){
								allNeed[ultimateNeed[j]] += Number(quantity);
							}else{
								allNeed[ultimateNeed[j]] = Number(quantity);
							}
							if(priority>0)
								if(ultimateNeed[j] in PAllNeed)
									PAllNeed[ultimateNeed[j]] += Number(priority);
								else
									PAllNeed[ultimateNeed[j]] = Number(priority);
						}
					}
				}
			}
			for(var i in materials){
				var need = allNeed[materials[i].no];
				var Pneed = PAllNeed[materials[i].no];
				if(need != undefined)
					materials[i].need = need;
				if(Pneed != undefined)
					materials[i].Pneed = Pneed;
			}
		}
	}
    function transform( no ) { 
        var x = -1;
		for(var key in materialAttr){
			if(materialAttr[key].no == no)
				x = key;
		}
		if(x === -1)
			return false;
		else
			return [x, true];
    }
	function change( id , mode ) {
		if(mode === "normal"){
			$("#material button[data-id='" + id + "']").parent().parent().parent().children().eq(3).text(materials[id].quantity);
			$("#material button[data-id='" + id + "']").parent().parent().parent().children().eq(4).text(materials[id].need);
			$("#material button[data-id='" + id + "']").parent().parent().parent().children().eq(5).text(materials[id].quantity - materials[id].need);
		}else if(mode ==="priority"){
			$("#material button[data-id='" + id + "']").parent().parent().parent().children().eq(6).text(materials[id].Pneed);
			$("#material button[data-id='" + id + "']").parent().parent().parent().children().eq(7).text(materials[id].quantity - materials[id].Pneed);
		}
	}
	function getState( id ) {
		var available = materials[id].quantity;
		var total = materials[id].quantity - materials[id].need;
		if(total > 0)
			return "notation-success";
		else if(total <= 0 && available > 0)
			return "notation-warning";
		else
			return "notation-important";
	}
    return {
		init: function() {
			var string = window.localStorage.getItem("material");
			if(string === null){
				string = "[{\"no\":147,\"quantity\":\"0\"},{\"no\":148,\"quantity\":0},{\"no\":149,\"quantity\":0},{\"no\":150,\"quantity\":0},{\"no\":151,\"quantity\":0},{\"no\":321,\"quantity\":0},{\"no\":1176,\"quantity\":0},{\"no\":161,\"quantity\":0},{\"no\":171,\"quantity\":0},{\"no\":166,\"quantity\":0},{\"no\":162,\"quantity\":0},{\"no\":172,\"quantity\":0},{\"no\":167,\"quantity\":0},{\"no\":1294,\"quantity\":0},{\"no\":163,\"quantity\":0},{\"no\":173,\"quantity\":0},{\"no\":168,\"quantity\":0},{\"no\":1295,\"quantity\":0},{\"no\":164,\"quantity\":0},{\"no\":174,\"quantity\":0},{\"no\":169,\"quantity\":0},{\"no\":165,\"quantity\":0},{\"no\":175,\"quantity\":0},{\"no\":170,\"quantity\":0},{\"no\":234,\"quantity\":0},{\"no\":152,\"quantity\":0},{\"no\":153,\"quantity\":0},{\"no\":154,\"quantity\":0},{\"no\":227,\"quantity\":0},{\"no\":1085,\"quantity\":0},{\"no\":1086,\"quantity\":0},{\"no\":1087,\"quantity\":0},{\"no\":155,\"quantity\":0},{\"no\":156,\"quantity\":0},{\"no\":157,\"quantity\":0},{\"no\":158,\"quantity\":0},{\"no\":159,\"quantity\":0},{\"no\":160,\"quantity\":0},{\"no\":246,\"quantity\":0},{\"no\":247,\"quantity\":0},{\"no\":248,\"quantity\":0},{\"no\":249,\"quantity\":0},{\"no\":250,\"quantity\":0},{\"no\":251,\"quantity\":0},{\"no\":915,\"quantity\":0},{\"no\":916,\"quantity\":0},{\"no\":1325,\"quantity\":0},{\"no\":1326,\"quantity\":0},{\"no\":1327,\"quantity\":0},{\"no\":1328,\"quantity\":0},{\"no\":1329,\"quantity\":0}]";
				window.localStorage.material = string;
			}
			materials = JSON.parse(string);
			if(materials.length==46){
				materials[46] = JSON.parse("{\"no\":1325,\"quantity\":0}");
				materials[47] = JSON.parse("{\"no\":1326,\"quantity\":0}");
				materials[48] = JSON.parse("{\"no\":1327,\"quantity\":0}");
				materials[49] = JSON.parse("{\"no\":1328,\"quantity\":0}");
				materials[50] = JSON.parse("{\"no\":1329,\"quantity\":0}");
			}
			for(var i=0;i<51;i++){
				materials[i].need = 0;
				materials[i].Pneed = 0;
			}
			countMaterial();
		},
		init_new: function(){
			materials = Data.get("material");
			for(var i=0;i<51;i++){
				materials[i].need = 0;
				materials[i].Pneed = 0;
			}
			countMaterial();
		},
		needPlus: function( no , quantity ) {
			quantity = Number(quantity);
			var index = transform( no );
			if(index[1] != false){
				materials[index[0]].need += quantity;
				change(index[0],"normal");
			}
		},
		needMinus: function( no , quantity ) {
			quantity = Number(quantity);
			var index = transform( no );
			if(index[1] != false){
				materials[index[0]].need -= quantity;
				change(index[0],"normal");
			}
		},
		quantityPlus: function(id){
			materials[id].quantity ++;
		},
		quantityMinus: function(id){
			materials[id].quantity --;
		},
		setQuantity: function(id,quantity){
			quantity = Number(quantity);
			materials[id].quantity = quantity;
		},
		evolution: function( no , quantity ) {
			quantity = Number(quantity);
			var index = transform( no );
			if(index[1] != false){
				materials[index[0]].quantity -= quantity;
				materials[index[0]].need -= quantity;
				change(index[0],"normal");
			}
		},
		PneedPlus: function( no , quantity ) {
			quantity = Number(quantity);
			var index = transform( no );
			if(index[1] != false){
				materials[index[0]].Pneed += quantity;
				change(index[0],"priority");
			}
		},
		PneedMinus: function( no , quantity ) {
			quantity = Number(quantity);
			var index = transform( no );
			if(index[1] != false){
				materials[index[0]].Pneed -= quantity;
				change(index[0],"priority");
			}
		},
		Pevolution: function( no , quantity ) {
			quantity = Number(quantity);
			var index = transform( no );
			if(index[1] != false){
				materials[index[0]].Pneed -= quantity;
				change(index[0],"priority");
			}
		},
		state: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				return getState( index[0] );
			else
				return false;
		},
		quantity: function( id ) {
				return materials[id].quantity;
		},
		need:  function( id ) {
				return materials[id].need;
		},
		Pneed: function( id ) {
				return materials[id].Pneed;
		},
		total: function( id ) {
				return materials[id].quantity - materials[id].need;
		},
		Ptotal: function( id ) {
				return materials[id].quantity - materials[id].Pneed;
		}
    };
})();

function NeedMaterial( no , choice ){
	var evolution = JSON.parse(window.localStorage.evolution);
	var ultimate = JSON.parse(window.localStorage.ultimate);
	var result = [];
	var status;
	if(no in evolution){
		if(evolution[no].status == 'y'){
			result = evolution[no].need;
		}
		else if(evolution[no].status == 'u'){
			if(choice > 0){
				var i = 1;
				var ultimateNeed = ultimate[i].need;
				while(ultimate[i].result!=choice){
					i++;
					ultimateNeed = ultimate[i].need;
				}
				result = ultimateNeed;
			}
		}
		if(evolution[no].status == 'u' && choice == 0)
			status = 'un';
		else
			status = evolution[no].status;
		return{
			result : result,
			status : status
		};
	}else return false;
}