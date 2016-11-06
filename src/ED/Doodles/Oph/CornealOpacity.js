/**
 * OpenEyes
 * MSC
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * TODO: infiltrate control point definitions 
 *
 * @class CornealOpacity
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.CornealOpacity = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "CornealOpacity";

	// Private parameters
	this.numberOfHandles = 4;
	this.initialRadius = 81;
	this.resetWidth = true;
	this.resetHeight = true;
	this.resetInfiltrate = true;
	this.yMidPoint = 0;

	this.bezierTimeIntervals = [0.0,0.125,0.25,0.375,0.50,0.625,0.75,0.875,1];
	this.minX = this.maxX = this.minY = this.maxY = '';
	
	// Other parameters
	this.height = Math.round(this.initialRadius * 2 / 54);
	this.width = Math.round(this.initialRadius * 2 / 54);
	this.depth = 33;
	this.infiltrateWidth = 0;
	
	this.h = Math.round(this.initialRadius * 2 / 54);
	this.w = Math.round(this.initialRadius * 2 / 54);
	this.d = 33;
	this.iW = 0;

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'rotation', 'height', 'width', 'depth', 'infiltrateWidth','h','w','d','iW','yMidPoint'];
	
	// Parameters in doodle control bar
	this.controlParameterArray = {'height':'Height', 'width':'Width', 'depth':'Depth (%)', 'infiltrateWidth':'Infiltrate width'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.CornealOpacity.prototype = new ED.Doodle;
ED.CornealOpacity.prototype.constructor = ED.CornealOpacity;
ED.CornealOpacity.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.CornealOpacity.prototype.setHandles = function() {
	// Array of handles
	for (var i = 0; i < this.numberOfHandles; i++) {
		this.handleArray[i] = new ED.Doodle.Handle(null, true, ED.Mode.Handles, false);
	}

	// Allow top handle to rotate doodle
	/// ? Removed as need specific handles to be along X and Y axis - can change... **TODO**
// 	this.handleArray[0].isRotatable = true;
}

/**
 * Sets default properties
 */
