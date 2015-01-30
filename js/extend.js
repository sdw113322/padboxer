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
			return x;
    }
	function change( id , availDiff , needDiff , totalDiff ) {
		var available = $("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text();
		var need = $("#material span[data-id='" + id + "']").parent().parent().children().eq(4).text();
		var total = $("#material span[data-id='" + id + "']").parent().parent().children().eq(5).text();
		available = Number(available) + Number(availDiff);
		need = Number(need) + Number(needDiff);
		total = Number(total) + Number(totalDiff);
		$("#material span[data-id='" + id + "']").parent().parent().children().eq(3).text(available);
		$("#material span[data-id='" + id + "']").parent().parent().children().eq(4).text(need);
		$("#material span[data-id='" + id + "']").parent().parent().children().eq(5).text(total);
	}
    return {
		needPlus: function( no ) {
			var index = transform( no );
			if(index != false)
				change(index,0,1,-1);
		},
		needMinus: function( no ) {
			var index = transform( no );
			if(index != false)
				change(index,0,-1,1);
		},
		evolution: function( no ) {
			var index = transform( no );
			if(index != false)
				change(index,-1,-1,0);
		}
    };
})();