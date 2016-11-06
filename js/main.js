(function( $ ) {
	$.fn.addIcon = function( qty_notification , outter_link , no ) {
		no = Number(no);
		var core = function(){
			return $("<img>")
				.attr("src","icon/"+ no +".png")
				.attr("width",36)
				.attr("height",36)
				.attr("class","material-display")//tootipster has been used
				.attr("title",Index.get(no,"name").chinese);
		};
		if(qty_notification == true){
			if(outter_link == null)
				this.append(
					$("<div>").addClass("icon").append(core).append(
						$("<span>").attr("data-no",no)
					)
				);
			else
				this.append(
					$("<div>").addClass("icon").append(
						$("<a>")
						.attr("href",outter_link + no)
						.attr("target","_blank")
						.append(core)
					).append(
						$("<span>").attr("data-no",no)
					)
				);
		}else
			if(outter_link == null)
				this.append(core);
			else
				this.append(
					$("<a>")
					.attr("href",outter_link + no)
					.attr("target","_blank")
					.append(core)
				);
		return this;
	};
	$.fn.showAction = function( priority , no ) {
		$( this ).append($("<div>").addClass("btn-group"));
		$( this ).children().append(
			$("<button>").addClass("btn btn-default").attr("type","button").append(
				$("<span>")
				.addClass("glyphicon glyphicon-plus")
				.attr("title","+1")
			).click(no,function(){
				var id = Number($( this ).parent().parent().parent().attr("id"));
				var mon = Box.get(id);
				Box.edit(id,"quantity",mon.quantity + 1);
				var resort = true;
				boxRowEdit(id);
				$("#mainTable table").trigger("update", [resort]);
				var mats = Material.boxEdit(mon.no,1,mon.choice,false);
				_.each(mats,materialRowEdit);
			})
		);
		$( this ).children().append(
			$("<button>").addClass("btn btn-default").attr("type","button").append(
			$("<span>")
				.addClass("glyphicon glyphicon-star")
				.attr("title","優先進化對象數量+1")
			).click(no,function(){
				var id = Number($( this ).parent().parent().parent().attr("id"));
				var mon = Box.get(id);
				if(mon.priority < mon.quantity){
					Box.edit(id,"priority",mon.priority + 1);
					var resort = true;
					boxRowEdit(id);
					$("#mainTable table").trigger("update", [resort]);
					var mats = Material.boxEdit(mon.no,1,mon.choice,true);
					_.each(mats,materialRowEdit);
				}
			})
		);
		$( this ).children().append(
			$("<button>").addClass("btn btn-default").attr("type","button").append(
					$("<span>")
					.addClass("glyphicon glyphicon-pencil edit-material")
					.attr("title","修改")
				).click(function(){
					$("#box-modal").modal('show');
					var all = $( this ).parent().parent().parent().children().eq(6).text();
					var star = $( this ).parent().parent().parent().children().eq(7).text();
					$("#allQty").val(all).attr("data-original",all);
					$("#allQty").val(all).attr("data-id",$( this ).parent().parent().parent().attr("id"));
					$("#starQty").val(star).attr("data-original",star);
					setTimeout(function(){$("#box-modal input").eq(0).focus();},500);
				})
			);
		
		if(Index.getMaterials(no,undefined).status != "n")
			$( this ).children().append(
				$("<button>").addClass("btn btn-default").attr("type","button").append(
					$("<span>")
					.addClass("glyphicon glyphicon-forward")
					.attr("title","進化")
				).click(no,function(){
					var id = Number($( this ).parent().parent().parent().attr("id"));
					var mon = Box.get(id);
					try{
						var result = Box.evolution(id);
					}catch(e){
						alert(e);
					}finally{
						var resort = true;
						if(result["delete"] !== undefined)
							for(var i in result["delete"])
								$("#mainTable table #" + result["delete"][i]).remove();
						if(result["edit"] !== undefined)
							for(var j in result["edit"])
								boxRowEdit(result["edit"][j]);
						if(result["add"] !== undefined)
							for(var k in result["add"])
								boxRowDisplay(result["add"][k]);
						$("#mainTable table").trigger("update", [resort]);
						var res = Index.getMaterials(mon.no,mon.choice);
						var mats = res.need;
						mats = _.map(mats,function(x){return Number(x);});
						_.each(mats,materialRowEdit);
						if(Setting.get(0) === true){
							var mats2 = Index.getMaterials(Number(res.result),undefined).need;
							mats2 = _.map(mats2,function(x){return Number(x);});
							_.each(mats2,materialRowEdit);
						}
						updateMaterialStatus();
					}
				})
			);
		$( this ).children().append(
				$("<button>").addClass("btn btn-default").attr("type","button").append(
					$("<span>")
					.addClass("glyphicon glyphicon-remove")
					.attr("title","刪除")
				).click(function(){
					var id = Number($(this).parent().parent().parent().attr('id'));
					var mon = Box.get(id);
					Material.boxEdit(mon.no,-mon.quantity,mon.choice,false);
					var mats = Material.boxEdit(mon.no,-mon.priority,mon.choice,true);
					_.each(mats,materialRowEdit);
					Box.remove(id);
					var resort = true;
					$("#mainTable table #" + id).remove();
					$("#mainTable table").trigger("update", [resort]);
					updateMaterialStatus();
				})
			);
		return this;
	};
	$.fn.showNeedMaterial = function( no , id , choice ) {
		var needMaterial = Index.getMaterials(no,choice);
		if(Index.get(no,"evolution").status == 'n'){
			$( this ).text("無法進化");
		}else if(Index.get(no,"evolution").status === 'u' && choice === undefined){
			$( this ).append($("<button>")
				.text("請選取究極進化分支")
				.addClass("btn btn-warning")
				.attr("data-toggle","modal")
				.attr("data-target","#ultimateBranch")
				.click(id,function(){
					$.each(Index.get(no,"ultimate"),function(index,value){
						var name = Index.get(value.result,"name");
						$("#ultimateBranch .modal-body form").append($("<div>")
							.addClass("radio")
							.append($("<label>").append($("<input>")
								.attr("type","radio")
								.attr("value",value.result)
								.attr("data-id",id)
								.attr("name","ultimateChoose")
							).append("   " + value.result + " - " + name.chinese + " - " + name.japanese )
							)
						);
					});
				})
			);
		}else{
			for(var key in needMaterial.need){
				$( this ).addIcon(Setting.get(1),Setting.get(2),needMaterial.need[key]);
				if(key < needMaterial.need.length - 1)
					$( this ).append(" ");
			}
		}
		return this;
	};
}( jQuery ));

