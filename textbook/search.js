var googleAPI = "https://www.googleapis.com/books/v1/volumes?q="+String.fromCharCode(8203)+"&key=AIzaSyDKlBomQBFmShbHbRrekWTOobjHfhTQqR0";
var input = document.getElementById("input");
var search = document.getElementById("search");
var entries = document.getElementById("entries");

function searchTitle() {
	var textInput = input.value.replace(new RegExp(" ", 'g'), "+")
	var newUrl = googleAPI.replace(String.fromCharCode(8203), textInput);
	
	if(textInput.length > 0) { //If non-empty string do API call
		httpGetAsync(newUrl, callback);
	} else {
		clearChildren(entries);
	}
}

function httpGetAsync(theUrl, callback)
{	
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function callback(bookInfo) {
	
	//clear previous entries
	if(entries.children.length != 0) {
		clearChildren(entries);
	}
	
	//make list visible
	entries.style.display = "block";
	
	var bookEntries = [];
	
	for(i=0; i<bookInfo.items.length; i++) {
		bookEntries[i] = document.createElement("div");
		bookEntries[i].style.height = input.offsetHeight+"px";
		bookEntries[i].style.width = input.clientWidth+"px";
		bookEntries[i].style.whiteSpace = "nowrap";
		bookEntries[i].innerHTML = bookInfo.items[i].volumeInfo.title;
		
		if(bookInfo.items[i].volumeInfo.subtitle!=null) {
			bookEntries[i].innerHTML += ": "+bookInfo.items[i].volumeInfo.subtitle;
		}

		//dynamically populate list of matching books
		entries.appendChild(bookEntries[i]);
	}
	
	//highlight entries
	entries.onmousemove = function(e) {
		if(e.target.parentNode == entries) {			
			e.target.onmouseover = function() {
				e.target.style.backgroundColor = "#c4c4c4";
			}
			
			e.target.onmouseout = function() {
				e.target.style.backgroundColor = "initial";
			}
			
			//retrieve necessary info
			e.target.onclick = function() {
				var index = bookEntries.indexOf(e.target);
				var curBook = bookInfo.items[index];
				var edition = getEdition(curBook);
				var isbn13;
				var isbn10;
				
				if(curBook.volumeInfo.industryIdentifiers[0].identifier.length>curBook.volumeInfo.industryIdentifiers[1].identifier.length) {
					isbn13 = curBook.volumeInfo.industryIdentifiers[0].identifier;
					isbn10 = curBook.volumeInfo.industryIdentifiers[1].identifier;
				} else {
					isbn13 = curBook.volumeInfo.industryIdentifiers[1].identifier;
					isbn10 = curBook.volumeInfo.industryIdentifiers[0].identifier;
				}
				
				var subject = getSubject(curBook);
				
				var cheggIdentifier = subject+"-"+edition+"-edition-"+isbn13+"-"+isbn10;
				
				$.ajax({
					type: "POST",
					url: "chegg_spider.py",
					dataType: "html",
					data: "here is data",
					success: function(response) {
						alert(response);
					}
				});
				
				console.log(cheggIdentifier);
				console.log(curBook);
			}
		}
	}

	//console.log(bookInfo.items);
}

function clearChildren(parent) {
	while(parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	entries.style.display = "none";
}

function getSubject(book) {
	var subject = book.volumeInfo.title.toLowerCase();
	
	if(subject.indexOf(":")==-1) {
		return subject;
	} else {
		var index = subject.indexOf(":");
		subject = subject.substring(0,index).replace(new RegExp(" ", 'g'), "-");
	}
	return subject;
}

function getEdition(book) {
	var ordinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh"];
	var ordinalsNum = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th"];
	
	var bookLink = book.volumeInfo.previewLink;
	var editionStart = bookLink.search(/\d+th|\d+nd|\d+rd/g);
	var editionEnd = bookLink.substring(editionStart).indexOf("th")+2;
	var edition = bookLink.substring(editionStart,editionEnd+editionStart);
	
	if(edition.length==0 && book.volumeInfo.description!=null) {
		var description = book.volumeInfo.description.toLowerCase();
		
		if(description.indexOf("edition")!=-1 || description.indexOf("ed.")!=-1) {		
			for(i=0; i<ordinals.length; i++) {
				if(description.indexOf(ordinals[i])!=-1 || description.indexOf(ordinalsNum[i])!=-1)
					edition = ordinalsNum[i];
			}
		} else {
			edition = "1st";
		}
		
	} else {
		edition = "1st";
	}
	
	return edition;
}