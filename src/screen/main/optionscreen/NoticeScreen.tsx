import React, { useCallback, useEffect, useState } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import firestore from '@react-native-firebase/firestore';

const renderHeader = (section, index) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerNumberView}>
        <Text style={styles.headerNumberText}>{index + 1}. </Text>
      </View>
      <View style={styles.headerTextView}>
        <Text style={styles.headerText}>{section.title} </Text>
      </View>
      <View style={styles.headerDateView}>
        <Text style={styles.headerDate}>{section.dateString}</Text>
      </View>
    </View>
  );
};

const renderContent = section => {
  return (
    <View style={styles.content}>
      <Text style={styles.contentText}>{section.content}</Text>
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
    const snapshot = await firestore().collection('notification').get();
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
  }, [getDateString]);

  useEffect(() => {
    initNotification().then();
  }, [initNotification]);

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <Accordion
        containerStyle={styles.container}
        sections={notificationDataArray}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
        underlayColor="white"
      />
    );
  }
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    paddingTop: '5%',
    alignItems: 'center',
  },
  appVersionImage: {
    resizeMode: 'contain',
    width: '60%',
    marginBottom: '15%',
  },

  header: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    borderColor: '#EDEDED',
    width: '100%',
    alignItems: 'center',
    marginTop: '3%',
    marginBottom: '5%',
  },

  headerTextView: {
    width: '67%',
  },

  headerText: {
    color: 'black',
  },

  headerNumberView: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerNumberText: {},

  headerDateView: {
    marginRight: 10,
  },

  headerDate: {
    color: 'black',
  },

  content: {
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '15%',
    marginBottom: 20,
  },

  contentText: {
    color: 'black',
  },
});