window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }
	
	if(confirm("是否重新下載資料?")){
		window.localStorage.removeItem("padboxer_time");
		Index.load();
	}else if(confirm("是否清空紀錄?")){
		window.localStorage.clear();
		Index.load();
	}

    return false;
};

function updateMaterialStatus()
{
	$("#mainTable div.icon span").each(function(){
		var materialNo = $( this ).attr("data-no");
		if(Material.state(materialNo) != false){
			$( this ).attr("class","notation " + Material.state(materialNo));
			var x = -1;
			for(var key in materialAttr){
				if(materialAttr[key].no == materialNo)
					x = key;
			}
			if(x!=-1)
				$( this ).text(Material.quantity(x));
		}
	});
}

function materialRowEdit(no){
	$("#material tr").each(function(){
		var mat = Material.get(no);
		if(Number($(this).children().eq(0).text()) === no){
			$(this).children().eq(3).text(mat.quantity);
			$(this).children().eq(4).text(mat.need);
			$(this).children().eq(5).text(mat.quantity - mat.need);
			$(this).children().eq(6).text(mat.Pneed);
			$(this).children().eq(7).text(mat.quantity - mat.Pneed);
		}
	});
}

function boxRowDisplay(id){
	var mon = Box.get(id);
	var row = $("<tr>");
	if(mon.hasOwnProperty('choice'))
		row.attr('data-choice', mon.choice );
	row.attr( 'id' , mon.id ).attr( 'data-priority' , mon.priority );
	row.append($(" <td> ").text( mon.no ));
	//顯示圖片
	row.append($("<td>").addIcon(false,Setting.get(2),mon.no));
	//顯示中文名
	row.append($("<td>").text(Index.get(mon.no,"name").chinese));
	//顯示日文名
	row.append($("<td>").text(Index.get(mon.no,"name").japanese));
	//顯示進化素材
	row.append($("<td>").showNeedMaterial(mon.no,id,mon.choice));
	if(Index.getMaterials(mon.no,mon.choice).result !== undefined)
		row.append($("<td>").addIcon(false,Setting.get(2),Index.getMaterials(mon.no,mon.choice).result));
	else
		row.append($("<td>"));
	//顯示數量
	row.append($("<td>").text(mon.quantity).addClass("number"));
	row.append($("<td>").text(mon.priority).addClass("number"));
	//顯示動作
	row.append($("<td>").showAction($( this ).attr("data-priority"),mon.no));
	row.tooltipster(); //active tooltipster
	for(k=0;k<9;k++){
		if(Setting.get(3)[k] === false)
			row.children().eq(k).css( "display", "none" );
	}
	$("#mainTable tbody").append(row);
}

