'use strict';
let system = new Object;
system.participator = new Array;
system.gameCount = 1;
system.ui = new Object;
system.ui.menuHidden = false;
setup();
document.body.addEventListener("submit", function(event) {
	let target = event.target;
	switch (target.tagName) {
		case "FORM":
			event.preventDefault();
			break;
	}
}, false);
document.body.addEventListener("keydown", function(event) {
	let target = event.target;
	if (event.key === "Enter") {
		switch (target.tagName) {
			case "INPUT":
				if (target.id == "bonus-magnification") {
					document.getElementById("game-next").click();
				}
				else
					target.parentNode.getElementsByTagName("button")[0].click();
				event.preventDefault();
				break;
			case "BUTTON":
				if (target.classList.contains("participator-lose")) {
					document.getElementById("game-next").click();
				}
				break;
		}
	}
}, false);
document.body.addEventListener("click", function(event) {
	let target = event.target;
	switch (target.tagName) {
		case "BUTTON":
			switch (target.id) {
				case "setup-submit":
					for (let input of document.getElementById("setup").getElementsByTagName("input")) {
						switch (input.name) {
							case "participator":
								let user = new Object;
								user.name = input.value || input.placeholder;
								user.score = 0;
								system.participator.push(user);
								break;
							default:
								system[input.name] = input.value || 0;
						}
					}
					UIRefresh();
					document.body.classList.add("app");
					document.body.classList.remove("setup");
					document.getElementById("setup").getElementsByTagName("fieldset")[system.setupIndex++].removeAttribute("class");
					localStorage.setItem("last", JSON.stringify(system));
					break;
				case "game-next":
					if (document.getElementById("score-edit").getElementsByClassName("active").length == 0) {
						alert("尚未選擇");
						break;
					}
					let scoreChange = parseInt(system.basement, 10) + parseInt(system.bonus, 10) * document.getElementById("bonus-magnification").value;
					if (document.getElementById("score-edit").getElementsByClassName("active")[0].dataset.i) {
						system.participator[document.getElementById("score-edit").getElementsByClassName("active")[0].dataset.i].score -= scoreChange;
					}
					else {
						for (let i = 0; i < system.participator.length; i++) {
							if (i == document.getElementById("winner").dataset.i) continue;
							system.participator[i].score -= scoreChange;
						}
						scoreChange *= 3;
					}
					system.participator[document.getElementById("winner").dataset.i].score += scoreChange;
					
					document.getElementById("score-edit").classList.remove("open");
					for (let btn of document.getElementsByClassName("participator-lose")) {
						btn.classList.remove("active");
					}
					document.getElementById("bonus-magnification").value = "";
					system.gameCount++;
					UIRefresh();
					break;
				case "menu-toggle":
					menuToggle();
					break;
			}
			if (target.classList.contains("setup-next")) {
				let steps = document.getElementById("setup").getElementsByTagName("fieldset");
				steps[system.setupIndex++].removeAttribute("class");
				if (system.setupIndex >= steps.length) {
					system.setupIndex = 0;
				}
				steps[system.setupIndex].setAttribute("class", "show");
			}
			if (target.classList.contains("window-toggle-btn")) {
				target.classList.toggle("active");
				document.getElementById(target.dataset.target).classList.toggle("open");
			}
			if (target.classList.contains("participator-goal")) {
				document.getElementById("winner").innerText = system.participator[target.dataset.index].name;
				document.getElementById("winner").dataset.i = target.dataset.index;
				let btn = document.getElementsByClassName("participator-lose");
				let temp = 0;
				for (let i = 1; i < btn.length; i++) {
					while (temp == target.dataset.index) temp++;
					btn[i].innerText = system.participator[temp].name;
					btn[i].dataset.i = temp;
					temp++;
				}
				document.getElementById("score-edit").classList.add("open");
			}
			if (target.classList.contains("participator-lose")) {
				for (let btn of document.getElementById("score-edit").getElementsByClassName("active")) {
					btn.classList.remove("active");
				}
				target.classList.add("active");
			}
			break;
	}
}, false);
function setup() {
	document.body.classList.add("setup");
	system.setupIndex = 0;
	document.getElementById("setup").getElementsByTagName("fieldset")[system.setupIndex].setAttribute("class", "show");
	let lastData = localStorage.getItem("last");
	if (lastData == null) {
		return;
	}
	lastData = JSON.parse(lastData);
	let input = document.getElementById("setup").getElementsByTagName("input");
	let participatorIndex = 0;
	for (let i = 0; i < input.length; i++) {
		switch (input[i].name) {
			case "basement":
			case "bonus":
				if (lastData.basement !== 0)
					input[i].value = lastData[input[i].name];
				break;
			case "participator":
				if (lastData.participator[participatorIndex].name != input[i].placeholder)
					input[i].value = lastData.participator[participatorIndex].name;
				participatorIndex++;
				break;
		}
	}
	try {
		if (localStorage.getItem("ui-menuHidden") == "true") {
			menuToggle();
		}
	}
	catch(e) {
		
	}
}
function UIRefresh() {
	document.getElementById("ui-basement").innerText = system.basement + " / " + system.bonus;
	document.getElementById("ui-game-count").innerText = system.gameCount;
	for (let i = 0; i < document.getElementsByClassName("participator-state").length; i++) {
		document.getElementsByClassName("participator-state")[i].getElementsByClassName("participator-name")[0].innerText = system.participator[i].name;
		document.getElementsByClassName("participator-state")[i].getElementsByClassName("participator-score")[0].innerText = system.participator[i].score;
	}
}
function menuToggle() {
	document.body.classList.toggle("menu-hidden");
	system.ui.menuHidden = system.ui.menuHidden ? false : true;
	localStorage.setItem("ui-menuHidden", system.ui.menuHidden);
	for (let window of document.getElementsByClassName("window")) {
		window.classList.remove("open");
	}
	for (let button of document.getElementsByTagName("button")) {
		if (button.classList.contains("active")) {
			button.classList.remove("active");
		}
	}
}