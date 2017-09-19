/**
 * OpenEyes
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
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Chandelier (single)
 *
 * @class ChandelierSingle
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.ChandelierSingle = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "ChandelierSingle";

	// Private parameters
	this.parsPlana = -560;

	// Saved parameters
	this.savedParameterArray = ['rotation'];

	// Call superclass constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.ChandelierSingle.prototype = new ED.Doodle;
ED.ChandelierSingle.prototype.constructor = ED.ChandelierSingle;
ED.ChandelierSingle.superclass = ED.Doodle.prototype;

/**
 * Sets default dragging attributes
 */
ED.ChandelierSingle.prototype.setPropertyDefaults = function() {
	this.isScaleable = false;
	this.isMoveable = false;
}

/**
 * Sets default parameters
 */
ED.ChandelierSingle.prototype.setParameterDefaults = function() {
	this.setRotationWithDisplacements(180, 90);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.ChandelierSingle.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.ChandelierSingle.superclass.draw.call(this, _point);

	// Boundary path
	ctx.beginPath();

	// Port
	ctx.rect(-60, this.parsPlana - 60, 120, 160);

	// Set line attributes
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";

	ctx.fillStyle = "rgba(0, 0, 0, 0)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary paths
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
		// Trocar
		ctx.beginPath();
		ctx.moveTo(-20, this.parsPlana + 60);
		ctx.lineTo(+20, this.parsPlana + 60);
		ctx.lineTo(+20, this.parsPlana + 120);
		ctx.lineTo(0, this.parsPlana + 140);
		ctx.lineTo(-20, this.parsPlana + 120);
		ctx.lineTo(-20, this.parsPlana + 60);
		ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
		ctx.fill();

		// Body
		ctx.beginPath();
		ctx.rect(-60, this.parsPlana, 120, 60);
		ctx.fillStyle = "rgba(120, 120, 120, 1)";
		ctx.fill();

		// Fibre optic
		ctx.beginPath();
		ctx.moveTo(0, this.parsPlana);
		ctx.bezierCurveTo(0, this.parsPlana - 50, 50, this.parsPlana - 100, 100, this.parsPlana - 100);
		ctx.lineWidth = 40;
		ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
		ctx.stroke();
	}

	// Return value indicating successful hittest
	return this.isClicked;
}

/**
 * Returns a String which, if not empty, determines the root descriptions of multiple instances of the doodle
 *
 * @returns {String} Group description
 */
ED.ChandelierSingle.prototype.groupDescription = function() {
	return "Chandelier at ";
}

/**
 * Returns a string containing a text description of the doodle
 *
 * @returns {String} Description of doodle
 */
ED.ChandelierSingle.prototype.description = function() {
	// Location (clockhours)
	return this.clockHour() + " o'clock";
}
