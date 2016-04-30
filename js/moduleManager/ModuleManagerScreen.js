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
import {View, Text, ListView, ScrollView, TouchableNativeFeedback, ToastAndroid} from "react-native";
var Dimensions = require('Dimensions');
var ProgressBar = require('ProgressBarAndroid');
var { connect } = require('react-redux');
var { setUserDisclaimerConfirmed, sync, setRepos, setCurrentRepo ,setRemoteModules} = require('./../actions/moduleManager');
var StyleSheet = require('StyleSheet');
import { Button, Toolbar } from 'react-native-material-design';
var ModalInstall = require('./../common/ModalInstall');

var Dropdown = require('react-native-dropdown-android');
var mSwordZ = require('NativeModules').SwordZ;

class ModuleManagerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var result = this.props.moduleManager.remoteModules.modules || [];
    var listData = [];
    result.forEach((module) => {
      if(module.category === "Biblical Texts") {
        listData.push(module);
      }
    });
    console.log(listData);
    this.state = {
      dataSource: this.ds.cloneWithRows(listData || []),
      modalVisible: false,
      modalMessage: "",
      loadingRepo: false
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
      /*mSwordZ.SWMgr_getModInfoList((modules) => {
        console.log("MODULES: ", modules);
      });*/
      mSwordZ.InstallMgr_setUserDisclaimerConfirmed();
      if(this.props.moduleManager.repos.length === 0)
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
    this.setState({loadingRepo: true});
    setTimeout(() => {
      mSwordZ.InstallMgr_refreshRemoteSource(data.value, (int) => {
        console.log(int);
        //TODO: Handle Error !== 0
        mSwordZ.InstallMgr_getRemoteModInfoList(data.value, this.onSetRemoteModules.bind(this, data.value));
      })
    }, 100);
  }

  onSetRemoteModules(repoName, modules) {
    console.log("REMOTE MODULES:", modules, repoName);
    var result = JSON.parse(modules);
    var listData = [];
    result.forEach((module) => {
      if(module.category === "Biblical Texts") {
        listData.push(module);
      }
    });
    this.props.onSetRemoteModules(repoName, modules);

    this.setState({dataSource: this.ds.cloneWithRows(listData), loadingRepo: false});
  }

  _onInstall() {
    mSwordZ.InstallMgr_remoteInstallModule(
      this.props.moduleManager.currentRepo.repoName,
      this.state.modName,
      this._onRemoteInstall.bind(this, this.state.modName)
    )
  }

  _onRemoteInstall(modName, error) {
    console.log("_onRemoteInstall", error);
    if(error === 0)
      ToastAndroid.show('Installed ' + modName, ToastAndroid.LONG)
  }

  _onPressModuleInstall(rowId, modName, description) {
    this.setState({
      modalVisible: true,
      modalMessage: "Do you want to install \"" + description + "\" (" + modName + ")?",
      modName: modName
    });
  }

  _renderRow(rowData, sectionId, rowId) {
    return(
      <TouchableNativeFeedback onPress={this._onPressModuleInstall.bind(this, rowId, rowData.name, rowData.description)}>
        <View style={styles.itemContainer}>
          <View style={styles.listItem}>
            <Text>{rowData.name}</Text>
            <Text>{rowData.description}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    if(this.state.loadingRepo) {
      return (
        <View style={styles.container}>
          <Toolbar
            title="Module Manager"
            primary="paperBrown"
            icon = "menu"
            onIconPress = {() => this.props.openDrawer()}
            rightIconStyle={{
                margin: 10
            }}
          />
          <ProgressBar style={styles.progressbar} styleAttr="Large" />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Toolbar
          title="Module Manager"
          primary="paperBrown"
          icon = "menu"
          onIconPress = {() => this.props.openDrawer()}
          rightIconStyle={{
              margin: 10
          }}
        />
        <ModalInstall visible={this.state.modalVisible} message={this.state.modalMessage} onInstall={this._onInstall.bind(this)}/>
        <View style={styles.listContainer}>
          <Dropdown
            style={{ height: 30, flex: 1, flexDirection: "row"}}
            values={this.props.moduleManager.repos}
            selected={this.props.moduleManager.currentRepo.index || 1} onChange={this.onRepoChanged.bind(this)}
          />
          <ScrollView style={styles.scrollView}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
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
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#eeeeee'
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
  progressbar: {
    marginTop: 112
  },
  scrollView: {
    height: Dimensions.get("window").height - 112
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  listItem: {
    margin: 10,
  },
  installButton: {
    width: 100
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

