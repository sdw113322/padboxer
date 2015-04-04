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
	function change( id , availDiff , needDiff , totalDiff , mode ) {
		var available = $("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text();
		if(mode === "normal"){
			var need = $("#material span[data-id='" + id + "']").parent().parent().children().eq(4).text();
			var total = $("#material span[data-id='" + id + "']").parent().parent().children().eq(5).text();
		}else if(mode ==="priority"){
			var need = $("#material span[data-id='" + id + "']").parent().parent().children().eq(6).text();
			var total = $("#material span[data-id='" + id + "']").parent().parent().children().eq(7).text();
		}
		available = Number(available) + Number(availDiff);
		need = Number(need) + Number(needDiff);
		total = Number(total) + Number(totalDiff);
		$("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text(available);
		if(mode === "normal"){
			$("#material span[data-id='" + id + "']").parent().parent().children().eq(4).text(need);
			$("#material span[data-id='" + id + "']").parent().parent().children().eq(5).text(total);
		}else if(mode ==="priority"){
			$("#material span[data-id='" + id + "']").parent().parent().children().eq(6).text(need);
			$("#material span[data-id='" + id + "']").parent().parent().children().eq(7).text(total);
		}
	}
	function getState( id ) {
		var available = $("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text();
		var total = $("#material span[data-id='" + id + "']").parent().parent().children().eq(5).text();
		if(total > 0)
			return "notation-success";
		else if(total <= 0 && available > 0)
			return "notation-warning";
		else
			return "notation-important";
	}
	function getQuantity( id ) {
		var available = $("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text();
		return available;
	}
    return {
		init: function init() {
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
		needPlus: function( no , quantity ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,quantity,-quantity,"normal");
		},
		needMinus: function( no , quantity ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,-quantity,quantity,"normal");
		},
		evolution: function( no , quantity ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],-quantity,-quantity,0,"normal");
		},
		state: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				return getState( index[0] );
			else
				return false;
		},
		quantity: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				return getQuantity( index[0] );
			else
				return false;
		},
		PneedPlus: function( no , quantity ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,quantity,-quantity,"priority");
		},
		PneedMinus: function( no , quantity ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,-quantity,quantity,"priority");
		},
		Pevolution: function( no , quantity ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,-quantity,0,"priority");
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