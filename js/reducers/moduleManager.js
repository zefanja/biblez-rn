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

import {
  SET_USER_DISCLAIMER_CONFIRMED,
  SYNC,
  SET_REPOS,
  SET_REMOTE_MODULES,
  SET_INSTALLED_MODULE,
  REMOVE_MODULE,
  SET_VISIBILITY_FILTER,
  VisibilityFilters }
from './../actions/moduleManager'

function moduleManager(state = {synced: false, userDisclaimerConfirmed: false, repos: [], localModules: [], remoteModules: {}, currentRepo: {}}, action) {
  switch (action.type) {
    case 'SET_USER_DISCLAIMER_CONFIRMED':
      return { ...state, userDisclaimerConfirmed: true };
    case 'SYNC':
      return { ...state, synced: true };
    case 'SET_REPOS':
      return { ...state, repos: action.repoNames };
    case 'SET_CURRENT_REPO':
      return { ...state, currentRepo: {repoName: action.repoName, index: action.index }};
    case 'SET_REMOTE_MODULES':
      return { ...state, remoteModules: {modules: action.remoteModules, repo: action.repoName} };
    case 'SET_INSTALLED_MODULE':
      return { ...state, localModules: action.localModules };
    default:
      return state
  }
}

module.exports = moduleManager;