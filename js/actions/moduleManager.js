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
export const SET_USER_DISCLAIMER_CONFIRMED = "SET_USER_DISCLAIMER_CONFIRMED";
export const SYNC = "SYNC";
export const SET_REPOS = "SET_REPOS";
export const SET_REMOTE_MODULES = "SET_REMOTE_MODULES";
export const SET_INSTALLED_MODULE = "SET_INSTALLED_MODULE";
export const SET_CURRENT_REPO = "SET_CURRENT_REPO";
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * other constants
 */
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_INSTALLED: 'SHOW_INSTALLED'
}

/**
 * action creators
 */
export function setUserDisclaimerConfirmed() {
  return { type: SET_USER_DISCLAIMER_CONFIRMED }
}

export function sync() {
  return { type: SYNC }
}

export function setRepos(repoNames) {
  return { type: SET_REPOS, repoNames}
}

export function setCurrentRepo(repoName, index) {
  return { type: SET_CURRENT_REPO, repoName, index}
}

export function setRemoteModules(repoName, remoteModules) {
  return { type: SET_REMOTE_MODULES, repoName, remoteModules}
}

export function setInstalledModule(localModules) {
  return { type: SET_INSTALLED_MODULE, localModules }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}

