import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const LoadingSpinner = () => {
  const animationValue = useRef(new Animated.Value(0)).current;

  const startAnimation = useCallback(() => {
    Animated.loop(
      Animated.timing(animationValue, {
        toValue: 1, // 애니매이션의 100%일때의 값을 추출
        duration: 700, // 애니메이션이 진행되는 시간
        useNativeDriver: true,
      }),
    ).start();
  }, [animationValue]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  // inputRange : animationValue의 변화값
  // outputRange : 해당 변화값에 대한 매칭되는 deg 값
  const RotateData = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        style={{
          transform: [{ rotate: RotateData }],
          width: 50,
          height: 50,
        }}
        source={{
          uri: 'https://res.cloudinary.com/df9jsefb9/image/upload/c_scale,h_84,q_auto/v1501869525/assets/idc-loading-t_3x.png',
        }}
      />
    </View>
  );
};

export default LoadingSpinner;

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