function boxRowEdit(id){
	var mon = Box.get(id);
	$("tr#" + id).children().eq(6).text(mon.quantity);
	$("tr#" + id).children().eq(7).text(mon.priority);
}

function boxDisplay()
{
	var all = Box.allMonsters();
	
	$("#mainTable").append($("<table>")
		.append("<thead><tr><th>No.</th><th></th><th>中文名</th><th>日文名</th><th>進化素材</th><th>目標</th><th>數量</th><th>★數量</th><th>動作</th></tr></thead>")	
		.append($("<tbody>"))
	);
	for(var i=0;i<all.length;i++){
		boxRowDisplay(all[i]);
	}
}

function materialDisplay( material , mode )
{
	$("#material").empty();
	$("#material").append($("<div>").addClass("row").append($("<div>").addClass("material-body col-md-8")));
	for(var i in materialTemplate[mode][0]){
		$("#material .material-body").append(
			$("<div>").addClass("mainTable").append(
				$("<h2>").text(materialTemplate[mode][2][i])
			).append(
				$("<table>").attr("id",materialTemplate[mode][1][i]).append(
					$("<thead>").append(
						$("<tr>").append(
							$("<th>").text("No.")
						).append(
							$("<th>")
						).append(
							$("<th>").text("名稱")
						).append(
							$("<th>").text("現有")
						).append(
							$("<th>").text("需要")
						).append(
							$("<th>").text("總計")
						).append(
							$("<th>").html("優先<br />需要").addClass("priority")
						).append(
							$("<th>").html("優先<br />總計").addClass("priority")
						).append(
							$("<th>").text("動作")
						)
					)
				).append($("<tbody>"))
			)
		);
	}
	$("#material .row").append(
		$("<div>").addClass("col-md-4").append(
			$("<div>").addClass("material-sidebar").append(
				$("<div>").addClass("panel panel-default")
				.append($("<div>").addClass("list-group")
				)
				.append(
					$("<div>").addClass("panel-heading").append("分類方法")
				)
				.append(
					$("<div>").addClass("panel-body")
						.append($("<div>").addClass("radio").append($("<label>").append($("<input>").attr("type","radio").attr("name","setting5").attr("value",0)).append("依星期分類")))
						.append($("<div>").addClass("radio").append($("<label>").append($("<input>").attr("type","radio").attr("name","setting5").attr("value",1)).append("依屬性分類")))
				)
			)
		)
	);
	if(Setting.get(5) != undefined)
		$('input[name="setting5"][value="'+ Setting.get(5) +'"]').attr('checked',true);
	else
		$('input[name="setting5"][value=0]').attr('checked',true);
	
	$('input[name="setting5"]').click(function(){
		var type = this.value;
		type = Number(type);
		Setting.edit(5,type);
		materialDisplay( material , type );
	});
	$("#material .list-group").append($("<a>").addClass("list-group-item").attr("href","#").attr("onclick","scroll(0,0)").append("TOP"));
	for(var i in materialTemplate[mode][0]){
		$("#material .list-group").append($("<a>").addClass("list-group-item").attr("href","#" + materialTemplate[mode][1][i]).append(materialTemplate[mode][2][i]));
	}
	for(var key1 in materialTemplate[mode][0]){
		for(var key2 in materialTemplate[mode][0][key1]){
			$("#" + materialTemplate[mode][1][key1] + " tbody").append(
				$("<tr>").addClass(materialAttr[materialTemplate[mode][0][key1][key2]].element).append(
					$("<td>").text(materialAttr[materialTemplate[mode][0][key1][key2]].no)
				).append(
					$("<td>").addIcon(false,Setting.get(2),materialAttr[materialTemplate[mode][0][key1][key2]].no)
				).append(
					$("<td>").text(materialAttr[materialTemplate[mode][0][key1][key2]].name)
				).append(
					$("<td>").text(Material.quantity(materialTemplate[mode][0][key1][key2])).addClass("number")
				).append(
					$("<td>").text(Material.need(materialTemplate[mode][0][key1][key2])).addClass("number")
				).append(
					$("<td>").text(Material.total(materialTemplate[mode][0][key1][key2])).addClass("number")
				).append(
					$("<td>").text(Material.Pneed(materialTemplate[mode][0][key1][key2])).addClass("number priority")
				).append(
					$("<td>").text(Material.Ptotal(materialTemplate[mode][0][key1][key2])).addClass("number priority")
				).append(
					$("<td>").append(
						$("<div>").addClass("btn-group").append(
							$("<button>").addClass("btn btn-default").attr("type","button").attr("data-id",materialTemplate[mode][0][key1][key2]).append(
								$("<span>").addClass("glyphicon glyphicon-plus add-material").attr("title","+1")
							).click(function(){
								var id = $(this).attr('data-id');
								_.debounce( addMaterial(id) , 250);
							})
						).append(
							$("<button>").addClass("btn btn-default").attr("type","button").attr("data-id",materialTemplate[mode][0][key1][key2]).append(
								$("<span>").addClass("glyphicon glyphicon-minus minus-material").attr("title","-1")
							).click(function(){
								var id = $(this).attr('data-id');
								_.debounce(minusMaterial(id), 250);
							})
						).append(
							$("<button>").addClass("btn btn-default").attr("type","button").attr("data-id",materialTemplate[mode][0][key1][key2]).append(
								$("<span>").addClass("glyphicon glyphicon-pencil edit-material").attr("title","修改")
							).click(function(){
								var id = Number($(this).attr('data-id'));
								$("#material-modal").modal('show');
								$("#material-modal input").val(Material.quantity(id));
								$("#material-modal input").attr("data-id",id);
								setTimeout(function(){$("#material-modal input").focus();},500);
							})
						)
					)
				)
			);
		}
	}
	SetMaterialSidebarPosition();
	if(Setting.get(4) === true)
		$("#material tr").each(function(){
			$(this).children().eq(6).hide();
			$(this).children().eq(7).hide();
		});
}

