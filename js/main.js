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
				Material.boxEdit(mon.no,1,mon.choice,false);
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
					Material.boxEdit(mon.no,1,mon.choice,true);
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
					var text = $( this ).parent().parent().parent().children().first().text();
					var id = $( this ).parent().parent().parent().attr("id");
					var evolution = JSON.parse(window.localStorage.evolution);
					var ultimate = JSON.parse(window.localStorage.ultimate);
					var box = dataLoad("box");
					var material = dataLoad("material");
					var need = [];
					var notHave = [];
					var result = 0;
					var notIn = [];
					var error = 0;
					var choice = $( this ).parent().parent().parent().attr("data-choice");
					var priority = $( this ).parent().parent().parent().attr("data-priority");
					var quantity = $( this ).parent().parent().parent().children().eq(6);
					var needMaterial = NeedMaterial( text , choice );
					if(needMaterial.status != 'n' && needMaterial.status != 'un'){
						need = needMaterial.result;
						result = evolution[text].result;
					}else if(needMaterial.status == 'n'){
						alert("無法進化");
						error = 1;
					}else{
						alert("錯誤");
						error = 1;
					}
					if(error == 0){
						for(var index in need){
							var i = 0;
							while(material[i].no != parseInt(need[index]) && i<50){
								i++;
							}
							if(material[50].no != parseInt(need[index]) && i==50)
								i++;
							if(i<51){
								material[i].quantity --;
								if(material[i].quantity < 0){
									error = 2;
									notHave.push(need[index]);
								}
							}else{
								notIn.push(need[index]);
							}
						}
					}
					if(error == 0){
						if(notIn.length == 0)
							var accept = confirm ("真的要進化嗎？");
						else
							var accept = confirm ("沒有統計" + notIn + "\n真的要進化嗎？");
					}
					if(error == 0 && accept == true){
						var string = JSON.stringify(material);
						window.localStorage.material = string;
						var offset = 0;
						for(var i in box){
							if(box[i].id == id)
								offset = i;
						}
						if(box[offset].quantity<=1){
							deleteMonster(offset,box);
							$("#mainTable table #" + id).remove();
						}
						else{
							box[offset].quantity--;
							$(this).parent().parent().parent().children().eq(6).text(box[offset].quantity);
						}
						var setting = JSON.parse(window.localStorage.setting);
						var from = 0;
						for(var i in box){
							if(typeof box[i].from != 'undefined')
								if(box[i].from == box[offset].id)
									from = i;
						}
						from = Number(from);
						if(result != 0 && setting[0]){
							if(from === 0){
								addMonster(result,1,box,box[offset].id);
							}
							else{
								box[from].quantity++;
								var fromID = box[from].id;
								var fromQuan = $("tr#" + fromID).children().eq(6).text();
								fromQuan++;
								$("tr#" + fromID).children().eq(6).text(fromQuan);
								var NextNeedMaterial = NeedMaterial( result , 0 );
								var nextNeed = NextNeedMaterial.result;
								for(var i in nextNeed){
									Material.needPlus(nextNeed[i],1);
								}
							}
						}
						for(var index in need){
							Material.evolution(need[index],1);
						}
						if($(this).parent().parent().parent().attr("data-priority")>0){
							var priority = $(this).parent().parent().parent().attr("data-priority");
							priority--;
							$(this).parent().parent().parent().attr("data-priority",priority);
							$(this).parent().parent().parent().children().eq(7).text(priority);
							box[offset].priority--;
							for(var index in need){
								Material.Pevolution(need[index],1);
							}
						}
						string = JSON.stringify(box);
						window.localStorage.box = string;
						var resort = true;
						$("#mainTable table").trigger("update", [resort]);
					}else if(error == 0){
					}
					if(error == 2){
						alert(notHave + "不存在\n無法進化");
					
					}
					updateMeterial();
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
					Material.boxEdit(mon.no,mon.quantity,mon.choice,false);
					Material.boxEdit(mon.no,mon.priority,mon.choice,true);
					Box.remove(id);
					var resort = true;
					$("#mainTable table #" + id).remove();
					$("#mainTable table").trigger("update", [resort]);
					updateMeterial();
				})
			);
		return this;
	};
	$.fn.showNeedMaterial = function( no , id , choice ) {
		var setting = Data.get("setting");
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
				$( this ).addIcon(setting[1],setting[2],needMaterial.need[key]);
				if(key < needMaterial.need.length - 1)
					$( this ).append(" ");
			}
		}
		return this;
	};
}( jQuery ));

