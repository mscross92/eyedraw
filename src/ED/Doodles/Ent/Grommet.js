/**
 * OpenEyes
 *
 * Copyright (C) OpenEyes Foundation, 2011-2017
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright 2011-2017, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0
 */

/**
 * Grommet
 *
 * @class Grommet
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.Grommet = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "Grommet";

	// Other parameters
	this.type = "Short term";

	// Saved parameters
	this.savedParameterArray = ['originX', 'originY', 'scaleX', 'scaleY', 'type'];

	// Parameters in doodle control bar (parameter name: parameter label)
	this.controlParameterArray = {'type':'Type'};

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.Grommet.prototype = new ED.Doodle;
ED.Grommet.prototype.constructor = ED.Grommet;
ED.Grommet.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.Grommet.prototype.setHandles = function() {
	//this.handleArray[2] = new ED.Doodle.Handle(null, true, ED.Mode.Scale, false);
}

/**
 * Sets default properties
 */
ED.Grommet.prototype.setPropertyDefaults = function() {
	// Add complete validation arrays for derived parameters
	this.parameterValidationArray['type'] = {
		kind: 'derived',
		type: 'string',
		list: ['Short term', 'Long term'],
		animate: true
	};
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.Grommet.prototype.setParameterDefaults = function() {
	// Displacement from fovea, and from last doodle
	var d = 100;
	this.originX = d;
	this.originY = d;
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.Grommet.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.Grommet.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Round hole
	ctx.arc(0, 0, 40, 0, Math.PI * 2, true);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 32;
	ctx.fillStyle = "rgba(255,255,255,0)";
	ctx.strokeStyle = "white";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {}

	// Coordinates of handles (in canvas plane)
	this.handleArray[2].location = this.transform.transformPoint(new ED.Point(21, -21));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Calculate arc (Arc property not used naturally in this doodle ***TODO** more elegant method of doing this possible!)
	var centre = this.transform.transformPoint(new ED.Point(0, 0));
	var oneWidthToRight = this.transform.transformPoint(new ED.Point(60, 0));
	var xco = centre.x - this.drawing.canvas.width / 2;
	var yco = centre.y - this.drawing.canvas.height / 2;
	var radius = this.scaleX * Math.sqrt(xco * xco + yco * yco);
	var width = this.scaleX * (oneWidthToRight.x - centre.x);
	this.arc = Math.atan(width / radius);
	//console.log(this.arc * 180/Math.PI + " + " + this.calculateArc() * 180/Math.PI);

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.Grommet.prototype.description = function() {
	return "Grommet";
}
