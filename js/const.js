<<<<<<< HEAD
var version = "1.7 dev";
=======
var version = "1.6";
>>>>>>> 903df65bfc4b9a277bbc625102591c9c4deb5443
//素材資料 (編號,屬性,名稱)
function material(no,element,name){
	this.no = no;
	this.element = element;
	this.name = name;
}
var materialAttr = new Array();
materialAttr[0] = new material(147,"red","火番");
materialAttr[1] = new material(148,"blue","水番");
materialAttr[2] = new material(149,"green","木番");
materialAttr[3] = new material(150,"yellow","光番");
materialAttr[4] = new material(151,"purple","暗番");
materialAttr[5] = new material(321,"purple","虹番");
materialAttr[6] = new material(1176,"yellow","黃金番");
materialAttr[7] = new material(161,"red","火假面");
materialAttr[8] = new material(171,"red","火神面");
materialAttr[9] = new material(166,"red","火鬼面");
materialAttr[10] = new material(162,"blue","水假面");
materialAttr[11] = new material(172,"blue","水神面");
materialAttr[12] = new material(167,"blue","水鬼面");
materialAttr[13] = new material(1294,"blue","古代水面");
materialAttr[14] = new material(163,"green","木假面");
materialAttr[15] = new material(173,"green","木神面");
materialAttr[16] = new material(168,"green","木鬼面");
materialAttr[17] = new material(1295,"green","古代木面");
materialAttr[18] = new material(164,"yellow","光假面");
materialAttr[19] = new material(174,"yellow","光神面");
materialAttr[20] = new material(169,"yellow","光鬼面");
materialAttr[21] = new material(165,"purple","暗假面");
materialAttr[22] = new material(175,"purple","暗神面");
materialAttr[23] = new material(170,"purple","暗鬼面");
materialAttr[24] = new material(234,"yellow","神秘面");
materialAttr[25] = new material(152,"green","龍種");
materialAttr[26] = new material(153,"green","龍芽");
materialAttr[27] = new material(154,"green","龍花");
materialAttr[28] = new material(227,"green","龍果");
materialAttr[29] = new material(1085,"red","紅龍果");
materialAttr[30] = new material(1086,"blue","藍龍果");
materialAttr[31] = new material(1087,"green","綠龍果");
materialAttr[32] = new material(155,"red","火精");
materialAttr[33] = new material(156,"blue","水精");
materialAttr[34] = new material(157,"green","木精");
materialAttr[35] = new material(158,"yellow","光精");
materialAttr[36] = new material(159,"purple","暗精");
materialAttr[37] = new material(160,"purple","彩精");
materialAttr[38] = new material(246,"red","雙倍火精");
materialAttr[39] = new material(247,"blue","雙倍水精");
materialAttr[40] = new material(248,"green","雙倍木精");
materialAttr[41] = new material(249,"yellow","雙倍光精");
materialAttr[42] = new material(250,"purple","雙倍暗精");
materialAttr[43] = new material(251,"purple","雙倍彩精");
materialAttr[44] = new material(915,"yellow","光魚蛋");
materialAttr[45] = new material(916,"purple","暗魚蛋");
materialAttr[46] = new material(1325,"red","火寶玉");
materialAttr[47] = new material(1326,"blue","水寶玉");
materialAttr[48] = new material(1327,"green","木寶玉");
materialAttr[49] = new material(1328,"yellow","光寶玉");
materialAttr[50] = new material(1329,"purple","暗寶玉");
//素材分類模板
var materialTemplate = new Array();
materialTemplate[0] = new Array();
materialTemplate[0][0] = [[0,1,2,3,4,5,6],[7,9,8,10,12,11,13,14,16,15,17,18,20,19,21,23,22,24],[25,26,27,28,29,30,31],[32,33,34,35,36,37,38,39,40,41,42,43,44,45],[46,47,48,49,50]];
materialTemplate[0][1] = ["tue","wed","thu","fri","jewel"];
materialTemplate[0][2] = ["火曜日　星期二","水曜日　星期三","木曜日　星期四","金曜日　星期五","寶玉"];