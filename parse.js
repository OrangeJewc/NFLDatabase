var textFile;
var statLines;
var year = 2015;
var isCompare = false;

function main() {
	readTextFile('2015stats.txt');
}

function addCompare() {
	var compare = document.getElementById('compare');
	
	//Remove comparison
	if(compare.innerHTML=="Remove Comparison") {
		document.body.removeChild(document.getElementById('players2'));
		document.body.removeChild(document.getElementById('yearList2'));
		compare.innerHTML = "Compare";
		isCompare = false;
		return;
	}
	
	//Create new text area
	compare.innerHTML = "Remove Comparison";
	var players2 = document.getElementById('players').cloneNode(true);
	var yearList2 = document.getElementById('yearList').cloneNode(true);
	players2.id = "players2";
	players2.style.cssText = "font-size:15pt; font:Arial; resize:none; top:"+players.offsetTop+"px; position:absolute; left:"+(parseInt(compare.style.left)+compare.offsetWidth+100)+"px;";
	players2.value = "";
	players2.onkeydown = function(event){showPlayerStats2(event)};
	yearList2.id = "yearList2";
	yearList2.style.cssText = "font-size:15pt; font:Arial; height:30px; top:"+players.offsetTop+"px; position:absolute; left:"+(parseInt(players2.style.left)+players.offsetWidth)+"px;";
	yearList2.style.height = players.offsetHeight+"px";
	yearList2.onchange = function(){updateYear2()};
	//while(document.getElementById('players').readOnly) {}
	players2.readOnly = false;
	
	if(getAllByClass("textbox").length==1) {
		document.body.appendChild(players2);
		document.body.appendChild(yearList2);
		isCompare = true;
	}
}

function readTextFile(file,name=null,textBox=1)
{
	//initial loading screen
	var entries = getAllByClass("textBox1");
	if(textBox==2)
		entries = getAllByClass("textBox2");
	if(entries.length==0) {
		var tmp = document.createElement('pre');
		if(textBox==1)
			tmp.className = "textBox1";
		else {
			tmp.className = "textBox2";
			console.log("hi");
			tmp.style.left = players2.offsetLeft+"px";
		}
		tmp.innerHTML = "Loading...";
		document.body.appendChild(tmp);
	}

	if(textBox==1)
		document.getElementById('players').readOnly = true;
	else
		document.getElementById('players2').readOnly = true;
	var rawFile = new XMLHttpRequest();
    var txt = "";
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4 && rawFile.status === 200) {
            var alltext = rawFile.responseText;
            txt = alltext;
			setText(txt,name,textBox);
			if(textBox==1)
				simKeyPress(document.getElementById('players'),39);
			else
				simKeyPress(document.getElementById('players2'),39);
		}
    };
	rawFile.send(null);
}

function setText(txt,name=null,textBox=1) {
	textFile = txt;
	statLines = textFile.split('\n');
	document.getElementById('players').readOnly = false;

	//remove loading screen
	//var entries = document.getElementsByTagName('pre');
	var entries = getAllByClass("textBox1");
	if(textBox==2)
		entries = getAllByClass("textBox2");
	if(entries.length>0) {
		for(var i=0; i<entries.length; i++) 
			document.body.removeChild(entries[i]);
	}
	
	if(name && name.length>0) {
		var tmp = document.createElement('pre');
		tmp.className = "textBox1";
		if(textBox==2)
			tmp.className = "textBox2";
		tmp.innerHTML = formatStats(searchForPlayer(name));
		document.body.appendChild(tmp);
		//make it so if no result found then simulate simkeypress. I.E: switching from jordy nelsons stats from 2015 to 2014
		if(tmp.innerHTML=="Player Not Found...") {
			if(textBox==1)
				simKeyPress(document.getElementById('players'),39);
			else
				simKeyPress(document.getElementById('players2'),39);
		}
	}
}

