(function( $ ) {
	$.fn.addIcon = function( qty_notification , outter_link , no ) {
		var core = function(){
			return $("<img>")
				.attr("src","icon/"+ no +".png")
				.attr("width",36)
				.attr("height",36)
				.attr("class","material-display")//tootipster has been used
				.attr("title",name[no].chinese);
		};
		if(!(window.localStorage.getItem("name") === null)){
			var name = JSON.parse(window.localStorage.name);
			if(no in name)
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
		}
		return this;
	};
	$.fn.showAction = function( priority , no ) {
		if(!(window.localStorage.getItem("evolution") === null)){
			var evolution = JSON.parse(window.localStorage.evolution);
			$( this ).append($("<span>")
				.addClass("glyphicon glyphicon-plus")
				.attr("title","+1")
				.click(no,function(){
					var box = dataLoad("box");
					var id = $( this ).parent().parent().attr("id");
					var choice = $( this ).parent().parent().attr("data-choice");
					for(var i in box){
						if(box[i].id == id){
							var quantity = box[i].quantity;
							var no = box[i].no;
							quantity++;
							box[i].quantity = quantity;
							$( this ).parent().parent().children().eq(6).text(quantity);
						}
					}
					var string = JSON.stringify(box);
					window.localStorage.box = string;
					var needMaterial = NeedMaterial( no , choice );
					var need = needMaterial.result;
					for(var index in need){
						materialTab.needPlus(need[index],1);
					}
				})
			);
			$( this ).append($("<span>")
				.addClass("glyphicon glyphicon-star")
				.attr("title","優先進化對象數量+1")
				.click(no,function(){
					var box = dataLoad("box");
					var id = $( this ).parent().parent().attr("id");
					var priority2 = $( this ).parent().parent().attr("data-priority");
					for(var i in box){
						if(box[i].id == id){
							if(box[i].quantity > box[i].priority){
								priority2++;
								box[i].priority = priority2;
								$( this ).parent().parent().attr("data-priority",priority2);
								$( this ).parent().parent().children().eq(7).text(priority2);
								var evolution = JSON.parse(window.localStorage.evolution);
								var ultimate = JSON.parse(window.localStorage.ultimate);
								var choice = $("#mainTable table #" + id).attr("data-choice");
								var text = $("#mainTable table #" + id).children().eq(0).text();
								var needMaterial = NeedMaterial( text , choice );
								var need = needMaterial.result;
								for(var index in need){
									materialTab.PneedPlus(need[index],1);
								}
								updateMeterial();
							}
						}
					}
					var string = JSON.stringify(box);
					window.localStorage.box = string;
				})
			);
			$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-pencil edit-material")
					.attr("title","修改")
					.click(function(){
						$("#box-modal").modal('show');
						var all = $( this ).parent().parent().children().eq(6).text();
						var star = $( this ).parent().parent().children().eq(7).text();
						$("#allQty").val(all).attr("data-original",all);
						$("#allQty").val(all).attr("data-id",$( this ).parent().parent().attr("id"));
						$("#starQty").val(star).attr("data-original",star);
						setTimeout(function(){$("#box-modal input").eq(0).focus();},500);
					})
				);
			if(no in evolution && evolution[no].status != "n")
				$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-forward")
					.attr("title","進化")
					.click(no,function(){
						var text = $( this ).parent().parent().children().first().text();
						var id = $( this ).parent().parent().attr("id");
						var evolution = JSON.parse(window.localStorage.evolution);
						var ultimate = JSON.parse(window.localStorage.ultimate);
						var box = dataLoad("box");
						var material = dataLoad("material");
						var need = [];
						var notHave = [];
						var result = 0;
						var notIn = [];
						var error = 0;
						var choice = $( this ).parent().parent().attr("data-choice");
						var priority = $( this ).parent().parent().attr("data-priority");
						var quantity = $( this ).parent().parent().children().eq(6);
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
								$(this).parent().parent().children().eq(6).text(box[offset].quantity);
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
										materialTab.needPlus(nextNeed[i],1);
									}
								}
							}
							for(var index in need){
								materialTab.evolution(need[index],1);
							}
							if($(this).parent().parent().attr("data-priority")>0){
								var priority = $(this).parent().parent().attr("data-priority");
								priority--;
								$(this).parent().parent().attr("data-priority",priority);
								$(this).parent().parent().children().eq(7).text(priority);
								box[offset].priority--;
								for(var index in need){
									materialTab.Pevolution(need[index],1);
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
			$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-remove")
					.attr("title","刪除")
					.click(function(){
						var id = $(this).parent().parent().attr('id');
						var box = dataLoad("box");
						var choice = $("#mainTable table #" + id).attr("data-choice");
						var text = $("#mainTable table #" + id).children().eq(0).text();
						var offset = 0;
						for(var i in box){
							if(box[i].id == id)
								offset = i;
						}
						var quantity = box[offset].quantity;
						var priority = box[offset].priority;
						deleteMonster(offset,box);
						var string = JSON.stringify(box);
						window.localStorage.box = string;
						var resort = true;
						$("#mainTable table #" + id).remove();
						$("#mainTable table").trigger("update", [resort]);
						var needMaterial = NeedMaterial( text , choice );
						if(needMaterial.status != 'n' && needMaterial.status != 'un'){
							for(var index in needMaterial.result){
								materialTab.needMinus(needMaterial.result[index],quantity);
							}
							if(quantity > 0)
								for(var index in needMaterial.result){
									materialTab.PneedMinus(needMaterial.result[index],priority);
								}
						}
						updateMeterial();
					})
				);
		}
		return this;
	};
	$.fn.showNeedMaterial = function( no , id , choice ) {
		if(!(window.localStorage.getItem("evolution") === null && window.localStorage.getItem("ultimate") === null)){
			var ultimate = JSON.parse(window.localStorage.ultimate);
			var name = JSON.parse(window.localStorage.name);
			var setting = JSON.parse(window.localStorage.setting);
			var needMaterial = NeedMaterial( no , choice );
			if(needMaterial.status == 'n'){
				$( this ).text("無法進化");
			}else if(needMaterial.status == 'un'){
				$( this ).append($("<button>")
					.text("請選取究極進化分支")
					.addClass("btn btn-warning")
					.attr("data-toggle","modal")
					.attr("data-target","#ultimateBranch")
					.click(id,function(){
						var i = 1;
						var ultimateResult = [];
						if(ultimateResult.length > 0)
							ultimateResult.length = 0;
						while(i < ultimate.length){
							if(no == ultimate[i].no)
								ultimateResult.push(ultimate[i].result);
							i++;
						}
						$.each(ultimateResult,function(index,value){
							$("#ultimateBranch .modal-body form").append($("<label>")
								.append($("<input>")
									.attr("type","radio")
									.attr("value",value)
									.attr("data-id",id)
									.attr("name","ultimateChoose")
								).append("   " + value + " - " + name[value].chinese + " - " + name[value].japanese )
							);
						});
					})
				);
			}else{
				for(var key in needMaterial.result){
					$( this ).addIcon(setting[1],setting[2],needMaterial.result[key]);
					if(key < needMaterial.result.length - 1)
						$( this ).append(" ");
				}
			}
		}
		return this;
	};
}( jQuery ));

