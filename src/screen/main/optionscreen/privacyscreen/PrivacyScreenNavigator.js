import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

import TermScreen from './TermScreen';
import PrivacyScreen from './PrivacyScreen';

function PrivacyScreenNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <Tab.Screen name="TermScreen" component={TermScreen} />
    </Tab.Navigator>
  );
}

export default PrivacyScreenNavigator;
