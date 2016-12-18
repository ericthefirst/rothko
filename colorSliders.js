/* colorSliders.js 
		dedicated to Dani, just like me */

var useConsole = true;

// Debugging / interaction
function quickConsole(str) {																							// CHECK
	if(useConsole)
		document.getElementById("console").innerHTML=str;
}

function advanceHint() {
	var console = document.getElementById("console");
	if(hint_no < hints.length-1) {
		hint_no += 1;
		showHint();
	} else {
		removeConsole();
	}
}

function removeConsole() {
	var console = document.getElementById("console");
	if(console)
		console.parentNode.removeChild(console);
}

// size the sandbox to the size of the screen
var sandbox = document.getElementById("sandbox");
sandbox.width = window.innerWidth;
sandbox.height = window.innerHeight;

// change window size and eliminate quickConsole text
if(!useConsole) {
	sandbox.height = window.innerHeight-160;
	document.getElementById("quickConsole").innerHTML="";
}

// Debugging 
var test = function() {
	var ctx = document.getElementById("sandbox").getContext("2d");
	ctx.fillStyle ="#FF8800";
	ctx.fillRect(100, 100, 100, 100);
};


var ctx = document.getElementById("sandbox").getContext("2d");
var mouseX, mouseY;
var touchX, touchY;
var mouseDown = false;


// Decide which way to orient the buttons
var landscape = sandbox.width > sandbox.height;
// quickConsole("landscape: " + landscape);

var bgDim= landscape ? [ 0, 0, sandbox.width/2, sandbox.height ]
										 : [ 0, 0, sandbox.width, sandbox.height/2];
var cpDim = landscape ? [ sandbox.width/2, 0, sandbox.width/2, sandbox.height ]
											: [ 0, sandbox.height/2, sandbox.width, sandbox.height/2 ];
var fgDim = [ bgDim[2]/4, bgDim[3]/4, bgDim[2]/2, bgDim[3]/2];



function within(mx, my, rect) {
	var x = rect[0];
	var y = rect[1];
	var w = rect[2];
	var h = rect[3];
	return mx >= x && mx <= x+w && my >= y && my <= y+h;
}


/*********************
		 		COLOR 
**********************/
var fgColor = "#00FF00";
var bgColor = "#0000FF";
var cpColor = "#000000"; 

var changingFG = true;

function rgb(red, green, blue) {
	return "#" + toHex(red) + toHex(green) + toHex(blue);
}

var hex = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];
function toHex(i) {
	return hex[Math.floor(i/16)] + hex[i%16];
}

