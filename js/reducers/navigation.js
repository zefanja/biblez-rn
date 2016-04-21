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

import { SWITCH_SCENE } from './../actions/moduleManager'

type Scene = 'welcome' | 'moduleManager' | 'main' | 'settings' | 'info';

function navigation(state = { scene: 'welcome' }, action) {
  switch (action.type) {
    case 'SWITCH_SCENE':
      return { ...state, scene: action.scene };
    default:
      return state
  }
}

module.exports = navigation;