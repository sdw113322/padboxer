var materialTab = (function() {
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
			return "badge-success";
		else if(total <= 0 && available > 0)
			return "badge-warning";
		else
			return "badge-important";
	}
	function getQuantity( id ) {
		var available = $("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text();
		return available;
	}
    return {
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