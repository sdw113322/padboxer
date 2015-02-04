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
		needPlus: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,1,-1,"normal");
		},
		needMinus: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,-1,1,"normal");
		},
		evolution: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],-1,-1,0,"normal");
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
		PneedPlus: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,1,-1,"priority");
		},
		PneedMinus: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,-1,1,"priority");
		},
		Pevolution: function( no ) {
			var index = transform( no );
			if(index[1] != false)
				change(index[0],0,-1,0,"priority");
		}
    };
})();