ED.CornealOpacity.prototype.setPropertyDefaults = function() {
	// Create ranges to constrain handles
	this.handleVectorRangeArray = new Array();
	for (var i = 0; i < this.numberOfHandles; i++) {
		// Full circle in radians
		var cir = 2 * Math.PI;

		// Create a range object for each handle
		/// **TODO**: Ideally relative to canvas centre, not doodle - when update originX or originY
		var n = this.numberOfHandles;
		var range = new Object;
		range.length = new ED.Range(+50, +380);
		range.angle = new ED.Range((((2 * n - 1) * cir / (2 * n)) + i * cir / n) % cir, ((1 * cir / (2 * n)) + i * cir / n) % cir);
		this.handleVectorRangeArray[i] = range;
	}
	
	// Update component of validation array for simple parameters
	this.parameterValidationArray['originX']['range'].setMinAndMax(-350, +350);
	this.parameterValidationArray['originY']['range'].setMinAndMax(-350, +350);
	
	// Validation arrays for other parameters
	this.parameterValidationArray['height'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['width'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 14),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['depth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(1, 100),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['infiltrateWidth'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(0, 15),
		precision: 1,
		animate: false
	};
	this.parameterValidationArray['h'] = {
		kind: 'other',
		type: 'int',
		range: [1, 14],
		animate: false
	};
	this.parameterValidationArray['w'] = {
		kind: 'other',
		type: 'int',
		range: [1, 14],
		animate: false
	};this.parameterValidationArray['iW'] = {
		kind: 'other',
		type: 'int',
		range: [0, 15],
		animate: false
	};
	this.parameterValidationArray['d'] = {
		kind: 'other',
		type: 'int',
		range: [1, 100],
		animate: false
	};
	this.parameterValidationArray['resetWidth'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['resetHeight'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['resetInfiltrate'] = {
		kind: 'derived',
		type: 'bool',
		display: false
	};
	this.parameterValidationArray['yMidPoint'] = {
		kind: 'other',
		type: 'int',
		range: [-500, +500],
		animate: false
	};
	this.parameterValidationArray['yMPPos'] = {
		kind: 'other',
		type: 'int',
		range: new ED.Range(0,1),
		animate: false
	};
}

/**
 * Calculates values of dependent parameters. This function embodies the relationship between simple and derived parameters
 * The returned parameters are animated if their 'animate' property is set to true
 *
 * @param {String} _parameter Name of parameter that has changed
 * @value {Undefined} _value Value of parameter to calculate
 * @returns {Array} Associative array of values of dependent parameters
 */
ED.CornealOpacity.prototype.dependentParameterValues = function(_parameter, _value) {
	var returnArray = new Array();

	switch (_parameter) {
		case 'width':
			returnArray['resetWidth'] = true;
			returnArray['w'] = parseInt(_value);
			break;

		case 'height':
			returnArray['resetHeight'] = true;
			returnArray['h'] = parseInt(_value);
			break;
			
		case 'infiltrateWidth':
			returnArray['resetInfiltrate'] = true;
			returnArray['iW'] = parseInt(_value);
			break;
		
		case 'depth':
			returnArray['d'] = parseInt(_value);
			break;
			
		case 'h':
			returnArray['h'] = _value;
			break;
		
		case 'd':
			returnArray['depth'] = _value;
			break;
			
		case 'w':
			returnArray['w'] = _value;
			break;
		
		case 'iW':
			returnArray['infiltrateWidth'] = _value;
			break;
		
		case 'yMidPoint':
			returnArray['yMidPoint'] = _value;
			break;
			
		case 'handles':
			returnArray['w'] = this.calculateWidth();
			returnArray['h'] = this.calculateHeight();
			returnArray['yMidPoint'] = this.calculateYMidPoint();
			break;
	}

	return returnArray;
}

/**
 * Sets default parameters
 */
ED.CornealOpacity.prototype.setParameterDefaults = function() {
	var doodle = this.drawing.lastDoodleOfClass(this.className);
	if (doodle) {
		var np = new ED.Point(doodle.originX + 100, 1);
		this.move(np.x, np.y);
	} else {
		this.move(100, 1);
	}

	// Create a squiggle to store the handles points
	var squiggle = new ED.Squiggle(this, new ED.Colour(100, 100, 100, 1), 4, true);

	// Add it to squiggle array
	this.squiggleArray.push(squiggle);

	// Populate with handles at equidistant points around circumference
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}
	for (var i = 0; i < this.numberOfHandles; i++) {
		var point = new ED.Point(0, 0);
		point.setWithPolars(this.initialRadius, i * 2 * Math.PI / this.numberOfHandles);
		this.addPointToSquiggle(point);
	}
};

// Angle of control point from radius line to point (this value makes path a circle Math.PI/12 for 8 points
ED.CornealOpacity.prototype.getPhi = function()
{
	return 2 * Math.PI / (3 * this.numberOfHandles);
};

ED.CornealOpacity.prototype.calculateWidth = function()
{
	/// solve bezier to find min and max point along axis
	var maxX = '';
	var minX = '';

	var phi = this.getPhi();

	var squiggle = this.squiggleArray[0];
	for (var i=0; i<this.numberOfHandles; i++) {
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];
		var x1 = fp.x;
		var x2 = fp.tangentialControlPoint(+phi).x;
		var x3 = tp.tangentialControlPoint(-phi).x;
		var x4 = tp.x;

		for (var j=0; j<this.bezierTimeIntervals.length; j++) {
			var t = this.bezierTimeIntervals[j];
			var x = (1-t)*(1-t)*(1-t)*x1 + 3*(1-t)*(1-t)*t*x2 + 3*(1-t)*t*t*x3 + t*t*t*x4;
			if (maxX == '' || x > maxX) {
				maxX = x;
			}
			if (minX == '' || x < minX) {
				minX = x;
			}
		}
	}
	this.maxX = maxX;
	this.minX = minX;
	return Math.round((maxX - minX) / 54);
};

ED.CornealOpacity.prototype.calculateHeight = function()
{
	// recalculate height/// solve bezier to find min and max point along axis
	var phi = this.getPhi();
	var minY = '';
	var maxY = '';

	var squiggle = this.squiggleArray[0];
	for (var i=0; i<this.numberOfHandles; i++) {
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];
		var y1 = fp.y;
		var y2 = fp.tangentialControlPoint(+phi).y;
		var y3 = tp.tangentialControlPoint(-phi).y;
		var y4 = tp.y;

		for (var j=0; j<this.bezierTimeIntervals.length; j++) {
			var t = this.bezierTimeIntervals[j];
			var y = (1-t)*(1-t)*(1-t)*y1 + 3*(1-t)*(1-t)*t*y2 + 3*(1-t)*t*t*y3 + t*t*t*y4;
			if (maxY == '' || y > maxY) {
				maxY = y;
			}
			if (minY == '' || y < minY) {
				minY = y;
			}
		}
	}

	this.maxY = maxY;
	this.minY = minY;
	return Math.round((maxY - minY) / 54);
};

