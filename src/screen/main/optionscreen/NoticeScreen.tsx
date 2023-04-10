import React, { useCallback, useEffect, useState } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { StyleSheet, View, Text } from 'react-native';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import firestore from '@react-native-firebase/firestore';

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
  }, []);

  useEffect(() => {
    initNotification().then();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <Accordion
        containerStyle={{ backgroundColor: 'white', height: '100%' }}
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
    borderColor: '#EDEDED',
    paddingLeft: 20,
    paddingRight: 20,
    width: '80%',
    marginLeft: '10%',
  },

  headerDate: {
    color: 'black',
  },

  headerText: {
    width: '69%',
    color: 'black',
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
    alignItems: 'center',
  },

  contentText: {
    color: 'black',
  },
});
