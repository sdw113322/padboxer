(function( $ ) {
	$.fn.addIcon = function( qty_notification , outter_link , no ) {
		if(!(window.localStorage.getItem("name") === null)){
			var name = JSON.parse(window.localStorage.name);
			if(no in name)
				if(qty_notification == true){
					for(var key in materialAttr){
						if(materialAttr[key].no == no)
							var x = key;
					}
					var available = $("#material span[data-id='" + x + "']").parent().parent().children().eq(3).text();
					var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
					var status;
					if(total > 0)
						status = "badge-success";
					else if(total <= 0 && available > 0)
						status = "badge-warning";
					else
						status = "badge-important";
					if(outter_link == null)
						this.append(
						$("<div>").addClass("icon").append(
							$("<img>")
								.attr("src","icon/"+ no +".png")
								.attr("width",36)
								.attr("height",36)
								.attr("class","material-display")//tootipster has been used
								.attr("title",name[no].chinese)
							).append(
							$("<span>")
								.addClass("badge " + status)
								.text(available)
							)
						);
					else
						this.append(
						$("<div>").addClass("icon").append(
							$("<a>")
							.attr("href",outter_link + no)
							.attr("target","_blank")
							.append(
								$("<img>")
									.attr("src","icon/"+ no +".png")
									.attr("width",36)
									.attr("height",36)
									.attr("class","material-display")//tootipster has been used
									.attr("title",name[no].chinese)
								)
							).append(
							$("<span>")
								.addClass("badge " + status)
								.text(available)
							)
						);
				}else
					if(outter_link == null)
						this.append(
						$("<img>")
							.attr("src","icon/"+ no +".png")
							.attr("width",36)
							.attr("height",36)
							.attr("class","material-display")//tootipster has been used
							.attr("title",name[no].chinese)
						);
					else
						this.append(
							$("<a>")
							.attr("href",outter_link + no)
							.attr("target","_blank")
							.append(
								$("<img>")
									.attr("src","icon/"+ no +".png")
									.attr("width",36)
									.attr("height",36)
									.attr("class","material-display")//tootipster has been used
									.attr("title",name[no].chinese)
							)
						);
		}
		return this;
	};
}( jQuery ));

