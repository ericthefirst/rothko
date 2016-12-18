function logMouseCoords(event) {
	console.log(event.clientX + ", " + event.clientY);
	document.getElementById("mouseCoords").innerHTML = "(" + event.clientX + ", " + event.clientY + ")";
}
function logKeyPress(event) {
	console.log(event.keyCode);
	document.getElementById("lastKey").innerHTML = event.keyCode;
}
