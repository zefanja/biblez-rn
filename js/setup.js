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

import React from 'react';
import {Provider} from 'react-redux';
var configureStore = require('./store/configureStore');
var BibleZApp = require('./BibleZApp');

function setup(): React.Component {
  class Root extends React.Component {
    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(() => this.setState({isLoading: false}))
      }
    }

    render() {
      if (this.state.isLoading) {
        return null;
      }
      //console.log("STORE:", this.state.store.getState());
      return (
        <Provider store={this.state.store}>
          <BibleZApp />
        </Provider>
      );
    }
  }
  return Root;
}

module.exports = setup;