function updateMeterial()
{
	$("#mainTable div span").each(function(){
		var materialNo = $( this ).attr("data-no");
		if(materialTab.state(materialNo) != false){
			$( this ).attr("class","badge " + materialTab.state(materialNo));
			$( this ).text(materialTab.quantity(materialNo));
		}
	});
}

function dataLoad( target )
{
	var result = [];
	if(!(window.localStorage.getItem(target) === null)){
		var string = window.localStorage.getItem(target);
		result = JSON.parse(string);
		if(target == "material" && result.length==46){
			result[46] = JSON.parse("{\"no\":1325,\"quantity\":0}");
			result[47] = JSON.parse("{\"no\":1326,\"quantity\":0}");
			result[48] = JSON.parse("{\"no\":1327,\"quantity\":0}");
			result[49] = JSON.parse("{\"no\":1328,\"quantity\":0}");
			result[50] = JSON.parse("{\"no\":1329,\"quantity\":0}");
		}
		if(target == "box" && result.length > 0){
			if(result[0].hasOwnProperty('priority') == false)
				for(var i in result)
					result[i].priority = 0;
		}
		if(target == "box" && result.length > 0){
			if(result[0].hasOwnProperty('quantity') == false)
				for(var i in result)
					result[i].quantity = 1;
		}
		return result;
	}else{
		if(target == "box")
			window.localStorage.boxid = 0;
		else if(target == "material"){
			var string = "[{\"no\":147,\"quantity\":\"0\"},{\"no\":148,\"quantity\":0},{\"no\":149,\"quantity\":0},{\"no\":150,\"quantity\":0},{\"no\":151,\"quantity\":0},{\"no\":321,\"quantity\":0},{\"no\":1176,\"quantity\":0},{\"no\":161,\"quantity\":0},{\"no\":171,\"quantity\":0},{\"no\":166,\"quantity\":0},{\"no\":162,\"quantity\":0},{\"no\":172,\"quantity\":0},{\"no\":167,\"quantity\":0},{\"no\":1294,\"quantity\":0},{\"no\":163,\"quantity\":0},{\"no\":173,\"quantity\":0},{\"no\":168,\"quantity\":0},{\"no\":1295,\"quantity\":0},{\"no\":164,\"quantity\":0},{\"no\":174,\"quantity\":0},{\"no\":169,\"quantity\":0},{\"no\":165,\"quantity\":0},{\"no\":175,\"quantity\":0},{\"no\":170,\"quantity\":0},{\"no\":234,\"quantity\":0},{\"no\":152,\"quantity\":0},{\"no\":153,\"quantity\":0},{\"no\":154,\"quantity\":0},{\"no\":227,\"quantity\":0},{\"no\":1085,\"quantity\":0},{\"no\":1086,\"quantity\":0},{\"no\":1087,\"quantity\":0},{\"no\":155,\"quantity\":0},{\"no\":156,\"quantity\":0},{\"no\":157,\"quantity\":0},{\"no\":158,\"quantity\":0},{\"no\":159,\"quantity\":0},{\"no\":160,\"quantity\":0},{\"no\":246,\"quantity\":0},{\"no\":247,\"quantity\":0},{\"no\":248,\"quantity\":0},{\"no\":249,\"quantity\":0},{\"no\":250,\"quantity\":0},{\"no\":251,\"quantity\":0},{\"no\":915,\"quantity\":0},{\"no\":916,\"quantity\":0},{\"no\":1325,\"quantity\":0},{\"no\":1326,\"quantity\":0},{\"no\":1327,\"quantity\":0},{\"no\":1328,\"quantity\":0},{\"no\":1329,\"quantity\":0}]";
			window.localStorage.material = string;
			result = JSON.parse(string);
		}
		return result;
	}
}

