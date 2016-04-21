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

var React = require('React');
import {View, Text, ListView, ScrollView, TouchableHighlight, TouchableNativeFeedback} from "react-native";
var Dimensions = require('Dimensions');
var { connect } = require('react-redux');
var { setUserDisclaimerConfirmed, sync, setRepos, setCurrentRepo ,setRemoteModules} = require('./../actions/moduleManager');
var StyleSheet = require('StyleSheet');
import { Button, Toolbar } from 'react-native-material-design';

var Dropdown = require('react-native-dropdown-android');
var mSwordZ = require('NativeModules').SwordZ;

class ModuleManagerScreen extends React.Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.moduleManager.remoteModules.modules)
    };
  }

  componentDidMount() {
    mSwordZ.SWMgr_reInit();
    if(!this.props.moduleManager.userDisclaimerConfirmed) {
      //TODO Show modal with disclaimer
      console.log("SHOW DISCLAIMER");
      mSwordZ.InstallMgr_setUserDisclaimerConfirmed();
      this.onUserDisclaimerConfirmed();
      mSwordZ.InstallMgr_syncConfig(this.onSync.bind(this));
    } else {
      mSwordZ.SWMgr_getModInfoList((modules) => {
        console.log("MODULES: ", modules);
      });
      mSwordZ.InstallMgr_getRemoteSources(this.onSetRepos.bind(this));
    }
  }

  onUserDisclaimerConfirmed() {
    this.props.onUserDisclaimerConfirmed();
  }

  onSync() {
    this.props.onSync();
  }

  onSetRepos(repoNames) {
    console.log(repoNames)
    this.props.onSetRepos(JSON.parse(repoNames));
  }

  onRepoChanged(data) {
    this.props.onSetCurrentRepo(data.value, data.selected);
    mSwordZ.InstallMgr_refreshRemoteSource(data.value, (int) => {
      console.log(int);
      //TODO: Handle Error !== 0
      mSwordZ.InstallMgr_getRemoteModInfoList(data.value, this.onSetRemoteModules.bind(this, data.value));
    })
  }

  onSetRemoteModules(repoName, modules) {
    console.log("REMOTE MODULES:", modules, repoName);
    this.props.onSetRemoteModules(repoName, JSON.parse(modules));
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar
          title="Module Manager"
          icon = "menu"
          actions={[{
              icon: 'more-vert',
              /*onPress: this.increment*/
          }]}
          rightIconStyle={{
              margin: 10
          }}
        />
        <View style={styles.listContainer}>
          <Dropdown
            style={{ height: 30, flex: 1, flexDirection: "row"}}
            values={this.props.moduleManager.repos}
            selected={this.props.moduleManager.currentRepo.index || 1} onChange={this.onRepoChanged.bind(this)}
          />
          <ScrollView style={styles.scrollView}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
              <TouchableNativeFeedback>
                <View style={styles.itemContainer}>
                  <View style={styles.listItem}>
                    <Text>{rowData.name}</Text>
                    <Text>{rowData.description}</Text>
                  </View>
                </View>
              </TouchableNativeFeedback>
              }
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  listContainer: {
    marginTop: 56
  },
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 56
  },
  scrollView: {
    height: Dimensions.get("window").height - 112
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#eeeeee'
  },
  listItem: {
    margin: 10,
  }
});

function select(store) {
  return {
    moduleManager: store.moduleManager
  };
}

function actions(dispatch) {
  return {
    onUserDisclaimerConfirmed: () => dispatch(setUserDisclaimerConfirmed()),
    onSync: () => dispatch(sync()),
    onSetRepos: (repoNames) => dispatch(setRepos(repoNames)),
    onSetCurrentRepo: (repoName, index) => dispatch(setCurrentRepo(repoName, index)),
    onSetRemoteModules: (repoName, modules) => dispatch(setRemoteModules(repoName, modules))
  };
}

module.exports = connect(select, actions)(ModuleManagerScreen);

