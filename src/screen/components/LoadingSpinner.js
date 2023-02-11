import React, {Component} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

export default class LoadingSpinner extends Component {
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
  }

  startAnimation() {
    // animation을 위한 interpolate
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 360, // 애니매이션의 100%일때의 값을 추출
      duration: 1000, // 애니메이션이 진행되는 시간
      // easing: Easing.linear // 애니메이션의 easing (매핑되는 패턴을 나타냄)
    }).start(() => this.startAnimation());
  }

  componentDidMount() {
    this.startAnimation();
  }

  render() {
    // 하나의 애니메이션에 매핑 되는 다른 값들의 변화를 나타냄
    // 예를들어 위에서 1초에 0-360도가 될때 deg도 0=> 360도가 되는 것을 지정함
    const RotateData = this.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.Image
          style={{
            transform: [{rotate: RotateData}],
            width: 50,
            height: 50,
          }}
          source={{
            uri: 'https://res.cloudinary.com/df9jsefb9/image/upload/c_scale,h_84,q_auto/v1501869525/assets/idc-loading-t_3x.png',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  spinnerImage: {
    width: 50,
    height: 50,
  },
});