function boxDisplay( box )
{
	var i = 0;
	var choice;
	for(i=0;i<box.length;i++){
		if(box[i].hasOwnProperty('choice'))
			choice = box[i].choice;
		else
			choice = 0;
		$("#mainTable tbody").append( $(" <tr> ").attr( 'id' , box[i].id ).attr( 'data-choice' , choice ).attr( 'data-priority' , box[i].priority )
						.append( $(" <td> ").text( box[i].no )));
	}	
}

function materialDisplay( material )
{
	var setting = JSON.parse(window.localStorage.setting);
	$("#material").empty();
	$("#material").append($("<div>").addClass("row").append($("<div>").addClass("material-body col-md-8")));
	for(var i in materialTemplate[0][0]){
		$("#material .material-body").append(
			$("<div>").addClass("mainTable").append(
				$("<h2>").text(materialTemplate[0][2][i])
			).append(
				$("<table>").attr("id",materialTemplate[0][1][i]).append(
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
				$("<div>").addClass(/*"panel panel-default"*/).append(
					$("<div>").addClass("panel-body").append($("<div>").addClass("list-group"))
				)
			)
		)
	);
	for(var i in materialTemplate[0][0]){
		$("#material .panel-body div").append($("<a>").addClass("list-group-item").attr("href","#" + materialTemplate[0][1][i]).append(materialTemplate[0][2][i]));
	}
	for(var key1 in materialTemplate[0][0]){
		for(var key2 in materialTemplate[0][0][key1]){
			$("#" + materialTemplate[0][1][key1] + " tbody").append(
				$("<tr>").addClass(materialAttr[materialTemplate[0][0][key1][key2]].element).append(
					$("<td>").text(materialAttr[materialTemplate[0][0][key1][key2]].no)
				).append(
					$("<td>").addIcon(false,setting[2],materialAttr[materialTemplate[0][0][key1][key2]].no)
				).append(
					$("<td>").text(materialAttr[materialTemplate[0][0][key1][key2]].name)
				).append(
					$("<td>").text(material[materialTemplate[0][0][key1][key2]].quantity).addClass("number")
				).append(
					$("<td>").text("0").addClass("number")
				).append(
					$("<td>").text("0").addClass("number")
				).append(
					$("<td>").text("0").addClass("number priority")
				).append(
					$("<td>").text("0").addClass("number priority")
				).append(
					$("<td>").append(
						$("<span>").addClass("glyphicon glyphicon-plus add-material").attr("title","+1").attr("data-id",materialTemplate[0][0][key1][key2])
						.click(function(){
							var id = $(this).attr('data-id');
							$.debounce( 250, addMaterial(id) );
						})
					).append(" ")
					.append(
						$("<span>").addClass("glyphicon glyphicon-minus minus-material").attr("title","-1").attr("data-id",materialTemplate[0][0][key1][key2])
						.click(function(){
							var id = $(this).attr('data-id');
							$.debounce( 250, minusMaterial(id) );
						})
					).append(" ")
					.append(
						$("<span>").addClass("glyphicon glyphicon-pencil edit-material").attr("title","修改").attr("data-id",materialTemplate[0][0][key1][key2])
						//.attr("data-toggle","modal")
						//.attr("data-target","#material-modal")
						.click(function(){
							var id = $(this).attr('data-id');
							var material = dataLoad("material");
							$("#material-modal").modal('show');
							$("#material-modal input").val(material[id].quantity);
							$("#material-modal input").attr("data-id",id);
							setTimeout(function(){$("#material-modal input").focus();},500);
						})
					)
				)
			);
		}
	}
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
	if(!(window.localStorage.getItem("name") === null)&&!(window.localStorage.getItem("evolution") === null)&&!(window.localStorage.getItem("ultimate") === null)){
		var name = JSON.parse(window.localStorage.name);
		var evolution = JSON.parse(window.localStorage.evolution);
		var ultimate = JSON.parse(window.localStorage.ultimate);
		if(window.localStorage.getItem("time") === null){
			var date1 = new Date(0);
		}
		else
			var date1 = new Date(window.localStorage.time);
		var date2 = new Date();
		var delta = date2 - date1;
		if(delta > (86400000 * 7) && load_times < 1){
			return false;
		}
		var data_date = new Date(evolution[0].time);
		var curr_date = data_date.getDate();
		var curr_month = data_date.getMonth();
		curr_month++;
		var curr_year = data_date.getFullYear();
		$(".data-date").text(curr_year + "/" + curr_month + "/" + curr_date);
		$("#mainTable").append($("<table>")
			.append("<thead><tr><th>No.</th><th></th><th>中文名</th><th>日文名</th><th>進化素材</th><th>目標</th><th>數量</th><th>★數量</th><th>動作</th></tr></thead>")	
			.append($("<tbody>"))
		);
		var box = dataLoad("box");
		var material = dataLoad("material");
		var allNeed = [];
		var PAllNeed = [];
		var setting = JSON.parse(window.localStorage.setting);
		boxDisplay(box);
		materialDisplay(material);
		var k = 0;
		$("#mainTable tbody tr").each(function() {
			var text = $( this ).children().text();
			var choice = $( this ).attr('data-choice');
			var id  = $(this).attr('id');
			var priority = box[k].priority;
			var quantity = box[k].quantity;
			//顯示圖片
			$( this ).append($("<td>").addIcon(false,setting[2],text));
			//顯示中文名
			if(text in name){
				$( this ).append($("<td>").text(name[text].chinese));
			//顯示日文名
				$( this ).append($("<td>").text(name[text].japanese));
			}else
				$( this ).append($("<td>")).append($("<td>"));
			//顯示進化素材
			$( this ).append($("<td>").showNeedMaterial(text,id,choice));
			if(text in evolution){
				if(evolution[text].status == 'y'){
					var j = 0;
					for(j=0;j<evolution[text].need.length;j++){
						if(evolution[text].need[j] in allNeed){
							allNeed[evolution[text].need[j]] += Number(quantity);
						}else{
							allNeed[evolution[text].need[j]] = Number(quantity);
						}
						if($( this ).attr('data-priority')>0)
							if(evolution[text].need[j] in PAllNeed)
								PAllNeed[evolution[text].need[j]] += Number(priority);
							else
								PAllNeed[evolution[text].need[j]] = Number(priority);
					}
					$( this ).append($("<td>").addIcon(false,setting[2],evolution[text].result));
				}
				else if(evolution[text].status == 'u'){
					if(choice > 0){
						var i = 1;
						var ultimateNeed = ultimate[i].need;
						while(ultimate[i].result!=choice){
							i++;
							ultimateNeed = ultimate[i].need;
						}
						for(j=0;j<ultimateNeed.length;j++){
							if(ultimateNeed[j] in allNeed){
								allNeed[ultimateNeed[j]] += quantity;
							}else{
								allNeed[ultimateNeed[j]] = quantity;
							}
							if($( this ).attr('data-priority')>0)
								if(ultimateNeed[j] in PAllNeed)
									PAllNeed[ultimateNeed[j]] += priority;
								else
									PAllNeed[ultimateNeed[j]] = priority;
						}
						$( this ).append($("<td>").addIcon(false,setting[2],choice));
					}else{
						$( this ).append($("<td>"));
					}
				}else{
					$( this ).append($("<td>"));
				}
			}
			//顯示數量
			$( this ).append($("<td>").text(box[k].quantity).addClass("number"));
			$( this ).append($("<td>").text(box[k].priority).addClass("number"));
			//顯示動作
			$( this ).append($("<td>").showAction($( this ).attr("data-priority"),text));
			k++;
		});
		$(".material-display").tooltipster(); //active tooltipster
		$("#material tbody tr").each(function(){
			var no = $(this).children().first().text();
			$(this).children().eq(4).text(allNeed[no]);
			var total = $(this).children().eq(3).text() - $(this).children().eq(4).text();
			$(this).children().eq(5).text(total);
			$(this).children().eq(6).text(PAllNeed[no]);
			var Ptotal = $(this).children().eq(3).text() - $(this).children().eq(6).text();
			$(this).children().eq(7).text(Ptotal);
		});
		for(i=0;i<9;i++){
				if(setting[3][i] === false)
					$("#mainTable tr").each(function(){$(this).children().eq(i).css( "display", "none" );});
			}
		updateMeterial();
		$("#mainTable table").tablesorter();
	}else
		return false;
}

function externalLoad()
{
	$.ajax({
		dataType: 'jsonp',
		url: "http://bug.22web.org/generator/source3.php", 
		success: function(data){
			var string = JSON.stringify(data);
			window.localStorage.name = string;
			loadingComplete(3);
		},
		error: function(request,error) 
		{
		 alert ( "錯誤: " + error );
		}
	});
	$.ajax({
		dataType: 'jsonp',
		url: "http://bug.22web.org/generator/source1.php", 
		success: function(data){
			var string = JSON.stringify(data);
			window.localStorage.evolution = string;
			loadingComplete(1);
		},
		error: function(request,error) 
		{
		 alert ( "錯誤: " + error );
		}
	});
	$.ajax({
		dataType: 'jsonp',
		url: "http://bug.22web.org/generator/source2.php", 
		success: function(data){
			var string = JSON.stringify(data);
			window.localStorage.ultimate = string;
			loadingComplete(2);
		},
		error: function(request,error) 
		{
		 alert ( "錯誤: " + error );
		}
	});
	window.localStorage.time = new Date();
}

function deleteMonster(id,box)//不是 property 裡的 id，是指索引值
{
		box.splice(id,1);
}

function addMaterial( id )
{
	var material = dataLoad("material");
	material[id].quantity ++;
	var string = JSON.stringify(material);
	window.localStorage.material = string;
	$("#material tr").each(function(){
		if($(this).children().eq(8).children().attr("data-id") == id){
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
	var material = dataLoad("material");
	material[id].quantity --;
	var string = JSON.stringify(material);
	window.localStorage.material = string;
	$("#material tr").each(function(){
		if($(this).children().eq(8).children().attr("data-id") == id){
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
	var name = JSON.parse(window.localStorage.name);
	var evolution = JSON.parse(window.localStorage.evolution);
	var ultimate = JSON.parse(window.localStorage.ultimate);
	var mon = new Array(times);
	var i = 0;
	var resort = true;
	var choice = 0;
	var setting = JSON.parse(window.localStorage.setting);
	mon[i] = {};
	mon[i]["id"] = window.localStorage.boxid;
	mon[i]["no"] = no;
	mon[i]["priority"] = 0;
	mon[i]["quantity"] = times;
	if(from != null)
		mon[i]["from"] = from;
	box.push(mon[i]);
	window.localStorage.boxid ++;
	$row = $("<tr>").attr("id",mon[i]["id"]).attr("data-choice",0).attr("data-priority",0)
			.append($("<td>").text(no))
			.append($("<td>").addIcon(false,setting[2],no))
			.append($("<td>").text(name[no].chinese))
			.append($("<td>").text(name[no].japanese))
			.append($("<td>").showNeedMaterial(no,mon[i]["id"],0))
			.append(function(){
				if(evolution[no].status == "y")
					return $("<td>").addIcon(false,setting[2],evolution[no].result);
				else
					return $("<td>");
			})
			.append($("<td>").text(times).addClass("number"))
			.append($("<td>").text(0).addClass("number"))
			.append($("<td>").showAction(0,no));
	$("#mainTable table").find('tbody').append($row).trigger("addRows", [$row, resort]);
	if(no in evolution){
		if(evolution[no].status == 'y'){
			for(var key in evolution[no].need){
				materialTab.needPlus(evolution[no].need[key],times);
			}
		}
		else if(evolution[no].status == 'u'){
			if(choice > 0){
				var j = 1;
				var ultimateNeed = ultimate[j].need;
				while(ultimate[j].result!=choice){
					j++;
					ultimateNeed = ultimate[j].need;
				}
				for(var key in ultimateNeed){
					materialTab.needPlus(ultimateNeed[key],times);
				}
			}
		}
	}
	for(k=0;k<9;k++){
		if(setting[3][k] === false)
			$row.children().eq(k).css( "display", "none" );
	}
	var string = JSON.stringify(box);
	window.localStorage.box = string;
	$("#add input[name='no']").val("");
	$("#add input[name='quantity']").val("1");
	updateMeterial();
	$(".material-display").tooltipster(); //active tooltipster
} 
function loadingComplete( id )
{
	$("#loading" + id).removeClass("danger").addClass("success").children().first().text("完成");
	var count = 0;
	for(var i=1;i<=3;i++){
		if($("#loading" + i).hasClass("success") === true)
			count++;
	}
	if(count === 3){
		$('#loading-modal').modal('hide');
		internalLoad(1);
	}
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
$(document).ready(function() {
	$('.modal').on('show.bs.modal', centerModals);
	$(window).on('resize', centerModals);
	window.localStorage.removeItem("settingA");
	if(window.localStorage.getItem("setting") === null){
		var setting = new Array();
		setting[0] = false;
		setting[1] = false;
		setting[2] = null;
		setting[3] = [true,true,true,true,true,true,true,true,true];
		setting[4] = false;
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
		for(var i = 0;i < 9;i++)
			$("#setting3" + i).prop("checked" , setting[3][i]);
	}
	if(internalLoad(0) == false){
		externalLoad();
		$('#loading-modal').modal('show');
	}
	$("#add #btn-add-enter").click(function(){
		var box = dataLoad("box");
		var a = $("#add input[name='no']").val();
		var b = $("#add input[name='quantity']").val();
		$.debounce( 250, addMonster(a,b,box,null) );
	});
	$("#ultimateBranch .btn-primary").click(function(){
		var branchChoice = $("input[type='radio']:checked", "#ultimateBranch").val();
		var id = $("input[type='radio']:checked", "#ultimateBranch").attr("data-id");
		var box = dataLoad("box");
		var ultimate = JSON.parse(window.localStorage.ultimate);
		var offset = 0;
			for(var i in box){
				if(box[i].id == id)
					offset = i;
			}
		box[offset].choice = branchChoice;
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		//boxReset();
		//internalLoad();
		$("#mainTable table tr[id='"+ id +"']").children().eq(4).empty().showNeedMaterial(box[offset].no,id,branchChoice);
		$("#mainTable table tr[id='"+ id +"']").children().eq(5).addIcon(false,setting[2],branchChoice);
		$("#mainTable table tr[id='"+ id +"']").attr("data-choice",branchChoice);
		$(".material-display").tooltipster(); //active tooltipster
		var i = 1;
		var ultimateNeed = ultimate[i].need;
		var choice = branchChoice;
		while(ultimate[i].result!=choice){
			i++;
			ultimateNeed = ultimate[i].need;
		}
		for(j=0;j<ultimateNeed.length;j++){
			materialTab.needPlus(ultimateNeed[j],1);
		}
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
		var backup = window.localStorage.boxid + "      " + window.localStorage.box + "      " + window.localStorage.material + "      " + window.localStorage.setting;
		$("#backup-modal .modal-body textarea").val(backup);
	});
	$("#backup-modal .btn-primary").click(function(){
		var backup = window.localStorage.boxid + "      " + window.localStorage.box + "      " + window.localStorage.material + "      " + window.localStorage.setting;
		var blob = new Blob([backup], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "padboxer-backup.txt");
	});
	$("#material-modal .btn-primary").click(function(){
		var value = $("#material-modal .modal-body form input").val();
		var id = $("#material-modal .modal-body form input").attr("data-id");
		var material = dataLoad("material");
		material[id].quantity = value;
		var string = JSON.stringify(material);
		window.localStorage.material = string;
		$("#material tr").each(function(){
			if($(this).children().eq(8).children().attr("data-id") == id){
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
		var allValue = $("#allQty").val();
		var starValue = $("#starQty").val();
		if(allValue >= starValue){
			var allOriginal = $("#allQty").attr("data-original");
			var starOriginal = $("#starQty").attr("data-original");
			var id = $("#allQty").attr("data-id");
			var box = dataLoad("box");
			var offset = 0;
			for(var i in box){
				if(box[i].id == id)
					offset = i;
			}
			box[offset].quantity = allValue;
			box[offset].priority = starValue;
			var string = JSON.stringify(box);
			window.localStorage.box = string;
			$("#mainTable tr").each(function(){
				if($(this).attr("id") == id){
					$(this).children().eq(6).text(allValue);
					$(this).children().eq(7).text(starValue);
				}
			});
			var allDiff = allValue - allOriginal;
			var starDiff = starValue - starOriginal;
			var choice = 0;
			if(typeof box[offset].choice != 'undefined')
				choice = box[offset].choice;
			var needMaterial = NeedMaterial(box[offset].no,choice);
			var need = needMaterial.result;
			for(var index in need){
				materialTab.needPlus(need[index],allDiff);
				materialTab.PneedPlus(need[index],starDiff);
			}
			updateMeterial();
		}else{
			alert("Error!\n優先數量大於所有數量");
		}
		$('#box-modal').modal('hide');
	});
	$("#import-modal .btn-primary").click(function(){
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
	$("#update").click(function(){
		window.localStorage.removeItem("time");
		document.location.reload(true);
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
	$(window).bind('scroll', function(){
		var $this = $(this);
		if($this.scrollTop() < 300)
			$(".material-sidebar").css({
					top: 360-$this.scrollTop()
				});
		else
			$(".material-sidebar").css({
					top: 60
				});
	});
	$(".version").append(version);
});