var version = "2.5 beta 1";
//素材資料 (編號,屬性,名稱)
function materialData(no,element,name){
	this.no = no;
	this.element = element;
	this.name = name;
}
var materialAttr = new Array();
materialAttr[0] = new materialData(147,"red","火番");
materialAttr[1] = new materialData(148,"blue","水番");
materialAttr[2] = new materialData(149,"green","木番");
materialAttr[3] = new materialData(150,"yellow","光番");
materialAttr[4] = new materialData(151,"purple","暗番");
materialAttr[5] = new materialData(321,"purple","虹番");
materialAttr[6] = new materialData(1176,"yellow","黃金番");
materialAttr[7] = new materialData(161,"red","火假面");
materialAttr[8] = new materialData(171,"red","火神面");
materialAttr[9] = new materialData(166,"red","火鬼面");
materialAttr[10] = new materialData(162,"blue","水假面");
materialAttr[11] = new materialData(172,"blue","水神面");
materialAttr[12] = new materialData(167,"blue","水鬼面");
materialAttr[13] = new materialData(1294,"blue","古代水面");
materialAttr[14] = new materialData(163,"green","木假面");
materialAttr[15] = new materialData(173,"green","木神面");
materialAttr[16] = new materialData(168,"green","木鬼面");
materialAttr[17] = new materialData(1295,"green","古代木面");
materialAttr[18] = new materialData(164,"yellow","光假面");
materialAttr[19] = new materialData(174,"yellow","光神面");
materialAttr[20] = new materialData(169,"yellow","光鬼面");
materialAttr[21] = new materialData(165,"purple","暗假面");
materialAttr[22] = new materialData(175,"purple","暗神面");
materialAttr[23] = new materialData(170,"purple","暗鬼面");
materialAttr[24] = new materialData(234,"yellow","神秘面");
materialAttr[25] = new materialData(152,"green","龍種");
materialAttr[26] = new materialData(153,"green","龍芽");
materialAttr[27] = new materialData(154,"green","龍花");
materialAttr[28] = new materialData(227,"green","龍果");
materialAttr[29] = new materialData(1085,"red","紅龍果");
materialAttr[30] = new materialData(1086,"blue","藍龍果");
materialAttr[31] = new materialData(1087,"green","綠龍果");
materialAttr[32] = new materialData(155,"red","火精");
materialAttr[33] = new materialData(156,"blue","水精");
materialAttr[34] = new materialData(157,"green","木精");
materialAttr[35] = new materialData(158,"yellow","光精");
materialAttr[36] = new materialData(159,"purple","暗精");
materialAttr[37] = new materialData(160,"purple","彩精");
materialAttr[38] = new materialData(246,"red","雙倍火精");
materialAttr[39] = new materialData(247,"blue","雙倍水精");
materialAttr[40] = new materialData(248,"green","雙倍木精");
materialAttr[41] = new materialData(249,"yellow","雙倍光精");
materialAttr[42] = new materialData(250,"purple","雙倍暗精");
materialAttr[43] = new materialData(251,"purple","雙倍彩精");
materialAttr[44] = new materialData(915,"yellow","光魚蛋");
materialAttr[45] = new materialData(916,"purple","暗魚蛋");
materialAttr[46] = new materialData(1325,"red","火寶玉");
materialAttr[47] = new materialData(1326,"blue","水寶玉");
materialAttr[48] = new materialData(1327,"green","木寶玉");
materialAttr[49] = new materialData(1328,"yellow","光寶玉");
materialAttr[50] = new materialData(1329,"purple","暗寶玉");
//素材分類模板
var materialTemplate = new Array();
materialTemplate[0] = new Array();
materialTemplate[0][0] = [[0,1,2,3,4,5,6],[7,9,8,10,12,11,13,14,16,15,17,18,20,19,21,23,22,24],[25,26,27,28,29,30,31],[32,33,34,35,36,37,38,39,40,41,42,43,44,45],[46,47,48,49,50]];
materialTemplate[0][1] = ["tue","wed","thu","fri","jewel"];
materialTemplate[0][2] = ["火曜日　星期二","水曜日　星期三","木曜日　星期四","金曜日　星期五","寶玉"];
materialTemplate[1] = new Array();
materialTemplate[1][0] = [[46,29,38,8,0,9,32,7],[47,13,30,39,11,1,12,33,10],[48,17,31,40,28,15,27,2,16,26,34,25,14],[49,6,44,41,24,19,3,20,35,18],[50,45,5,43,42,22,37,4,23,36,21]];
materialTemplate[1][1] = ["fire","water","wood","light","dark"];
materialTemplate[1][2] = ["火屬性","水屬性","木屬性","光屬性","暗屬性"];