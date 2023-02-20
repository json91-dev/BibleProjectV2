import React, {useCallback, useEffect, useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';

import {StyleSheet, View, Text} from 'react-native';

import {getFireStore} from '../../../utils';
import LoadingSpinner from '../../components/LoadingSpinner';

const renderHeader = (section, index) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTextLabel}>{index + 1}. </Text>
      <Text style={styles.headerText}>{section.title} </Text>
      <View style={styles.headerDateContainer}>
        <Text style={styles.headerDate}>{section.dateString}</Text>
      </View>
    </View>
  );
};

const renderContent = section => {
  return (
    <View style={styles.content}>
      <Text>{section.content}</Text>
    </View>
  );
};

const NoticeScreen = () => {
  const [notificationDataArray, setNotificationDataArray] = useState([]);
  const [activeSections, setActiveSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const zeroSet = useCallback(i => {
    return (i < 10 ? '0' : '') + i;
  }, []);

  const getDateString = useCallback(timestamp => {
    const date = timestamp.toDate();
    const year = date.getFullYear();
    const month = zeroSet(date.getMonth() + 1);
    const day = zeroSet(date.getDate());

    return `${year}.${month}.${day}`;
  }, []);

  const updateSections = useCallback(activeSections => {
    setActiveSections(activeSections);
  }, []);

  const initNotification = useCallback(async () => {
    const snapshot = await getFireStore().collection('notification').get();
    const notificationDataArray = [];

    snapshot.docs.forEach(doc => {
      const timestamp = doc.data().timestamp;
      const dateString = getDateString(timestamp);
      const title = doc.data().title;
      const content = doc.data().content;

      notificationDataArray.push({
        dateString,
        title,
        content,
      });
    });

    setNotificationDataArray(notificationDataArray);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initNotification().then();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <Accordion
        containerStyle={{backgroundColor: 'white', height: '100%'}}
        sections={notificationDataArray}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
        underlayColor="yellow"
      />
    );
  }
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  appVersionImage: {
    resizeMode: 'contain',
    width: '60%',
    marginBottom: '15%',
  },

  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: '#EDEDED',
    paddingLeft: 20,
    paddingRight: 20,
  },

  headerText: {
    width: '69%',
  },

  headerTextLabel: {
    width: '5%',
  },

  headerDateContainer: {
    width: '20%',
  },

  content: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
});