(function( $ ) {
	$.fn.showAction = function( priority , no ) {
		if(!(window.localStorage.getItem("evolution") === null)){
			var evolution = JSON.parse(window.localStorage.evolution);
			$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-remove")
					.attr("title","刪除")
					.click(function(){
						var id = $(this).parent().parent().attr('id');
						var box = dataLoad("box");
						var evolution = JSON.parse(window.localStorage.evolution);
						var ultimate = JSON.parse(window.localStorage.ultimate);
						var choice = $("#mainTable table #" + id).attr("data-choice");
						var need = [];
						var text = $("#mainTable table #" + id).children().eq(0).text();
						var offset = 0;
						for(var i in box){
							if(box[i].id == id)
								offset = i;
						}
						deleteMonster(offset,box);
						var string = JSON.stringify(box);
						window.localStorage.box = string;
						var resort = true;
						$("#mainTable table #" + id).remove();
						$("#mainTable table").trigger("update", [resort]);
						if(text in evolution){
							if(evolution[text].status == 'y'){
								need = evolution[text].need;
							}
							else if(evolution[text].status == 'u'){
								if(choice > 0){
									var i = 1;
									var ultimateNeed = [];
									while(ultimate[i].result!=choice){
										i++;
										ultimateNeed = ultimate[i].need;
									}
									need = ultimateNeed;
								}
							}
							for(var index in need){
								var x = -1;
									for(var key in materialAttr){
										if(materialAttr[key].no == need[index])
											x = key;
									}
									if(x != -1){
										var needQty = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
										var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
										total++;
										needQty--;
										$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(needQty);
										$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
									}
							}
						}
					})
				).append(" ");
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
						if(text in evolution){
							if(evolution[text].status == 'y'){
								need = evolution[text].need;
								if(evolution[evolution[text].result].status == 'y' || evolution[evolution[text].result].status == 'u')
									result = evolution[text].result;
							}
							else if(evolution[text].status == 'u'){
								if(choice > 0){
									var i = 1;
									var ultimateNeed = ultimate[i].need;
									while(ultimate[i].result!=choice){
										i++;
										ultimateNeed = ultimate[i].need;
										result = ultimate[i].result;
									}
									need = ultimateNeed;
								}
								else{
									alert("error!");
									error = 1;
								}
							}
							else if(evolution[text].status == 'n'){
								alert("無法進化");
								error = 1;
							}
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
							deleteMonster(offset,box);
							var setting = JSON.parse(window.localStorage.setting);
							if(result != 0 && setting[0])
								addMonster(result,1,box);
							string = JSON.stringify(box);
							window.localStorage.box = string;
							for(var index in need){
								var x = -1;
								for(var key in materialAttr){
									if(materialAttr[key].no == need[index])
										x = key;
								}
								if(x != -1){
									var available = $("#material span[data-id='" + x + "']").parent().parent().children().eq(3).text();
									var needQty = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
									available--;
									needQty--;
									$("#material span[data-id='" + x + "']").parent().parent().children().eq(3).text(available);
									$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(needQty);
								}
							}
							var resort = true;
							$("#mainTable table #" + id).remove();
							$("#mainTable table").trigger("update", [resort]);
						}else if(error == 0){
						}
						if(error == 2){
							alert(notHave + "不存在\n無法進化");
						
						}
					})
				).append(" ");
			if(priority == 0)
				$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-star-empty")
					.attr("title",/*"設為優先進化對象"*/"Star")
					.click(no,function(){
						var box = dataLoad("box");
						var id = $( this ).parent().parent().attr("id");
						var priority2 = $( this ).parent().parent().attr("data-priority");
						for(var i in box){
							if(box[i].id == id)
								if(priority2 == 0){
									box[i].priority = 1;
									$( this ).parent().parent().attr("data-priority",1);
									$( this ).attr("class","glyphicon glyphicon-star").attr("title",/*"設為一般進化對象"*/"Unstar");
								}else{
									box[i].priority = 0;
									$( this ).parent().parent().attr("data-priority",0);
									$( this ).attr("class","glyphicon glyphicon-star-empty").attr("title",/*"設為優先進化對象"*/"Star");
								}
						}
						var string = JSON.stringify(box);
						window.localStorage.box = string;
					})
				);
			else
				$( this ).append($("<span>")
					.addClass("glyphicon glyphicon-star")
					.attr("title","設為一般進化對象")
					.click(no,function(){
						var box = dataLoad("box");
						var id = $( this ).parent().parent().attr("id");
						var priority2 = $( this ).parent().parent().attr("data-priority");
						for(var i in box){
							if(box[i].id == id)
								if(priority2 == 0){
									box[i].priority = 1;
									$( this ).parent().parent().attr("data-priority",1);
									$( this ).attr("class","glyphicon glyphicon-star").attr("title",/*"設為一般進化對象"*/"Unstar");
								}else{
									box[i].priority = 0;
									$( this ).parent().parent().attr("data-priority",0);
									$( this ).attr("class","glyphicon glyphicon-star-empty").attr("title",/*"設為優先進化對象"*/"Star");
								}
						}
						var string = JSON.stringify(box);
						window.localStorage.box = string;
					})
				);
		}
		return this;
	};
}( jQuery ));

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
		if(target == "box" && result[0].hasOwnProperty('priority') == false){
			for(var i in result)
				result[i].priority = 0;
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

(function( $ ) {
	$.fn.showNeedMaterial = function( no , id , choice ) {
		if(!(window.localStorage.getItem("evolution") === null && window.localStorage.getItem("ultimate") === null)){
			var evolution = JSON.parse(window.localStorage.evolution);
			var ultimate = JSON.parse(window.localStorage.ultimate);
			var name = JSON.parse(window.localStorage.name);
			var setting = JSON.parse(window.localStorage.setting);
			if(no in evolution){
				if(evolution[no].status == 'y'){
					for(var key in evolution[no].need){
						$( this ).addIcon(setting[1],setting[2],evolution[no].need[key]);
						if(key < evolution[no].need.length - 1)
							$( this ).append(" ");
					}
				}
				else if(evolution[no].status == 'u'){
					if(choice > 0){
						var i = 1;
						var ultimateNeed = ultimate[i].need;
						while(ultimate[i].result!=choice){
							i++;
							ultimateNeed = ultimate[i].need;
						}
						for(var key in ultimateNeed){
							$( this ).addIcon(setting[1],setting[2],ultimateNeed[key]);
							if(key < ultimateNeed.length - 1)
								$( this ).append(" ");
						}
					}
					else{
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
	//
					}
				}
				else if(evolution[no].status == 'n')
					$( this ).text("無法進化");
			}
		}
		return this;
	};
}( jQuery ));

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
					$("<td>").text(material[materialTemplate[0][0][key1][key2]].quantity)
				).append(
					$("<td>").text("0")
				).append(
					$("<td>").text("0")
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
			.append("<thead><tr><th>No.</th><th></th><th>中文名</th><th>日文名</th><th>進化素材</th><th>動作</th></tr></thead>")	
			.append($("<tbody>"))
		);
		var box = dataLoad("box");
		var material = dataLoad("material");
		var allNeed = [];
		var setting = JSON.parse(window.localStorage.setting);
		boxDisplay(box);
		materialDisplay(material);
		$("#mainTable tbody tr").each(function() {
			var text = $( this ).children().text();
			var choice = $( this ).attr('data-choice');
			var id  = $(this).attr('id');
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
						if(evolution[text].need[j] in allNeed)
							allNeed[evolution[text].need[j]] ++;
						else
							allNeed[evolution[text].need[j]] = 1;
					}
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
							if(ultimateNeed[j] in allNeed)
								allNeed[ultimateNeed[j]] ++;
							else
								allNeed[ultimateNeed[j]] = 1;
						}
					}
				}
			}
			//顯示動作
			$( this ).append($("<td>").showAction($( this ).attr("data-priority"),text));
			
		});
		$(".material-display").tooltipster(); //active tooltipster
		$("#material tbody tr").each(function(){
			var no = $(this).children().first().text();
			$(this).children().eq(4).text(allNeed[no]);
			var total = $(this).children().eq(3).text() - $(this).children().eq(4).text();
			$(this).children().eq(5).text(total);
		});
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
		if($(this).children().eq(6).children().attr("data-id") == id){
			var available = Number($(this).children().eq(3).text()) + 1;
			var total = Number($(this).children().eq(5).text()) + 1;
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
		}
	});
}

