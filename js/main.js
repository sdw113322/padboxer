function monster(id,no,choice)
{
	this.id = id;
	this.no = no;
	this.choice = choice;
}

function material(no,qty)
{
	this.no = no;
	this.quantity = qty;
}

function dataLoad( target )
{
	var result = [];
	if(!(window.localStorage.getItem(target) === null)){
		var string = window.localStorage.getItem(target);
		result = JSON.parse(string);
		return result;
	}else{
		if(target == "box")
			window.localStorage.boxid = 0;
		else if(target == "material"){
			result[0] = new material(147,0);
			result[1] = new material(148,0);
			result[2] = new material(149,0);
			result[3] = new material(150,0);
			result[4] = new material(151,0);
			result[5] = new material(321,0);
			result[6] = new material(1176,0);
			result[7] = new material(161,0);
			result[8] = new material(171,0);
			result[9] = new material(166,0);
			result[10] = new material(162,0);
			result[11] = new material(172,0);
			result[12] = new material(167,0);
			result[13] = new material(1294,0);
			result[14] = new material(163,0);
			result[15] = new material(173,0);
			result[16] = new material(168,0);
			result[17] = new material(1295,0);
			result[18] = new material(164,0);
			result[19] = new material(174,0);
			result[20] = new material(169,0);
			result[21] = new material(165,0);
			result[22] = new material(175,0);
			result[23] = new material(170,0);
			result[24] = new material(234,0);
			result[25] = new material(152,0);
			result[26] = new material(153,0);
			result[27] = new material(154,0);
			result[28] = new material(227,0);
			result[29] = new material(1085,0);
			result[30] = new material(1086,0);
			result[31] = new material(1087,0);
			result[32] = new material(155,0);
			result[33] = new material(156,0);
			result[34] = new material(157,0);
			result[35] = new material(158,0);
			result[36] = new material(159,0);
			result[37] = new material(160,0);
			result[38] = new material(246,0);
			result[39] = new material(247,0);
			result[40] = new material(248,0);
			result[41] = new material(249,0);
			result[42] = new material(250,0);
			result[43] = new material(251,0);
			result[44] = new material(915,0);
			result[45] = new material(916,0);
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
		$("#mainTable tbody").append( $(" <tr> ").attr( 'id' , i ).attr( 'data-choice' , choice )
						.append( $(" <td> ").text( box[i].no )));
	}	
}
	
function materialDisplay( material )
{
	$("#material tbody tr").each(function( index ){
		var no = $(this).children().first().text();
		$(this).children().eq(2).text(material[index].quantity);
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
		console.log(ultimate);
		if(window.localStorage.getItem("time") === null){
			var date1 = new Date(0);
		}
		else
			var date1 = new Date(window.localStorage.time);
		var date2 = new Date();
		var delta = date2 - date1;
		if(delta > (86400000 * 7) && load_times < 1){
			window.localStorage.time = date2;
			return false;
		}
		var data_date = new Date(evolution[0].time);
		var curr_date = data_date.getDate();
		var curr_month = data_date.getMonth();
		curr_month++;
		var curr_year = data_date.getFullYear();
		$(".data-date").text(curr_year + "/" + curr_month + "/" + curr_date);
		console.log(new Date(evolution[0].time));
		var allNeed = [];
		$("#mainTable").append($("<table>")
			.append("<thead><tr><th>No.</th><th>中文名</th><th>日文名</th><th>進化素材</th><th>動作</th></tr></thead>")	
			.append($("<tbody>"))
		);
		var box = dataLoad("box");
		var material = dataLoad("material");
		boxDisplay(box);
		materialDisplay(material);
		$("#mainTable tbody tr").each(function() {
			var text = $( this ).children().text();
			var choice = $( this ).attr('data-choice');
			//顯示中文名
			if(text in name){
				$( this ).append($("<td>").text(name[text].chinese));
			//顯示日文名
				$( this ).append($("<td>").text(name[text].japanese));
			}else
				$( this ).append($("<td>")).append($("<td>"));
			//顯示進化素材
			if(text in evolution){
				if(evolution[text].status == 'y'){
					$( this ).append($("<td>"));
					for(var key in evolution[text].need){
						$( this ).children().eq(3).append(
							$("<span>")
								.attr("title",name[evolution[text].need[key]].chinese)
								.attr("class","material-display")
								.attr("data-id",evolution[text].need[key])
								.text(evolution[text].need[key])
							);
						if(key < evolution[text].need.length - 1)
							$( this ).children().eq(3).append(",");
					}
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
						console.log(ultimate[i].need);
						$( this ).append($("<td>"));
						console.log(ultimateNeed);
						for(var key in ultimateNeed){
							$( this ).children().eq(3).append(
								$("<span>").text(ultimateNeed[key])
									.attr("data-id",ultimateNeed[key])
									.attr("title",name[ultimateNeed[key]].chinese)
									.attr("class","material-display")
								);
							if(key < ultimateNeed.length - 1)
								$( this ).children().eq(3).append(",");
						}
						for(j=0;j<ultimateNeed.length;j++){
							if(ultimateNeed[j] in allNeed)
								allNeed[ultimateNeed[j]] ++;
							else
								allNeed[ultimateNeed[j]] = 1;
						}
					}
					else{
						var id  = $(this).attr('id');
						$( this ).append($("<td>")
							.append($("<button>")
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
										if(text == ultimate[i].no)
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
									console.log(ultimateResult);
								})
							)
						);
	//
						$("#ultimateBranch [data-dismiss='modal']").click(function(){
							$("#ultimateBranch .modal-body form").remove();
							$("#ultimateBranch .modal-body").append($("<form>"));
						});
					}
				}
				else if(evolution[text].status == 'n')
					$( this ).append("<td>" + "無法進化" + "</td>");
			}else
				$( this ).append($("<td>"));
			//顯示動作
			$( this ).append($("<td>")
				.append($("<span>")
					.addClass("glyphicon glyphicon-remove")
					.attr("title","刪除")
					.click(function(){
						var id = $(this).parent().parent().attr('id');
						var box = dataLoad("box");
						deleteMonster(id,box);
						var string = JSON.stringify(box);
						window.localStorage.box = string;
						boxReset();
						internalLoad();
					})
				).append(" ")
			);
			if(evolution[text].status != "n")
				$( this ).children().last().append($("<span>")
					.addClass("glyphicon glyphicon-forward")
					.attr("title","進化")
					.click(function(){
						var text = $( this ).parent().parent().children().first().text();
						var id = $( this ).parent().parent().attr("id");
						var evolution = JSON.parse(window.localStorage.evolution);
						var ultimate = JSON.parse(window.localStorage.ultimate);
						var box = dataLoad("box");
						var material = dataLoad("material");
						var need = [];
						var notHave = [];
						var notIn = [];
						var error = 0;
						if(text in evolution){
							if(evolution[text].status == 'y'){
								need = evolution[text].need;
							}
							else if(evolution[text].status == 'u'){
								if(choice > 0){
									var i = 1;
									var ultimateNeed = ultimate[i].need;
									while(ultimate[i].result!=choice){
										i++;
										ultimateNeed = ultimate[i].need;
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
								console.log(need[index]);
								while(material[i].no != parseInt(need[index]) && i<45){
									i++;
								}
								if(material[45].no != parseInt(need[index]) && i==45)
									i++;
								if(i<46){
									console.log(material);
									console.log(material[i].quantity);
									material[i].quantity --;
									console.log(material[i].quantity);
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
							deleteMonster(id,box);
							string = JSON.stringify(box);
							window.localStorage.box = string;
							boxReset();
							internalLoad();
						}else if(error == 0){
							boxReset();
							internalLoad();
						}
						if(error == 2){
							alert(notHave + "不存在\n無法進化");
						
						}
					})
				);
			
		});
		$(".material-display").tooltipster(); //active tooltipster
		console.log(allNeed);
		$("#material tbody tr").each(function(){
			var no = $(this).children().first().text();
			$(this).children().eq(3).text(allNeed[no]);
			var total = $(this).children().eq(2).text() - $(this).children().eq(3).text();
			$(this).children().eq(4).text(total);
		});
		$("#mainTable table").tablesorter();
	}else
		return false;
}

function externalLoad()
{
	$.ajax({
		dataType: 'jsonp',
		url: "https://api.github.com/repos/sdw113322/padboxer/contents/name.json?ref=data-source", 
		success: function(data){
			var string = atob(data.data.content);
			window.localStorage.name = string;
		},
		error: function(request,error) 
		{
		 console.log(arguments);
		 alert ( "錯誤: " + error );
		}
	});
	$.ajax({
		dataType: 'jsonp',
		url: "https://api.github.com/repos/sdw113322/padboxer/contents/evolution.json?ref=data-source", 
		success: function(data){
			var string = atob(data.data.content);
			window.localStorage.evolution = string;
		},
		error: function(request,error) 
		{
		 console.log(arguments);
		 alert ( "錯誤: " + error );
		}
	});
	$.ajax({
		dataType: 'jsonp',
		url: "https://api.github.com/repos/sdw113322/padboxer/contents/ultimate.json?ref=data-source", 
		success: function(data){
			var string = atob(data.data.content);
			window.localStorage.ultimate = string;
		},
		error: function(request,error) 
		{
		 console.log(arguments);
		 alert ( "錯誤: " + error );
		}
	});
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
	boxReset();
	internalLoad();
}

function addMonster(no,times,box)
{
	var mon = {};
	var i = 0;
	for(i=0;i<times;i++){
		mon["id"] = window.localStorage.boxid;
		mon["no"] = no;
		box.push(mon);
		window.localStorage.boxid ++;
	}
	var string = JSON.stringify(box);
	window.localStorage.box = string;
	boxReset();
	internalLoad();
	$("#add input[name='no']").val("");
	$("#add input[name='quantity']").val("1");
} 

$(document).ready(function() {
	if(internalLoad(0) == false){
		externalLoad();
		window.setTimeout("internalLoad(1);",5000);
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
		console.log(id);
		console.log(branchChoice);
		box[id].choice = branchChoice;
		$("#ultimateBranch .modal-body form").remove();
		$("#ultimateBranch .modal-body").append($("<form>"));
		var string = JSON.stringify(box);
		window.localStorage.box = string;
		boxReset();
		internalLoad();
		$('#ultimateBranch').modal('hide');
	});
	$("#btn-add").click(function(){
		$("#add").show( 400 );
		$("#btn-add").addClass("active");
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
		$("#btn-box").parent().removeClass("active");
		$("#btn-about").parent().removeClass("active");
		$("#btn-material").parent().addClass("active");
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
		$("#btn-box").parent().addClass("active");
		$("#btn-material").parent().removeClass("active");
		$("#btn-about").parent().removeClass("active");
	});	
	$("#btn-about").click(function(){
		$("#mainTable").hide( 400 );
		$("#material").hide( 400 );
		window.setTimeout("$(\"#about\").show( 400 );",400);
		$("#btn-add").removeAttr("disabled");
		$("#btn-about").parent().addClass("active");
		$("#btn-box").parent().removeClass("active");
		$("#btn-material").parent().removeClass("active");
		$("#btn-add").attr("disabled","disabled");
		$("#add").hide( 400 );
		$("#add input[name='no']").val("");
		$("#add input[name='quantity']").val("1");
		$("#btn-add").removeClass("active");
	});	
	$("#add input").keyup(function(event){
		if(event.keyCode == 13){
			$("#add #btn-add-enter").click();
		}
	});
	$("#clear").click(function(){
		window.localStorage.clear();
		document.location.reload(true);
	});
	$("#backup").click(function(){
		var backup = window.localStorage.boxid + "      " + window.localStorage.box + "      " + window.localStorage.material;
		$("#backup-modal .modal-body textarea").val(backup);
	});
	$("span.add-material").click(function(){
		var id = $(this).attr('data-id');
		$.debounce( 250, addMaterial(id) );
	});
	$("span.edit-material")
		.attr("data-toggle","modal")
		.attr("data-target","#material-modal")
		.click(function(){
			var id = $(this).attr('data-id');
			var material = dataLoad("material");
			$("#material-modal .modal-body form input").val(material[id].quantity);
			$("#material-modal .modal-body form input").attr("data-id",id);
		});
	$("#material-modal .btn-primary").click(function(){
		var value = $("#material-modal .modal-body form input").val();
		var id = $("#material-modal .modal-body form input").attr("data-id");
		var material = dataLoad("material");
		material[id].quantity = value;
		var string = JSON.stringify(material);
		window.localStorage.material = string;
		boxReset();
		internalLoad();
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
		$("#import-modal .modal-body textarea").val();
		$('#import-modal').modal('hide');
	});
	$("#update").click(function(){
		window.localStorage.removeItem("time");
		document.location.reload(true);
	});
});