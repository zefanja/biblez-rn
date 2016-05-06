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

import { SET_PASSAGE, SET_MODULES, SET_CURRENT_MODULE } from './../actions/main'

function main(state = { passage: 'Mat.1', modules: [] }, action) {
  switch (action.type) {
    case 'SET_PASSAGE':
      return { ...state, passage: action.passage };
    case 'SET_MODULES':
      return { ...state, modules: action.modules };
    case 'SET_CURRENT_MODULE':
      return { ...state, currentModule: action.module };
    default:
      return state
  }
}

module.exports = main;