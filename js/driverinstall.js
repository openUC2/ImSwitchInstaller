var ipc = require("electron").ipcRenderer;
var downloadHIK = document.getElementById("downloadHIK");
var downloadDaheng = document.getElementById("downloadDaheng");

downloadHIK.addEventListener("click", function () {
    downloadHIK.classList.add("disabled");
    downloadHIK.innerHTML = "<i class='fas fa-spinner fa-spin'></i>";
    downloadHIK.innerHTML = "Opening default Browser for downloading the file... Please install manually once the file is downloaded.";
    ipc.send("downloadHIK");
	
});

downloadDaheng.addEventListener("click", function () {
    downloadDaheng.classList.add("disabled");
    downloadDaheng.innerHTML = "<i class='fas fa-spinner fa-spin'></i>";
    downloadDaheng.innerHTML = "Opening default Browser for downloading the file... Please install manually once the file is downloaded.";
    ipc.send("downloadDaheng");
});


