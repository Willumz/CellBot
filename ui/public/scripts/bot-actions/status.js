
function startBot() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            getRunLog();
            isRunning();
            document.getElementById("status-stop").disabled = false;
            document.getElementById("status-start").disabled = true;
        }
    };
    req.open("GET", "/bot/start", true);
    req.send();
}

function stopBot() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            getRunLog();
            isRunning();
            document.getElementById("status-stop").disabled = true;
            document.getElementById("status-start").disabled = false;
        }
    };
    req.open("GET", "/bot/stop", true);
    req.send();
}

function getRunLog() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("status-runlog").innerHTML = req.responseText.replace("\n", "<br>");
        }
    };
    req.open("GET", "/bot/runlog", true);
    req.send();
}

function isRunning() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("status-running").innerHTML = "<strong>Running: </strong>" + req.responseText;
        }
    };
    req.open("GET", "/bot/running", true);
    req.send();
}