function searchForPlayer(name) {
	var idx = -1;
	for(var i=0; i<statLines.length; i++) {
		if(statLines[i].toLowerCase().substring(0,statLines[i].toLowerCase().indexOfN(" ",2)).indexOf(name.toLowerCase())!=-1) {
			idx = i;
		}
	}
	if(idx!=-1)
		return statLines[idx];
	else
		return "N/A";
}

function simKeyPress(el, charCode) {
	var e = new Event("keydown");
	e.key = String.fromCharCode(charCode);
	e.keyCode = e.key.charCodeAt(0);
	e.which = e.keyCode;
	e.altKey = false;
	e.ctrlKey = false;
	e.shiftKey = false;
	e.metaKey = false;
	e.bubbles = true;
	el.dispatchEvent(e);
}

function showPlayerStats(e) {	
	var event = e;
	var players = document.getElementById('players');
	var txt;
	var fButton = document.getElementById('fCalc');
	var p = document.getElementsByTagName('p');
	var scoringOptions = document.getElementById('fantasyOptions');
	
	if(event.keyCode==13) 
		event.preventDefault();
	
	setTimeout(function() {
		txt = players.value;
		
		//var entries = document.getElementsByTagName('pre');
		var entries = getAllByClass("textBox1");
		if(entries.length>0) {
			for(var i=0; i<entries.length; i++) 
				document.body.removeChild(entries[i]);
		}
		
		if(txt.length>0) {
			var tmp = document.createElement('pre');
			tmp.className = "textBox1";
			tmp.innerHTML = formatStats(searchForPlayer(txt));
			document.body.appendChild(tmp);
			if(searchForPlayer(txt)!="N/A") {
				p[0].style.display = "block";
				p[0].style.top = tmp.offsetHeight+50+"px";
				p[1].style.display = "block";
				p[1].style.top = tmp.offsetHeight+50+"px";
				fButton.style.top = parseInt(p[1].style.top)+70+"px";
				scoringOptions.style.top = fButton.style.top;
				if(document.getElementById("stats")!=null)
					document.getElementById("stats").style.top = parseInt(fButton.style.top)+50+"px";

				//calc button and scoringlist
				fButton.style.display="block";
				scoringOptions.style.display="block";

				fButton.style.left = (scoringOptions.clientWidth+16)+"px";
				scoringOptions.style.top = fButton.offsetTop+"px";
				scoringOptions.style.height = fButton.offsetHeight+"px";
			}
		} else {
			if(document.getElementById("stats")!=null) {
				document.body.removeChild(document.getElementById("stats"));
			}
		}
		
		if((searchForPlayer(txt)=="N/A" || txt.length==0) && fButton!=null) {
			fButton.style.display="none";
			p[0].style.display="none";
			p[1].style.display="none";
			scoringOptions.style.display="none";
		}
	},0);
}

function showPlayerStats2(e) {
	var event = e;
	var players2 = document.getElementById('players2');
	var txt;
	//var fButton = document.getElementById('fCalc');
	//var p = document.getElementsByTagName('p');
	//var scoringOptions = document.getElementById('fantasyOptions');
	
	if(event.keyCode==13) 
		event.preventDefault();
	
	setTimeout(function() {
		txt = players2.value;
		
		var entries = getAllByClass("textBox2");
		if(entries.length>0) {
			for(var i=0; i<entries.length; i++) 
				document.body.removeChild(entries[i]);
		}
		
		if(txt.length>0) {
			var tmp = document.createElement('pre');
			tmp.className = "textBox2";
			tmp.style.cssText = "position:absolute; left:"+players2.style.left+"; top:45px;";
			tmp.innerHTML = formatStats(searchForPlayer(txt));
			document.body.appendChild(tmp);
			/*if(searchForPlayer(txt)!="N/A") {
				p[0].style.display = "block";
				p[0].style.top = tmp.offsetHeight+50+"px";
				p[1].style.display = "block";
				p[1].style.top = tmp.offsetHeight+50+"px";
				fButton.style.top = parseInt(p[1].style.top)+70+"px";
				scoringOptions.style.top = fButton.style.top;
				if(document.getElementById("stats")!=null)
					document.getElementById("stats").style.top = parseInt(fButton.style.top)+50+"px";

				//calc button and scoringlist
				fButton.style.display="block";
				scoringOptions.style.display="block";

				fButton.style.left = (scoringOptions.clientWidth+16)+"px";
				scoringOptions.style.top = fButton.offsetTop+"px";
				scoringOptions.style.height = fButton.offsetHeight+"px";
			}*/
		} else {
			/*if(document.getElementById("stats")!=null) {
				document.body.removeChild(document.getElementById("stats"));
			}*/
		}
		
		/*if((searchForPlayer(txt)=="N/A" || txt.length==0) && fButton!=null) {
			fButton.style.display="none";
			p[0].style.display="none";
			p[1].style.display="none";
			scoringOptions.style.display="none";
		}*/
	},0);
}

