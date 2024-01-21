var ipc = require("electron").ipcRenderer;
var startImSwitch = document.getElementById("startImSwitch");
var indir = document.getElementById("indir");
var outdir = document.getElementById("outdir");
var loadbar = document.getElementById("loadbar");
var loadmessage = document.getElementById("loadmessage");
var back = document.getElementById("back");
var whole = document.getElementById("whole");
var half = document.getElementById("half");
var spacing = document.getElementById("spacing");
var legacy = document.getElementById("legacy");
var alignmentMethod = "True";
var useLegacy = "False";
var methods = document.querySelector("#methods");



startImSwitch.addEventListener("click", function () {
		/*
		if (legacy.checked) {
			useLegacy = "True";
		} else {
			useLegacy = "False";
		}
		*/
		startImSwitch.classList.add("disabled");
		back.classList.remove("btn-warning");
		back.classList.add("btn-danger");
		back.innerHTML = "Cancel";
		startImSwitch.innerHTML = "<i class='fas fa-spinner fa-spin'></i>";
		loadmessage.innerHTML = "Intializing...";
		ipc.send("startImSwitch");
	
});

back.addEventListener("click", function (event) {
	if (back.classList.contains("btn-danger")) {
		event.preventDefault();
		ipc.send("killAlign", []);
		back.classList.add("btn-warning");
		back.classList.remove("btn-danger");
		back.innerHTML = "Back";
		startImSwitch.innerHTML = "startImSwitch";
		startImSwitch.classList.remove("disabled");
		loadmessage.innerHTML = "";
		loadbar.style.width = "0";
	}
});

ipc.on("alignResult", function (event, response) {
	startImSwitch.innerHTML = "startImSwitch";
	startImSwitch.classList.remove("disabled");
	back.classList.add("btn-warning");
	back.classList.remove("btn-danger");
	back.innerHTML = "Back";
	startImSwitch.innerHTML = "startImSwitch";
	startImSwitch.classList.remove("disabled");
	loadmessage.innerHTML = "";
	loadbar.style.width = "0";
});

ipc.once("alignError", function (event, response) {
	startImSwitch.innerHTML = "startImSwitch";
	startImSwitch.classList.remove("disabled");
});

ipc.on("updateLoad", function (event, response) {
	loadbar.style.width = String(response[0]) + "%";
	loadmessage.innerHTML = response[1];
});

/*
indir.addEventListener("click", function () {
	ipc.once("returnPath", function (event, response) {
		if (response[1] == "indir") {
			indir.value = response[0];
		}
	});
	ipc.send("openDialog", "indir");
});

outdir.addEventListener("click", function () {
	ipc.once("returnPath", function (event, response) {
		if (response[1] == "outdir") {
			outdir.value = response[0];
		}
	});
	ipc.send("openDialog", "outdir");
});
*/