function minusMaterial( id )
{
	var material = dataLoad("material");
	material[id].quantity --;
	var string = JSON.stringify(material);
	window.localStorage.material = string;
	$("#material tr").each(function(){
		if($(this).children().eq(6).children().attr("data-id") == id){
			var available = Number($(this).children().eq(3).text()) - 1;
			var total = Number($(this).children().eq(5).text()) - 1;
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
		}
	});
}

function addMonster(no,times,box)
{
	var name = JSON.parse(window.localStorage.name);
	var evolution = JSON.parse(window.localStorage.evolution);
	var ultimate = JSON.parse(window.localStorage.ultimate);
	var mon = new Array(times);
	var i = 0;
	var resort = true;
	var choice = 0;
	var setting = JSON.parse(window.localStorage.setting);
	for(i=0;i<times;i++){
		mon[i] = {};
		mon[i]["id"] = window.localStorage.boxid;
		mon[i]["no"] = no;
		box.push(mon[i]);
		window.localStorage.boxid ++;
		$row = $("<tr>").attr("id",mon[i]["id"]).attr("data-choice",0)
				.append($("<td>").text(no))
				.append($("<td>").addIcon(false,setting[2],no))
				.append($("<td>").text(name[no].chinese))
				.append($("<td>").text(name[no].japanese))
				.append($("<td>").showNeedMaterial(no,mon[i]["id"],0))
				.append($("<td>").showAction(0,no));
		$("#mainTable table").find('tbody').append($row).trigger("addRows", [$row, resort]);
		if(no in evolution){
			if(evolution[no].status == 'y'){
				for(var key in evolution[no].need){
					var x = -1;
					for(var index in materialAttr){
						if(materialAttr[index].no == evolution[no].need[key])
							x = index;
					}
					if(x != -1){
						var need = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
						var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
						need++;
						total--;
						$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(need);
						$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
					}
				}
			}
			else if(evolution[no].status == 'u'){
				if(choice > 0){
					var i = 1;
					var ultimateNeed = ultimate[i].need;
					while(ultimate[i].result!=choice){
						i++;
						ultimateNeed = ultimate[i].need;
					}
					for(var key in ultimateNeed){
						var x = -1;
						for(var index in materialAttr){
							if(materialAttr[index].no == ultimateNeed[key])
								x = index;
						}
						if(x != -1){
							var need = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
							var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
							need++;
							total--;
							$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(need);
							$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
						}
					}
				}
			}
		}
	}
	var string = JSON.stringify(box);
	window.localStorage.box = string;
	$("#add input[name='no']").val("");
	$("#add input[name='quantity']").val("1");
	$(".material-display").tooltipster(); //active tooltipster
} 
function adjustModalMaxHeightAndPosition(){
    $('.modal').each(function(){
        if($(this).hasClass('in') == false){
            $(this).show(); /* Need this to get modal dimensions */
        };
        var contentHeight = $(window).height() - 60;
        var headerHeight = $(this).find('.modal-header').outerHeight() || 2;
        var footerHeight = $(this).find('.modal-footer').outerHeight() || 2;

        $(this).find('.modal-content').css({
            'max-height': function () {
                return contentHeight;
            }
        });

        $(this).find('.modal-body').css({
            'max-height': function () {
                return (contentHeight - (headerHeight + footerHeight));
            }
        });

        $(this).find('.modal-dialog').addClass('modal-dialog-center').css({
            'margin-top': function () {
                return -($(this).outerHeight() / 2);
            },
            'margin-left': function () {
                return -($(this).outerWidth() / 2);
            }
        });
        if($(this).hasClass('in') == false){
            $(this).hide(); /* Hide modal */
        };
    });
};
$(document).ready(function() {
	if ($(window).height() >= 320){
		$(window).resize(adjustModalMaxHeightAndPosition).trigger("resize");
	}
	window.localStorage.removeItem("settingA");
	if(window.localStorage.getItem("setting") === null){
		var setting = new Array();
		setting[0] = false;
		setting[1] = false;
		setting[2] = null;
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
	}
	if(internalLoad(0) == false){
		externalLoad();
		$('#loading-modal').modal('show');
		$("#progressTimer").progressTimer({
			timeLimit: 18
		});
		window.setTimeout("internalLoad(1);",18000);
		window.setTimeout("$('#loading-modal').modal('hide');",18000);
	}
	$("#add #btn-add-enter").click(function(){
		var box = dataLoad("box");
		var a = $("#add input[name='no']").val();
		var b = $("#add input[name='quantity']").val();
		$.debounce( 250, addMonster(a,b,box) );
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
			var x = -1;
			for(var index in materialAttr){
				if(materialAttr[index].no == ultimateNeed[j])
					x = index;
			}
			if(x != -1){
				var need = $("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text();
				var total = $("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text();
				need++;
				total--;
				$("#material span[data-id='" + x + "']").parent().parent().children().eq(4).text(need);
				$("#material span[data-id='" + x + "']").parent().parent().children().eq(5).text(total);
			}
		}
		
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
						.append($("<td>").addIcon(false,value.need[key]))
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
	$("#clear").click(function(){
		var accept = confirm ("真的要清空嗎？");
		if(accept == true){
			window.localStorage.clear();
			document.location.reload(true);
		}
	});
	$("#backup").click(function(){
		var backup = window.localStorage.boxid + "      " + window.localStorage.box + "      " + window.localStorage.material;
		$("#backup-modal .modal-body textarea").val(backup);
	});
	$("#material-modal .btn-primary").click(function(){
		var value = $("#material-modal .modal-body form input").val();
		var id = $("#material-modal .modal-body form input").attr("data-id");
		var material = dataLoad("material");
		material[id].quantity = value;
		var string = JSON.stringify(material);
		window.localStorage.material = string;
		$("#material tr").each(function(){
		if($(this).children().eq(6).children().attr("data-id") == id){
			var available = value;
			var total = value - Number($(this).children().eq(4).text());
			$(this).children().eq(3).text(available);
			$(this).children().eq(5).text(total);
		}
	});
		$('#material-modal').modal('hide');
	});
	$("#import-modal .btn-primary").click(function(){
		var value = $("#import-modal .modal-body textarea").val();
		var splits = value.split("      ");
		window.localStorage.boxid = splits[0];
		window.localStorage.box = splits[1];
		window.localStorage.material = splits[2];
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
		$.debounce( 250, addMonster(no,qty,box) );
	});
	$("#setting0").click(function(){
		var setting = JSON.parse(window.localStorage.setting);
		if($("#setting0").prop( "checked" )){
			setting[0] = true;		
		}else{
			setting[0] = false;
		}
		window.localStorage.setting = JSON.stringify(setting);
	});
	$("#setting1").click(function(){
		var setting = JSON.parse(window.localStorage.setting);
		if($("#setting1").prop( "checked" )){
			setting[1] = true;		
		}else{
			setting[1] = false;
		}
		window.localStorage.setting = JSON.stringify(setting);
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