function updateYear() {
	var list = document.getElementById('yearList');
	year = list.options[list.selectedIndex].value;

	var entries = getAllByClass("textBox1");
	if(entries.length>0) {
		var name;
		for(var i=0; i<entries.length; i++) {
			name = entries[i].innerHTML.substring(entries[i].innerHTML.indexOf(" ")+1,entries[i].innerHTML.indexOf("\n"));
			document.body.removeChild(entries[i]);
		}
		
		if(name.length>0) {
			var tmp = document.createElement('pre');
			tmp.className = "textBox1";
			tmp.innerHTML = "Loading...";
			document.body.appendChild(tmp);
		}
		readTextFile(year+'stats.txt',name);
	} else {
		readTextFile(year+'stats.txt');
	}
}

function updateYear2() {
	var list = document.getElementById('yearList2');
	year = list.options[list.selectedIndex].value;

	var entries = getAllByClass("textBox2");
	if(entries.length>0) {
		var name;
		for(var i=0; i<entries.length; i++) {
			name = entries[i].innerHTML.substring(entries[i].innerHTML.indexOf(" ")+1,entries[i].innerHTML.indexOf("\n"));
			document.body.removeChild(entries[i]);
		}
		
		if(name.length>0) {
			var tmp = document.createElement('pre');
			tmp.className = "textBox2";
			tmp.innerHTML = "Loading...";
			document.body.appendChild(tmp);
		}
		readTextFile(year+'stats.txt',name,2);
	} else {
		readTextFile(year+'stats.txt',2);
	}
}

function sortRush(stats) {
	var newStats = [];
	for(var i=0; i<stats.length; i++) {
		console.log("hi");
	}
}

function getFantasyType(textBox) {
	if(document.getElementById("stats")!=null) {
		document.body.removeChild(document.getElementById("stats"));
	}
	var scoringOptions = document.getElementById('fantasyOptions');
	var type = scoringOptions.value;

	var entries;
	if(textBox==1)
		entries = getAllByClass("textBox1");
	else
		entries = getAllByClass("textBox2");
	if(entries.length>0) {
		var name;
		for(var i=0; i<entries.length; i++) {
			name = entries[i].innerHTML.substring(entries[i].innerHTML.indexOf(" ")+1,entries[i].innerHTML.indexOf("\n"));
		}
	}
	calculateFantasyPoints(type,name);
}

