'use strict';

var React = require('react-native');
var {
  Modal,
  StyleSheet,
  Text,
  View,
  ToastAndroid
} = React;
import { Button } from 'react-native-material-design';



class ModalInstall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: props.animated || false,
      visible: props.visible || false,
      transparent: props.transparent || true
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      animated: props.animated || false,
      visible: props.visible || false,
      transparent: props.transparent || true
    })
  }

  _setModalVisible(visible) {
    this.setState({visible: visible});
  }

  _toggleAnimated() {
    this.setState({animated: !this.state.animated});
  }

  _toggleTransparent() {
    this.setState({transparent: !this.state.transparent});
  }

  _onInstall() {
    this._setModalVisible(false);
    ToastAndroid.show('Installing...', ToastAndroid.SHORT)
    setTimeout(() => {
      if(this.props.onInstall) {
        this.props.onInstall()
      };
    }, 1000);
  }

  render() {
    var modalBackgroundStyle = { backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff' };
    var innerContainerTransparentStyle = this.state.transparent ? {backgroundColor: '#fff', padding: 20} : null;

    return (
      <View>
        <Modal
          animated={this.state.animated}
          transparent={this.state.transparent}
          visible={this.state.visible}
          onRequestClose={this._setModalVisible.bind(this, false)} >
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Text>{this.props.message}</Text>
              <View style={styles.row}>
                <Button text="Cancel" onPress={this._setModalVisible.bind(this, false)} />
                <Button text="Install" onPress={this._onInstall.bind(this)} />
            </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center'
  },
  row: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
  }
});

module.exports = ModalInstall;