function boxReset()
{
	$("#mainTable table").remove();
}

function internalLoad( load_times )
{
	var data_date = new Date(window.localStorage.padboxer_time);
	var curr_date = data_date.getDate();
	var curr_month = data_date.getMonth();
	curr_month++;
	var curr_year = data_date.getFullYear();
	$(".data-date").text(curr_year + "/" + curr_month + "/" + curr_date);
	
	boxDisplay();
	if(Setting.get(5) == undefined)
		materialDisplay(material,0);
	else
		materialDisplay(material,Setting.get(5));
	
	$(".material-display").tooltipster(); //active tooltipster
	$("#material tbody tr").each(function(){
		var no = Number($(this).children().first().text());
		var mat = Material.get(no);
		$(this).children().eq(4).text(mat.need);
		$(this).children().eq(5).text(mat.quantity - mat.need);
		$(this).children().eq(6).text(mat.Pneed);
		$(this).children().eq(7).text(mat.quantity - mat.Pneed);
	});
	for(var i=0;i<9;i++){
			if(Setting.get(3)[i] === false)
				$("#mainTable tr").each(function(){$(this).children().eq(i).css( "display", "none" );});
		}
	updateMaterialStatus();
	$("#mainTable table").tablesorter();
}

function addMaterial( id )
{
	Material.drift(id,1);
	$("#material tr").each(function(){
		if($(this).children().eq(8).children().children().attr("data-id") == id){
			var available = Number($(this).children().eq(3).text()) + 1;
			var total = Number($(this).children().eq(5).text()) + 1;
			var Ptotal = Number($(this).children().eq(7).text()) + 1;
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
			$(this).children().eq(7).text(Ptotal);
		}
	});
	updateMaterialStatus();
}