function updateMeterial()
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

function boxDisplay()
{
	var i = 0;
	var choice;
	var all = Box.allMonsters();
	var setting = Data.get("setting");
	
	$("#mainTable").append($("<table>")
		.append("<thead><tr><th>No.</th><th></th><th>中文名</th><th>日文名</th><th>進化素材</th><th>目標</th><th>數量</th><th>★數量</th><th>動作</th></tr></thead>")	
		.append($("<tbody>"))
	);
	for(i=0;i<all.length;i++){
		var mon = Box.get(all[i]);
		if(mon.hasOwnProperty('choice'))
			choice = mon.choice;
		else
			choice = 0;
		$("#mainTable tbody").append( $(" <tr> ").attr( 'id' , mon.id ).attr( 'data-choice' , choice ).attr( 'data-priority' , mon.priority )
						.append( $(" <td> ").text( mon.no )));
	}
	$("#mainTable tbody tr").each(function() {
		var id  = Number($(this).attr('id'));
		var mon = Box.get(id);
		var priority = mon.priority;
		var quantity = mon.quantity;
		//顯示圖片
		$( this ).append($("<td>").addIcon(false,setting[2],mon.no));
		//顯示中文名
			$( this ).append($("<td>").text(Index.get(mon.no,"name").chinese));
		//顯示日文名
			$( this ).append($("<td>").text(Index.get(mon.no,"name").japanese));
		//顯示進化素材
		$( this ).append($("<td>").showNeedMaterial(mon.no,id,mon.choice));
		if(Index.getMaterials(mon.no,mon.choice).result !== undefined)
			$( this ).append($("<td>").addIcon(false,setting[2],Index.getMaterials(mon.no,mon.choice).result));
		else
			$( this ).append($("<td>"));
		//顯示數量
		$( this ).append($("<td>").text(mon.quantity).addClass("number"));
		$( this ).append($("<td>").text(mon.priority).addClass("number"));
		//顯示動作
		$( this ).append($("<td>").showAction($( this ).attr("data-priority"),mon.no));
	});
}