function calculateFantasyPoints(type, name) {
	var playerStats = searchForPlayer(name);
	var passTdPts = getPassTds(playerStats)*4;
	var passYdPts = getPassYds(playerStats)/25;
	var passInts = getPassInts(playerStats)*2;
	var pass2Pts = getPass2pt(playerStats)*2;
	var rushYdPts = getRushYds(playerStats)*0.1;
	var rushTdPts = getRushTds(playerStats)*6;
	var rush2Pts = getRush2Pts(playerStats)*2;
	var recYdPts = getRecYds(playerStats)*0.1;
	var recTdPts = getRecTds(playerStats)*6;
	var recRecPts = getRecRec(playerStats);
	var rec2Pts = getRec2Pts(playerStats)*2;
	var fumbles = getFumblesTot(playerStats)*2;
	var fg3pt = getFG30(playerStats)*3;
	var fg4pt = getFG40(playerStats)*4;
	var fg5pt = (getFG50(playerStats)+getFG60(playerStats))*5;
	var xpMade = getXPMade(playerStats);
	var fgMissed = getFGAttempts(playerStats)-getFGMade(playerStats);	
	
	var format = "";
	
	if(type=="fullppr")
		format = "PPR";
	else if(type=="halfppr") {
		recRecPts = recRecPts/2;
		format = "0.5 PPR";
	} else if(type=="standard") {
		recRecPts = 0;
		format = "Standard";
	} else {
		format = "Custom";
	}
	
	var result = (passTdPts+pass2Pts+passYdPts-passInts+rushYdPts+rush2Pts+rushTdPts+recYdPts+recTdPts+rec2Pts+recRecPts-fumbles+fg3pt+fg4pt+fg5pt+xpMade-fgMissed).toFixed(2);

	//Create and append calculation text
	var tmp = document.createElement('h1');
	tmp.style.fontSize = "18px";
	tmp.id = "stats";
	tmp.innerHTML = "Player:&nbsp;&nbsp;&nbsp;&nbsp;"+name+"<br>"+"Year:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\t"+year+"<br>"+"Format:&nbsp;&nbsp;"+format+"<br>"+"Points:&nbsp;&nbsp;&nbsp;&nbsp;"+result;
	tmp.style.top = parseInt(document.getElementById('fCalc').style.top)+50+"px";
	document.body.appendChild(tmp);
	
	return result;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//PASSING

function getName(stats) {
	return stats.substring(0,stats.indexOfN(" ",2));
}

function getPassAtt(stats) {
	if(stats.indexOf('passing_att:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('passing_att:')+13);
	var tmpidx = stats.substring(stats.indexOf('passing_att:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getPassComp(stats) {
	if(stats.indexOf('passing_cmp:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('passing_cmp:')+13);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getPassYds(stats) {
	if(stats.indexOf('passing_yds:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('passing_yds:')+13);
	var tmpidx = stats.substring(stats.indexOf('passing_yds:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getPassTds(stats) {
	if(stats.indexOf('passing_tds:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('passing_tds:')+13);
	var tmpidx = tmpstr.indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getPassInts(stats) {
	if(stats.indexOf('passing_ints:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('passing_ints')+14);
	var tmpidx = stats.substring(stats.indexOf('passing_ints')+14).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getPass2pt(stats) {
	if(stats.indexOf('passing_twoptm:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('passing_twoptm:')+16);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getPassRate(stats) {
	if(getPassComp(stats)==0)
		return 0;
	
	var a = ((getPassComp(stats)/getPassAtt(stats))-.3)*5;
	var b = ((getPassYds(stats)/getPassAtt(stats))-3)*.25;
	var c = (getPassTds(stats)/getPassAtt(stats))*20;
	var d = 2.375 - ((getPassInts(stats)/getPassAtt(stats))*25);
	return (((a+b+c+d)/6)*100).toFixed(2);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//RUSHING

function getRushAtt(stats) {
	if(stats.indexOf('rushing_att:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('rushing_att:')+13);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getRushYds(stats) {
	if(stats.indexOf('rushing_yds:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('rushing_yds:')+13);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getRushTds(stats) {
	if(stats.indexOf('rushing_tds:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('rushing_tds:')+13);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getRush2Pts(stats) {
	if(stats.indexOf('rushing_twoptm:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('rushing_twoptm:')+16);
	var tmpidx = tmpstr.indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//RECEIVING

function getRecRec(stats) {
	if(stats.indexOf('receiving_rec:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('receiving_rec:')+15);
	var tmpidx = stats.substring(stats.indexOf('receiving_rec:')+15).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getRecYds(stats) {
	if(stats.indexOf('receiving_yds:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('receiving_yds:')+15);
	var tmpidx = stats.substring(stats.indexOf('receiving_yds:')+15).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getRecTds(stats) {
	if(stats.indexOf('receiving_tds:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('receiving_tds:')+15);
	var tmpidx = stats.substring(stats.indexOf('receiving_tds:')+15).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getRec2Pts(stats) {
	if(stats.indexOf('receiving_twoptm:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('receiving_twoptm:')+18);
	var tmpidx = tmpstr.indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//DEFENSE

function getTackles(stats) {
	if(stats.indexOf('defense_tkl:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('defense_tkl:')+13);
	var tmpidx = stats.substring(stats.indexOf('defense_tkl:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFFum(stats) {
	if(stats.indexOf('defense_ffum:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('defense_ffum:')+14);
	var tmpidx = stats.substring(stats.indexOf('defense_ffum:')+14).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getInt(stats) {
	if(stats.indexOf('defense_int:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('defense_int:')+13);
	var tmpidx = stats.substring(stats.indexOf('defense_int:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getSacks(stats) {
	if(stats.indexOf('defense_sk:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('defense_sk:')+12);
	var tmpidx = stats.substring(stats.indexOf('defense_sk:')+12).indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//MISC

function getFumblesLost(stats) {
	if(stats.indexOf('fumbles_lost:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('fumbles_lost:')+14);
	var tmpidx = stats.substring(stats.indexOf('fumbles_lost:')+14).indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFumblesTot(stats) {
	if(stats.indexOf('fumbles_tot:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('fumbles_tot:')+13);
	var tmpidx = stats.substring(stats.indexOf('fumbles_tot:')+13).indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

//KICKING

function getFGAttempts(stats) {
	if(stats.indexOf('kicking_fga:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('kicking_fga:')+13);
	var tmpidx = stats.substring(stats.indexOf('kicking_fga:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFGMade(stats) {
	if(stats.indexOf('kicking_fgm:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('kicking_fgm:')+13);
	var tmpidx = stats.substring(stats.indexOf('kicking_fgm:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getXPAttempts(stats) {
	if(stats.indexOf('kicking_xpa:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('kicking_xpa:')+13);
	var tmpidx = stats.substring(stats.indexOf('kicking_xpa:')+13).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getXPMade(stats) {
	if(stats.indexOf('kicking_xpmade:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('kicking_xpmade:')+16);
	var tmpidx = stats.substring(stats.indexOf('kicking_xpmade:')+16).indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFG30(stats) {
	if(stats.indexOf('30:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('30:')+4);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFG40(stats) {
	if(stats.indexOf('40:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('40:')+4);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFG50(stats) {
	if(stats.indexOf('50:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('50:')+4);
	var tmpidx = tmpstr.indexOf(",");
	return parseInt(tmpstr.substring(0,tmpidx));
}

function getFG60(stats) {
	if(stats.indexOf('60:')==-1)
		return 0;
	
	var tmpstr = stats.substring(stats.indexOf('60:')+4);
	var tmpidx = tmpstr.indexOf(",");
	if(tmpidx==-1)
		return parseInt(tmpstr);
	return parseInt(tmpstr.substring(0,tmpidx));
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

function formatStats(stats) {
	if(stats=="N/A")
		return "Player Not Found...";
	
	var name = getName(stats);
	var passing = {
		att: getPassAtt(stats),
		cmp: getPassComp(stats),
		rate: getPassRate(stats),
		yds: getPassYds(stats),
		tds: getPassTds(stats),
		twopt: getPass2pt(stats),
		ints: getPassInts(stats)
	}
	
	var rushing = {
		att: getRushAtt(stats),
		yds: getRushYds(stats),
		tds: getRushTds(stats),
		twopt: getRush2Pts(stats)
	}
	
	var receiving = {
		rec: getRecRec(stats),
		yds: getRecYds(stats),
		tds: getRecTds(stats),
		twopt: getRec2Pts(stats)
	}
	
	var def = {
		display: 0,
		tckl: getTackles(stats),
		ints: getInt(stats),
		ffum: getFFum(stats),
		scks: getSacks(stats)
	}
	
	var kick = {
		display: 0,
		xpa: getXPAttempts(stats),
		xpm: getXPMade(stats),
		fga: getFGAttempts(stats),
		fgm: getFGMade(stats),
		fg40: getFG40(stats)+getFG50(stats)+getFG60(stats),
		fg50: getFG50(stats)+getFG60(stats),
		fg60: getFG60(stats)
	}
	
	var fumblesLost = getFumblesLost(stats);
	var fumblesTot = getFumblesTot(stats);
	
	for(var i in def) {
		if(def[i]!=0)
			def.display = 1;
	}
	
	for(var i in kick) {
		if(kick[i]!=0)
			kick.display = 1;
	}
	
	var result = "Name: "+name;

	if(passing.att!=0) {
		result+="\n\nPassing Attempts: "+passing.att;
		result+="\nPassing Completions: "+passing.cmp;
		result+="\nPasser Rating: "+passing.rate;
		result+="\n\nPassing Yards: "+passing.yds;
		result+="\nPassing TDs: "+passing.tds;
		result+="\nPassing 2pt Conversions: "+passing.twopt;
		result+="\nInterceptions: "+passing.ints;
	}
	
	if(rushing.att!=0) {
		result+="\n\nRushing Attempts: "+rushing.att;
		result+="\nRushing Yards: "+rushing.yds;
		result+="\nRushing TDs: "+rushing.tds;
		result+="\nRushing 2pt Conversions: "+rushing.twopt;
	}
	
	if(receiving.rec!=0) {
		result+="\n\nReceptions: "+receiving.rec;
		result+="\nReceiving Yards: "+receiving.yds;
		result+="\nReceiving TDs: "+receiving.tds;
		result+="\nReceiving 2pt Conversions: "+receiving.twopt;
	}
	
	if(def.display==1)
		result+="\n";
	if(def.tckl!=0)
		result+="\nTackles: "+def.tckl;
	if(def.ints!=0)
		result+="\nInterceptions: "+def.ints;
	if(def.ffum!=0)
		result+="\nForced Fumbles: "+def.ffum;
	if(def.scks!=0)
		result+="\nSacks: "+def.scks;
	
	if(kick.display==1)
		result+="\n";
	if(kick.fga!=0)
		result+="\nFG Attempts: "+kick.fga;
	if(kick.fgm!=0)
		result+="\nFG Made: "+kick.fgm;
	if(kick.xpa!=0)
		result+="\nXP Attempts: "+kick.xpa;
	if(kick.xpm!=0)
		result+="\nXP Made: "+kick.xpm;
	if(kick.fg40!=0)
		result+="\n40+ Yard FG: "+kick.fg40;
	if(kick.fg50!=0)
		result+="\n50+ Yard FG: "+kick.fg50;
	if(kick.fg60!=0)
		result+="\n60+ Yard FG: "+kick.fg60;
	if(fumblesTot!=0) {
		result+="\n\nFumbles: "+fumblesTot;
		result+="\nFumbles Lost: "+fumblesLost;
	}
	
	return result;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

String.prototype.indexOfN = function(needle, n) {
	for (i=0;i<this.length;i++) {
		if (this.charAt(i) == needle) {
			if (!--n) {
				return i;    
			}
		}
	}
	return false;
}

function getAllByClass(classname, node) {

    if (!document.getElementsByClassName) {
        if (!node) {
            node =  document.body;
        }

        var a = [],
            re = new RegExp('\\b' + classname + '\\b'),
            els = node.getElementsByTagName("*");

        for (var i = 0, j = els.length; i < j; i++) {
            if (re.test(els[i].className)) {
                a.push(els[i]);
            }
        }
    } else {
        return document.getElementsByClassName(classname);
    }

    return a;
}