var xeh = { '0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15 };

var fromHex = function (str) {
	total = 0;
	for(i = 0; i < 2; i++) {
		total *= 16;
		total += xeh[str[i]];
	}
	return total;
}


var initColorVals = [ 0, 255, 0 ];

var displayColors = true;
var displayHex = true;


/******************************
			Sliders
******************************/
var sliderColors = [ "#C00000", "#008000", "#0000FF" ];
var sliderOutlineColor = "#808080";
var sliderSelectColor = "#FFFFFF";

var sliderDims = [ 80, 30 ];
var sliderMargin = cpDim[3]/4;
var sliderTolerance = 30;

var colorSliders = [];
// Create the buttons
for(i = 0; i < 3 ;  i++) {
	colorSliders.push(new ColorSlider(cpDim[0] + (i+1)*cpDim[2]/4, cpDim[1] + sliderMargin, cpDim[1]+cpDim[3]-sliderMargin, sliderColors[i], initColorVals[i]));
}

function nearSlider(mouseX, mouseY) {
	for(var i = 0; i < 3; i++) {
		if(colorSliders[i].near(mouseX, mouseY))
			return i;
	}
	return false;
}

function ColorSlider(x, yTop, yBot, c, val) {
	this.x = x;
	this.yTop = yTop;
	this.yBot = yBot;
	var y;
	this.c = c;
	this.val = val;
	y = yBot+(yTop-yBot)*val/255;
	var selected = false;

	this.setY = function(newY) {
		y = newY;
		if(y < yTop)	
			y = yTop;
		else if(y > yBot)
			y = yBot;
		val = Math.floor((y-yBot)/(yTop-yBot)*255);
	};

	this.getVal = function() {
		return val;
	}

	this.setVal = function(newVal) {
		val = newVal;
		y = yBot+(yTop-yBot)*val/255;
	}

	this.draw =  function(ctx) {
		ctx.lineWidth = 1;
		ctx.strokeStyle = sliderOutlineColor;
		ctx.beginPath();
		ctx.moveTo(x, yBot);
		ctx.lineTo(x, yTop);
		ctx.stroke();

		if(selected)
			ctx.strokeStyle = sliderSelectColor;
		ctx.lineWidth = 3;
		ctx.clearRect(x-sliderDims[0]/2, y-sliderDims[1]/2, sliderDims[0], sliderDims[1]);
		ctx.strokeRect(x-sliderDims[0]/2, y-sliderDims[1]/2, sliderDims[0], sliderDims[1]);
		ctx.fillStyle = c;
		ctx.fillRect(x-sliderDims[0]/2, y-sliderDims[1]/2, sliderDims[0], sliderDims[1]);

		if(displayColors) {
			ctx.fillStyle = "#AFAFAF";
			ctx.textAlign="center";
			ctx.textBaseline="top";
			ctx.font="24px Helvetica";
			if(displayHex)
				ctx.fillText(toHex(val), x, yBot + 24);
			else
				ctx.fillText(val, x, yBot + 24);
		}
	};

	this.near = function(mx, my) {
		return mx >= x - sliderDims[0]/2-  sliderTolerance
					 && mx <= x + sliderDims[0]/2 + sliderTolerance
					 && my >= y - sliderDims[1]/2 - sliderTolerance
					 && my <= y + sliderDims[1]/2 + sliderTolerance; 
	};

	this.select = function() { selected = true; };
	this.deselect = function() { selected = false; };

}

function setSliders(color) {
	var red = color.substring(1,3);
	var green = color.substring(3,5);
	var blue = color.substring(5,7);
	colorSliders[0].setVal(fromHex(red));
	colorSliders[1].setVal(fromHex(green));
	colorSliders[2].setVal(fromHex(blue));
	refresh();
}


/******************************
		DRAWING
******************************/

function refresh() {
	ctx.clearRect(0, 0, sandbox.width, sandbox.height);
	ctx.fillStyle = bgColor;
	ctx.fillRect(bgDim[0], bgDim[1], bgDim[2], bgDim[3]);
	ctx.fillStyle = fgColor;
	ctx.fillRect(fgDim[0], fgDim[1], fgDim[2], fgDim[3]);
	ctx.fillStyle = cpColor;
	ctx.fillRect(cpDim[0], cpDim[1], cpDim[2], cpDim[3]);
	for(i = 0; i < 3; i++) {
		colorSliders[i].draw(ctx);
	}
}

/*******************
	KEYBOARD INPUT
******************/
var handleKeyOnCanvas = function(event) {
	// console.log("Pressed key " + event.keyCode);
	lastKey = event.keyCode;
	if(lastKey === 13) {
		// restoreBackup();
		if(displayColors) {
			if(!displayHex)
				displayHex = true;
			else {
				displayHex = false;
				displayColors = false;	
			}
		} else
			displayColors = true;
		refresh();
	}
}

/********************
		TOUCH INPUT
********************/
function handleTouchStart(event) {
	event.preventDefault();	
	setTouchXY(event, sandbox);
	quickConsole(touchX + ", " + touchY);
	movingSlider = nearSlider(touchX, touchY);
	if(movingSlider !== false) {
		colorSliders[movingSlider].select();
		refresh();
	} else if (within(touchX, touchY, fgDim)) {
		changingFG = true;
		setSliders(fgColor);
	}
	else if (within(touchX, touchY, bgDim)) {
		console.log("switch to bg, right?");
		changingFG = false;
		advanceHint();
		setSliders(bgColor);
	}
}


function setTouchXY (event, cnvs) {
	var cnvsRect = cnvs.getBoundingClientRect();
	touchX = event.targetTouches[0].pageX - cnvsRect.left;
	touchY = event.targetTouches[0].pageY - cnvsRect.top;
}

function handleTouchMove(event) {
	if(movingSlider === false)
		return;
	setTouchXY(event, sandbox);
	quickConsole(touchX + ", " + touchY);
	handleSliderMovement(touchX, touchY);
}

function handleTouchEnd(event) {
	if(movingSlider !== false) {
		colorSliders[movingSlider].deselect();
		movingSlider = false;
		refresh();
	}
}
	
/******************************
		MOUSE INPUT
*******************************/

setMouseXY = function(event, cnvs) {
	var cnvsRect = cnvs.getBoundingClientRect();
	mouseX = event.clientX - cnvsRect.left;
	mouseY = event.clientY - cnvsRect.top;
}


handleMouseDown = function(event) {
	mouseDown = true;
	setMouseXY(event, sandbox);
	movingSlider = nearSlider(mouseX, mouseY);
	if(movingSlider !== false) {
		colorSliders[movingSlider].select();
		refresh();
	} else if (within(mouseX, mouseY, fgDim)) {
		changingFG = true;
		setSliders(fgColor);
	}
	else if (within(mouseX, mouseY, bgDim)) {
		console.log("switch to bg, right?");
		advanceHint();
		changingFG = false;
		setSliders(bgColor);
	}
}


function handleMouseMove(event) {
	if(!mouseDown || movingSlider === false)
		return;
	var slider = colorSliders[movingSlider];
	setMouseXY(event, sandbox);
	if(Math.abs(mouseX-slider.x) < sliderDims[0]+sliderTolerance
			&& mouseY >= slider.yTop - sliderTolerance 
			&& mouseY <= slider.yBot) {
		colorSliders[movingSlider].setY(mouseY); 
		if(changingFG)
			fgColor = rgb(colorSliders[0].getVal(), colorSliders[1].getVal(), colorSliders[2].getVal());
		else
			bgColor = rgb(colorSliders[0].getVal(), colorSliders[1].getVal(), colorSliders[2].getVal());
		refresh();
	}
}

function handleSliderMovement(inputX, inputY) {
	var slider = colorSliders[movingSlider];
	if(Math.abs(inputX-slider.x) < sliderDims[0]+sliderTolerance
			&& inputY >= slider.yTop - sliderTolerance 
			&& inputY <= slider.yBot) {
		colorSliders[movingSlider].setY(inputY); 
		if(changingFG)
			fgColor = rgb(colorSliders[0].getVal(), colorSliders[1].getVal(), colorSliders[2].getVal());
		else
			bgColor = rgb(colorSliders[0].getVal(), colorSliders[1].getVal(), colorSliders[2].getVal());
		refresh();
	}
}



function handleMouseUp(event) {
	mouseDown = false;
	if(movingSlider !== false) {
		colorSliders[movingSlider].deselect();
		movingSlider = false;
		refresh();
	}
}

refresh();