function materialDisplay( material , mode )
{
	var setting = Data.get("setting");
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
	if(setting[5] != undefined)
		$('input[name="setting5"][value="'+ setting[5] +'"]').attr('checked',true);
	else
		$('input[name="setting5"][value=0]').attr('checked',true);
	
	$('input[name="setting5"]').click(function(){
		var type = this.value;
		var setting = JSON.parse(window.localStorage.setting);
		type = Number(type);
		setting[5] = type;
		window.localStorage.setting = JSON.stringify(setting);
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
					$("<td>").addIcon(false,setting[2],materialAttr[materialTemplate[mode][0][key1][key2]].no)
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
								$.debounce( 250, addMaterial(id) );
							})
						).append(
							$("<button>").addClass("btn btn-default").attr("type","button").attr("data-id",materialTemplate[mode][0][key1][key2]).append(
								$("<span>").addClass("glyphicon glyphicon-minus minus-material").attr("title","-1")
							).click(function(){
								var id = $(this).attr('data-id');
								$.debounce( 250, minusMaterial(id) );
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
	if(setting[4] === true)
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
	
	var setting = Data.get("setting");
	boxDisplay();
	if(setting[5] == undefined)
		materialDisplay(material,0);
	else
		materialDisplay(material,setting[5]);
	
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
			if(setting[3][i] === false)
				$("#mainTable tr").each(function(){$(this).children().eq(i).css( "display", "none" );});
		}
	updateMeterial();
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
	updateMeterial();
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
	updateMeterial();
}

function addMonster(no,times,box,from)
{
	var id = Box.add(no,times,from);
	
	var resort = true;
	var setting = Data.get("setting");

	$row = $("<tr>").attr("id",id).attr("data-choice",0).attr("data-priority",0)
			.append($("<td>").text(no))
			.append($("<td>").addIcon(false,setting[2],no))
			.append($("<td>").text(Index.get(no,"name").chinese))
			.append($("<td>").text(Index.get(no,"name").japanese))
			.append($("<td>").showNeedMaterial(no,id,undefined))
			.append(function(){
				if(Index.get(no,"evolution").status == "y")
					return $("<td>").addIcon(false,setting[2],Index.get(no,"evolution").result);
				else
					return $("<td>");
			})
			.append($("<td>").text(times).addClass("number"))
			.append($("<td>").text(0).addClass("number"))
			.append($("<td>").showAction(0,no));
	$("#mainTable table").find('tbody').append($row).trigger("addRows", [$row, resort]);
	for(k=0;k<9;k++){
		if(setting[3][k] === false)
			$row.children().eq(k).css( "display", "none" );
	}
	$("#add input[name='no']").val("");
	$("#add input[name='quantity']").val("1");
	updateMeterial();
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
	
	window.localStorage.removeItem("settingA");
	var setting_err = false;
	/*
	try {
		JSON.parse(window.localStorage.setting);
	} catch (e) {
		alert("Error! Invalid JSON string\ncontent:\n" + window.localStorage.setting);
		setting_err = true;
	}
	*/
	if(window.localStorage.getItem("setting") === null || setting_err === true){
		var setting = new Array();
		setting[0] = false;
		setting[1] = false;
		setting[2] = null;
		setting[3] = [true,true,true,true,true,true,true,true,true];
		setting[4] = false;
		setting[5] = 0;
		window.localStorage.setting = JSON.stringify(setting);
		window.localStorage.removeItem("settingA");
	}else{
		var setting = JSON.parse(window.localStorage.setting);
		$("#setting0").prop("checked" , setting[0]);
		$("#setting1").prop("checked" , setting[1]);
		if(setting[2] === null)
			$("#setting2").val("NULL");
		else
			$("#setting2").val(setting[2]);
		if(typeof setting[3] == "undefined"){
			setting[3] = [true,true,true,true,true,true,true,true,true];
			window.localStorage.setting = JSON.stringify(setting);
		}
		if(typeof setting[3][7] == "undefined"){
			setting[3][7] = true;
			setting[3][8] = true;
			window.localStorage.setting = JSON.stringify(setting);
		}
		if(typeof setting[4] == "undefined"){
			setting[4] = false;
			$("#setting4").prop("checked" , false);
		}else
			$("#setting4").prop("checked" , setting[4]);
		if(typeof setting[5] == "undefined"){
			setting[5] = 0;
		}else{
			if(setting[5]==0)
				$("#setting50").prop("checked" , true);
			else
				$("#setting51").prop("checked" , true);
		}
		for(var i = 0;i < 9;i++)
			$("#setting3" + i).prop("checked" , setting[3][i]);
	}
	var err = false;
	$("#add #btn-add-enter").click(function(){
		var a = Number($("#add input[name='no']").val());
		var b = Number($("#add input[name='quantity']").val());
		$.debounce( 250, addMonster(a,b,null,null) );
	});
	$("#ultimateBranch .btn-primary").click(function(){
		var branchChoice = Number($("input[type='radio']:checked", "#ultimateBranch").val());
		var id = Number($("input[type='radio']:checked", "#ultimateBranch").attr("data-id"));
		Box.edit(id,"choice",branchChoice);
		$("#mainTable table tr[id='"+ id +"']").children().eq(4).empty().showNeedMaterial(Box.get(id).no,id,branchChoice);
		$("#mainTable table tr[id='"+ id +"']").children().eq(5).addIcon(false,setting[2],branchChoice);
		$("#mainTable table tr[id='"+ id +"']").attr("data-choice",branchChoice);
		$(".material-display").tooltipster(); //active tooltipster
		Material.boxEdit(Box.get(id).no,Box.get(id).priority,Box.get(id).choice,true);
		Material.boxEdit(Box.get(id).no,Box.get(id).quantity,Box.get(id).choice,false);
		updateMeterial();
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
		var name = JSON.parse(window.localStorage.name);
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		var no = $("#add input[name='no']").val();
		var qty = $("#add input[name='quantity']").val();
		var setting = JSON.parse(window.localStorage.setting);
		$("#preview-modal .modal-body").empty().append($("<span>").attr("id","preview-status"));
		$("#preview-modal h4").text(no + " - " + name[no].chinese);
		if(evolution[no].status == "y"){
			$("#preview-modal #preview-status").text("可以進化")
			$("#preview-modal .modal-body").append($("<h5>").text( "進化為 " + evolution[no].result +" - "+name[evolution[no].result].chinese + "需要：" ));
			$("#preview-modal .modal-body").append($("<table>").addClass("table table-bordered").append($("<thead>").append($("<tr>").append($("<th>")).append($("<th>").text("名稱")).append($("<th>").text("現有")).append($("<th>").text("總共")))));
			for(var key in evolution[no].need){
				
				$("#preview-modal .modal-body table").append($("<tr>")
					.append($("<td>").addIcon(false,setting[2],evolution[no].need[key]))
					.append($("<td>").text(evolution[no].need[key] + " - " + name[evolution[no].need[key]].chinese))
					.append($("<td>").text($("#material table tr td:first-child:contains('" + evolution[no].need[key] + "')").next().next().next().text()))
					.append($("<td>").text($("#material table tr td:first-child:contains('" + evolution[no].need[key] + "')").next().next().next().next().next().text()))
				);
			}
		}else if(evolution[no].status == "u"){
			$("#preview-modal #preview-status").text("可以究極進化");
			var i = 1;
			var ultimateResult = [];
			if(ultimateResult.length > 0)
			ultimateResult.length = 0;
			while(i < ultimate.length){
				if(no == ultimate[i].no)
					ultimateResult.push(ultimate[i]);
				i++;
			}
			$.each(ultimateResult,function(index,value){
				$("#preview-modal .modal-body").append($("<h5>").text( "進化為 " + value.result +" - "+name[value.result].chinese + "需要：" ));
				$("#preview-modal .modal-body").append($("<table>").addClass("table table-bordered").attr("data-number",index).append($("<thead>").append($("<tr>").append($("<th>")).append($("<th>").text("名稱")).append($("<th>").text("現有")).append($("<th>").text("總共")))));
				for(var key in value.need){
					$("#preview-modal .modal-body table[data-number='"+ index +"']").append($("<tr>")
						.append($("<td>").addIcon(false,setting[2],value.need[key]))
						.append($("<td>").text(value.need[key] + " - " + name[value.need[key]].chinese))
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
		var backup = window.localStorage.boxid + "      " + window.localStorage.box + "      " + window.localStorage.material + "      " + window.localStorage.setting;
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
		updateMeterial();
		$('#material-modal').modal('hide');
	});
	$("#box-modal .btn-primary").click(function(){
		var allValue = Number($("#allQty").val());
		var starValue = Number($("#starQty").val());
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
			Material.boxEdit(Box.get(id).no,starDiff,Box.get(id).choice,true);

			updateMeterial();
		}else{
			alert("Error!\n優先數量大於所有數量");
		}
		$('#box-modal').modal('hide');
	});
	$("#import-modal #importOld").click(function(){
		var value = $("#import-modal .modal-body textarea").val();
		var splits = value.split("      ");
		window.localStorage.boxid = splits[0];
		window.localStorage.box = splits[1];
		window.localStorage.material = splits[2];
		window.localStorage.setting = splits[3];
		boxReset();
		internalLoad();
		$("#import-modal .modal-body textarea").val("");
		$('#import-modal').modal('hide');
	});
	/*
	$("#import-modal #importNew").click(function(){
		var value = $("#import-modal .modal-body textarea").val();
		var data = JSON.parse(value);
		//要加版本判斷機制
		window.localStorage.boxid = data.boxid;
		window.localStorage.box = JSON.stringify(data.box);
		window.localStorage.material = JSON.stringify(data.material);
		window.localStorage.setting = JSON.stringify(data.setting);
		boxReset();
		internalLoad();
		$("#import-modal .modal-body textarea").val("");
		$('#import-modal').modal('hide');
	});
	*/
	$("#update").click(function(){
		Index.update();
	});
	$("#preview-modal .btn-primary").click(function(){
		$('#preview-modal').modal('hide');
		var no = $("#add input[name='no']").val();
		var qty = $("#add input[name='quantity']").val();
		var box = dataLoad("box");
		$.debounce( 250, addMonster(no,qty,box,null) );
	});
	$( "#setting2" ).change(function() {
		var setting = JSON.parse(window.localStorage.setting);
		var val = $( "#setting2 option:selected" ).val();
		if(val === "NULL")
			setting[2] = null;
		else
			setting[2] = val;
		window.localStorage.setting = JSON.stringify(setting);
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
		var setting = JSON.parse(window.localStorage.setting);
		if(inputID != 3)
			if($(this).prop( "checked" )){
				setting[inputID] = true;		
			}else{
				setting[inputID] = false;
			}
		else{
			var rows = document.getElementsByName('setting3[]');
			for (var i = 0, l = rows.length; i < l; i++) {
				if (rows[i].checked) {
					setting[inputID][i] = true;
					$("#mainTable tr").each(function(){$(this).children().eq(i).show();});
				}else{
					setting[inputID][i] = false;
					$("#mainTable tr").each(function(){$(this).children().eq(i).hide();});
				}
			}
		}
		if(inputID == 4){
			if(setting[4] === true)
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
		window.localStorage.setting = JSON.stringify(setting);
	});
	$(window).bind('scroll', SetMaterialSidebarPosition);
	$(".version").append(version);
});