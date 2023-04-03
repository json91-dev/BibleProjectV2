import React from 'react';
import {BannerAd, TestIds, BannerAdSize} from '@react-native-firebase/admob';

const AdmobBannerBottom = () => (
  <BannerAd
    requestOptions={{
      requestNonPersonalizedAdsOnly: true,
    }}
    onAdLoaded={function () {
      console.log('Advert loaded');
    }}
    onAdFailToLoad={error => console.log(error)}
    size={BannerAdSize.FULL_BANNER}
    unitId={TestIds.BANNER}
  />
);

export default AdmobBannerBottom;
