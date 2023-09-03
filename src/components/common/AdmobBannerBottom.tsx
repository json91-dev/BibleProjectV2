import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const AdmobBannerBottom = () => {
  const bannerId = __DEV__ ? TestIds.BANNER : Platform.OS === 'android' ? '' : '';
  return (
    <BannerAd
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdLoaded={function () {
        console.log('Advert loaded');
      }}
      size={BannerAdSize.FULL_BANNER}
      unitId={bannerId}
    />
  );
};

export default AdmobBannerBottom;