function minusMaterial( id )
{
	Material.drift(id,-1);
	$("#material tr").each(function(){
		if($(this).children().eq(8).children().children().attr("data-id") == id){
			var available = Number($(this).children().eq(3).text()) - 1;
			var total = Number($(this).children().eq(5).text()) - 1;
			var Ptotal = Number($(this).children().eq(7).text()) - 1;
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
			$(this).children().eq(7).text(Ptotal);
		}
	});
	updateMaterialStatus();
}

function addMonster(no,times,box,from)
{
	var id = Box.add(no,times,from);
	var mats = Material.boxEdit(no,times,undefined,false);
	_.each(mats,materialRowEdit);
	var resort = true;
	boxRowDisplay(id);
	$("#mainTable table").trigger("update", [resort]);
	$("#add input[name='no']").val("");
	$("#add input[name='quantity']").val("1");
	updateMaterialStatus();
	$(".material-display").tooltipster(); //active tooltipster
} 
/* center modal */
function centerModals(){
  $('.modal').each(function(i){
    var $clone = $(this).clone().css('display', 'block').appendTo('body');
    var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
    top = top > 0 ? top : 0;
    $clone.remove();
    $(this).find('.modal-content').css("margin-top", top);
  });
}
function SetMaterialSidebarPosition(){
	var $this = $(window);
	if($this.scrollTop() < 300)
		$(".material-sidebar").css({
			top: 360-$this.scrollTop()
		});
	else
		$(".material-sidebar").css({
			top: 60
		});
}
$(document).ready(function() {
	$('.modal').on('show.bs.modal', centerModals);
	$(window).on('resize', centerModals);
	$("#btn-add").removeAttr("disabled");
	
	Data.load();
	Setting.load();
	$('#loading-modal').on('success',function(event,id){
		$("#loading" + id).removeClass("danger").addClass("success").children().first().text("完成");
	});
	Index.setModal($('#loading-modal'));
	Index.load();
	Box.load();
	Material.load();
	
	internalLoad();
	
	/*
	try {
		JSON.parse(window.localStorage.setting);
	} catch (e) {
		alert("Error! Invalid JSON string\ncontent:\n" + window.localStorage.setting);
		setting_err = true;
	}
	*/
	
	var err = false;
	$("#add #btn-add-enter").click(function(){
		var a = Number($("#add input[name='no']").val());
		var b = Number($("#add input[name='quantity']").val());
		if(Index.get(a,"evolution") !== undefined){
			_.debounce(addMonster(a,b,null,null), 250);
			$("#add input[name='no']").parent().removeClass("has-error");
		}else
			$("#add input[name='no']").parent().addClass("has-error");
	});
	$("#ultimateBranch .btn-primary").click(function(){
		var branchChoice = Number($("input[type='radio']:checked", "#ultimateBranch").val());
		var id = Number($("input[type='radio']:checked", "#ultimateBranch").attr("data-id"));
		Box.edit(id,"choice",branchChoice);
		$("#mainTable table tr[id='"+ id +"']").children().eq(4).empty().showNeedMaterial(Box.get(id).no,id,branchChoice);
		$("#mainTable table tr[id='"+ id +"']").children().eq(5).addIcon(false,Setting.get(2),branchChoice);
		$("#mainTable table tr[id='"+ id +"']").attr("data-choice",branchChoice);
		$(".material-display").tooltipster(); //active tooltipster
		Material.boxEdit(Box.get(id).no,Box.get(id).priority,Box.get(id).choice,true);
		var mats = Material.boxEdit(Box.get(id).no,Box.get(id).quantity,Box.get(id).choice,false);
		_.each(mats,materialRowEdit);
		updateMaterialStatus();
		$('#ultimateBranch').modal('hide');
	});
	$('#ultimateBranch').on('hidden.bs.modal', function (e) {
		$("#ultimateBranch .modal-body form").remove();
		$("#ultimateBranch .modal-body").append($("<form>"));
	});
	$("#btn-add").click(function(){
		$("#add").show( 400 );
		$("#btn-add").addClass("active");
		$( "#add input[name='no']" ).focus();
	});
	$("#btn-add-preview").click(function(){
		var no = $("#add input[name='no']").val();
		var qty = $("#add input[name='quantity']").val();
		$("#preview-modal .modal-body").empty().append($("<span>").attr("id","preview-status"));
		$("#preview-modal h4").text(no + " - " + Index.get(no,"name").chinese);
		if(Index.get(no,"evolution").status == "y"){
			$("#preview-modal #preview-status").text("可以進化")
			$("#preview-modal .modal-body").append($("<h5>").text( "進化為 " + Index.get(no,"evolution").result +" - "+Index.get(Index.get(no,"evolution").result,"name").chinese + "需要：" ));
			$("#preview-modal .modal-body").append($("<table>").addClass("table table-bordered").append($("<thead>").append($("<tr>").append($("<th>")).append($("<th>").text("名稱")).append($("<th>").text("現有")).append($("<th>").text("總共")))));
			for(var key in Index.get(no,"evolution").need){
				$("#preview-modal .modal-body table").append($("<tr>")
					.append($("<td>").addIcon(false,Setting.get(2),Index.get(no,"evolution").need[key]))
					.append($("<td>").text(Index.get(no,"evolution").need[key] + " - " + Index.get(Index.get(no,"evolution").need[key],"name").chinese))
					.append($("<td>").text($("#material table tr td:first-child:contains('" + Index.get(no,"evolution").need[key] + "')").next().next().next().text()))
					.append($("<td>").text($("#material table tr td:first-child:contains('" + Index.get(no,"evolution").need[key] + "')").next().next().next().next().next().text()))
				);
			}
		}else if(Index.get(no,"evolution").status == "u"){
			$("#preview-modal #preview-status").text("可以究極進化");
			var ultimateResult = [];
			if(ultimateResult.length > 0)
			ultimateResult.length = 0;
			ultimateResult = Index.get(no,"ultimate");
			$.each(ultimateResult,function(index,value){
				$("#preview-modal .modal-body").append($("<h5>").text( "進化為 " + value.result +" - "+Index.get(value.result,"name").chinese + "需要：" ));
				$("#preview-modal .modal-body").append($("<table>").addClass("table table-bordered").attr("data-number",index).append($("<thead>").append($("<tr>").append($("<th>")).append($("<th>").text("名稱")).append($("<th>").text("現有")).append($("<th>").text("總共")))));
				for(var key in value.need){
					$("#preview-modal .modal-body table[data-number='"+ index +"']").append($("<tr>")
						.append($("<td>").addIcon(false,Setting.get(2),value.need[key]))
						.append($("<td>").text(value.need[key] + " - " + Index.get(value.need[key],"name").chinese))
						.append($("<td>").text($("#material table tr td:first-child:contains('" + value.need[key] + "')").next().next().next().text()))
						.append($("<td>").text($("#material table tr td:first-child:contains('" + value.need[key] + "')").next().next().next().next().next().text()))
					);
				}
			});
		}else
			$("#preview-modal #preview-status").text("不能進化");
	});
	$(".btn-add-hide").click(function(){
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});
	$("#btn-material").click(function(){
		$("#mainTable").hide( 400 );
		$("#about").hide( 400 );
		window.setTimeout("$(\"#material\").show( 400 );",400);
		$("#btn-add").attr("disabled","disabled");
		$("#btn-material").parent().addClass("active").siblings('.active').removeClass('active');
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});	
	$("#btn-box").click(function(){
		$("#material").hide( 400 );
		$("#about").hide( 400 );
		window.setTimeout("$(\"#mainTable\").show( 400 );",400);
		$("#btn-add").removeAttr("disabled");
		$("#btn-box").parent().addClass("active").siblings('.active').removeClass('active');
	});	
	$("#btn-about").click(function(){
		$("#mainTable").hide( 400 );
		$("#material").hide( 400 );
		window.setTimeout("$(\"#about\").show( 400 );",400);
		$("#btn-about").parent().addClass("active").siblings('.active').removeClass('active');
		$("#btn-add").attr("disabled","disabled");
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});	
	$("#add input").keyup(function(event){
		if(event.keyCode == 13 && $("#add").is(":visible")){
			$("#add #btn-add-enter").click();
		}
	});
	$("#material-modal input").keyup(function(event){
		if(event.keyCode == 13 && $("#material-modal").is(":visible")){
			$("#material-modal .btn-primary").click();
		}
	});
	$("#box-modal input").keyup(function(event){
		if(event.keyCode == 13 && $("#box-modal").is(":visible")){
			$("#box-modal .btn-primary").click();
		}
	});
	$("#clear").click(function(){
		var accept = confirm ("真的要清空嗎？");
		if(accept == true){
			window.localStorage.clear();
			document.location.reload(true);
		}
	});
	$("#backup").click(function(){
		var backup = Data.backup;
		$("#backup-modal .modal-body textarea").val(backup);
	});
	$("#backup-modal .btn-primary").click(function(){
		var backup = Data.backup;
		var blob = new Blob([backup], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "padboxer-backup.txt");
	});
	$("#material-modal .btn-primary").click(function(){
		var value = Number($("#material-modal .modal-body form input").val());
		var id = Number($("#material-modal .modal-body form input").attr("data-id"));
		Material.edit(id,value);
		$("#material tr").each(function(){
			if($(this).children().eq(8).children().children().attr("data-id") == id){
				var available = value;
				var total = value - Number($(this).children().eq(4).text());
				var Ptotal = value - Number($(this).children().eq(6).text());
				$(this).children().eq(3).text(available);
				$(this).children().eq(5).text(total);
				$(this).children().eq(7).text(Ptotal);
			}
		});
		updateMaterialStatus();
		$('#material-modal').modal('hide');
	});
	$("#box-modal .btn-primary").click(function(){
		var allValue = Number($("#allQty").val());
		var starValue = Number($("#starQty").val());
		if(allValue < 0 || starValue < 0){
			alert("Error!\n數量不可小於0");
			$('#box-modal').modal('hide');
			return;
		}
		if(allValue >= starValue){
			var allOriginal = Number($("#allQty").attr("data-original"));
			var starOriginal = Number($("#starQty").attr("data-original"));
			var id = Number($("#allQty").attr("data-id"));
			Box.edit(id,"quantity",allValue);
			Box.edit(id,"priority",starValue);

			$("#mainTable tr").each(function(){
				if($(this).attr("id") == id){
					$(this).children().eq(6).text(allValue);
					$(this).children().eq(7).text(starValue);
				}
			});
			
			var allDiff = allValue - allOriginal;
			var starDiff = starValue - starOriginal;
			Material.boxEdit(Box.get(id).no,allDiff,Box.get(id).choice,false);
			var mats = Material.boxEdit(Box.get(id).no,starDiff,Box.get(id).choice,true);
			_.each(mats,materialRowEdit);

			updateMaterialStatus();
		}else{
			alert("Error!\n優先數量大於所有數量");
		}
		$('#box-modal').modal('hide');
	});
	$("#import-modal #importOld").click(function(){
		var value = $("#import-modal .modal-body textarea").val();
		var splits = value.split("      ");
		try{
			JSON.parse(splits[1]);
			JSON.parse(splits[2]);
			JSON.parse(splits[3]);
		}catch(e){
			alert(e);
		}finally{
			Data.edit("boxid",Number(splits[0]));
			Data.edit("box",JSON.parse(splits[1]));
			Data.edit("material",JSON.parse(splits[2]));
			Data.edit("setting",JSON.parse(splits[3]));
			document.location.reload(true);
		}
		$("#import-modal .modal-body textarea").val("");
		$('#import-modal').modal('hide');
	});
	$("#import-modal #importNew").click(function(){
		var value = $("#import-modal .modal-body textarea").val();
		//要加版本判斷機制
		try{
			Data.restore(value);
		}catch(e){
			alert(e);
		}
		document.location.reload(true);
		$("#import-modal .modal-body textarea").val("");
		$('#import-modal').modal('hide');
	});
	$("#import-modal #importFromFile").change(function(event){
		var input = event.target;

		var reader = new FileReader();
		reader.onload = function(){
			var text = reader.result;
			//要加版本判斷機制
			try{
				Data.restore(text);
				document.location.reload(true);
				$("#import-modal .modal-body textarea").val("");
				$('#import-modal').modal('hide');
			}catch(e){
				alert(e);
			}
		};
		reader.readAsText(input.files[0]);
	});
	$("#update").click(function(){
		Index.update();
	});
	$("#update2").click(function(){
		document.location.reload(true);
	});
	$("#preview-modal .btn-primary").click(function(){
		$('#preview-modal').modal('hide');
		var no = $("#add input[name='no']").val();
		var qty = $("#add input[name='quantity']").val();
		_.debounce(addMonster(no,qty,box,null), 250);
	});
	
	
	$("#setting0").prop("checked" , Setting.get(0));
	$("#setting1").prop("checked" , Setting.get(1));
	if(Setting.get(2) === null)
		$("#setting2").val("NULL");
	else
		$("#setting2").val(Setting.get(2));
	$("#setting4").prop("checked" , Setting.get(4));
	
	if(Setting.get(5)==0)
		$("#setting50").prop("checked" , true);
	else
		$("#setting51").prop("checked" , true);
	
	for(var i = 0;i < 9;i++)
		$("#setting3" + i).prop("checked" , Setting.get(3)[i]);
	
	$( "#setting2" ).change(function() {
		var val = $( "#setting2 option:selected" ).val();
		if(val === "NULL")
			Setting.edit(2,null);
		else
			Setting.edit(2,val);
	});
	$( "input[type='checkbox']" ).change(function() {
		var input = $(this).attr("id");
		var inputID;
		switch(input){
			case "setting0":
			inputID = 0;
			break;
			case "setting1":
			inputID = 1;
			break;
			case "setting4":
			inputID = 4;
			break;
			default:
			inputID = 3;
			break;
		}
		if(inputID != 3)
			if($(this).prop( "checked" )){
				Setting.edit(inputID,true);	
			}else{
				Setting.edit(inputID,false);	
			}
		else{
			var rows = document.getElementsByName('setting3[]');
			for (var i = 0, l = rows.length; i < l; i++) {
				if (rows[i].checked) {
					var setting = Setting.get(inputID);
					setting[i] = true;
					Setting.edit(inputID,setting);
					$("#mainTable tr").each(function(){$(this).children().eq(i).show();});
				}else{
					var setting = Setting.get(inputID);
					setting[i] = false;
					Setting.edit(inputID,setting);
					$("#mainTable tr").each(function(){$(this).children().eq(i).hide();});
				}
			}
		}
		if(inputID == 4){
			if(Setting.get(4) === true)
				$("#material tr").each(function(){
					$(this).children().eq(6).hide();
					$(this).children().eq(7).hide();
				});
			else
				$("#material tr").each(function(){
					$(this).children().eq(6).show();
					$(this).children().eq(7).show();
				});
		}
	});
	
	$(window).bind('scroll', SetMaterialSidebarPosition);
	$(".version").append(version);
	$(".icon-date").append(iconDate);
});