ED.CornealOpacity.prototype.calculateYMidPoint = function() {
	return this.minY + 0.5 * this.height * 54;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.CornealOpacity.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.CornealOpacity.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Bezier points
	var fp;
	var tp;
	var cp1;
	var cp2;

	var phi = this.getPhi();
	
	// If inputted a dimension, reset pointsArray,
	// otherwise recalculate dimension
	if (this.resetWidth) {
		this.squiggleArray[0].pointsArray[1].x = 0.5 * this.width * 54;
		this.squiggleArray[0].pointsArray[3].x = 0.5 * this.width * -54;

		this.resetWidth = false;
	}
	else {
		this.width = this.calculateWidth();
	}
	
	if (this.resetHeight) {
		this.squiggleArray[0].pointsArray[0].y = 0.5 * this.height * -54;
		this.squiggleArray[0].pointsArray[2].y = 0.5 * this.height * 54;

		this.resetHeight = false;
		this.minY = this.squiggleArray[0].pointsArray[0].y;
		this.maxY = this.squiggleArray[0].pointsArray[2].y;
		
		this.yMidPoint = this.calculateYMidPoint();
	}
	else {
		this.height = this.calculateHeight();
	}
	
	
	// Start curve
	ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);

	// Complete curve segments
	for (var i = 0; i < this.numberOfHandles; i++) {
		// From and to points
		fp = this.squiggleArray[0].pointsArray[i];
		var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
		tp = this.squiggleArray[0].pointsArray[toIndex];

		// Control points
		cp1 = fp.tangentialControlPoint(+phi);
		cp2 = tp.tangentialControlPoint(-phi);
		
		// Draw Bezier curve
		ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
	}

	// Close path
	ctx.closePath();

	// Set attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "gray";
	ctx.strokeStyle = "gray";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);
	
	// Coordinates of expert handles (in canvas plane)
	for (var i = 0; i < this.numberOfHandles /* * 2 */; i++) {
		this.handleArray[i].location = this.transform.transformPoint(this.squiggleArray[0].pointsArray[i]);
	}
			

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		
		// Infiltrate
		if (this.infiltrateWidth > 0) {
			// Convert infiltrate width to doodle scale
			var iW = this.infiltrateWidth * 54;
			var n = this.numberOfHandles;
			
			var infiltratePoints = [];

			// If do not exist, create extra handles for infiltrate boundary
// 			if (this.resetInfiltrate) {
				// redefine infiltrate control points based on width
				this.resetInfiltrate = false;
				for (var i=0; i<this.numberOfHandles; i++) {
					var handle = this.squiggleArray[0].pointsArray[i];
					var x = Math.abs(handle.x);
					var y = Math.abs(handle.y);
					
					// Length of new handle from origin
					var h = Math.sqrt(x*x + y*y) + iW;
					
					// Angle of handle from origin
					var theta = Math.atan(y/x);
					
					// Height of new point above origin
					var o = h * Math.sin(theta);
					// X displacement of new point from origin
					var a = h * Math.cos(theta);
					
					// get sign of handle coordinates
					var xS = (handle.x>=0) ? 1 : -1;
					var yS = (handle.y>=0) ? 1 : -1;
					
					var p = new ED.Point(a * xS, o * yS);
					infiltratePoints.push(p);
					
					this.squiggleArray[0].pointsArray[n+i] = p;				
				}
// 			}
			
			// Draw infiltrate
			ctx.beginPath();
			ctx.moveTo(this.squiggleArray[0].pointsArray[4].x, this.squiggleArray[0].pointsArray[4].y);
			// Complete curve segments
			for (var j=0; j< this.numberOfHandles; j++) {
				// From and to points
				fp = this.squiggleArray[0].pointsArray[j + n];
				var toIndex = (j < this.numberOfHandles - 1) ? j + 1 + n : this.numberOfHandles;
				tp = this.squiggleArray[0].pointsArray[toIndex];
		
				// Control points
				cp1 = fp.tangentialControlPoint(+phi);
				cp2 = tp.tangentialControlPoint(-phi);
		
				// Draw Bezier curve
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
			}
			ctx.fillStyle = "rgba(0,0,0,0.2)";
			ctx.fill();
			
			// Flood fill shape on ontop of gradient
			ctx.beginPath();
			ctx.moveTo(this.squiggleArray[0].pointsArray[0].x, this.squiggleArray[0].pointsArray[0].y);
			// Complete curve segments
			for (var i = 0; i < this.numberOfHandles; i++) {
				// From and to points
				fp = this.squiggleArray[0].pointsArray[i];
				var toIndex = (i < this.numberOfHandles - 1) ? i + 1 : 0;
				tp = this.squiggleArray[0].pointsArray[toIndex];
		
				// Control points
				cp1 = fp.tangentialControlPoint(+phi);
				cp2 = tp.tangentialControlPoint(-phi);
		
				// Draw Bezier curve
				ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, tp.x, tp.y);
			}
			ctx.fillStyle = "gray";
			ctx.stroke();
			ctx.fill();
		}
	}
	
	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.CornealOpacity.prototype.description = function() {
	return 'Corneal opacity';
}
