/**
 *
 * BibleZ is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BibleZ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

"use strict";

/**
 * action types
 */
export const SET_PASSAGE = "SET_PASSAGE";

/**
 * action creators
 */
function setPassage(passage) {
  return { type: SET_PASSAGE, passage }
}


module.exports = { setPassage };

