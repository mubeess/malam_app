/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import semver from 'semver';
import packageJson from '../../../package.json';

import { useUpdates } from '@amukhtar/hooks/useUpdates';

const NewAppUpdateModal = () => {
  const [isOpen, setIsopen] = useState(false);
  const { update } = useUpdates();
  const { version } = packageJson;

  useEffect(() => {
    if (update) {
      const result = semver.compare(version, update?.version);

      if (result === -1) {
        setIsopen(true);
      } else {
        setIsopen(false);
      }
    }
  }, [update]);

  const onClick = () => {
    const url =
      Platform.OS == 'android'
        ? 'https://play.google.com/store/apps/details?id=com.abubakar.mukhtar'
        : 'https://apps.apple.com/ng/app/tradely-x/id6476217622';
    Linking.openURL(url);
  };
  if (!isOpen) {
    return;
  }
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={true}
      style={{ flex: 1 }}
      onRequestClose={update?.force_update ? () => null : () => setIsopen(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          minHeight: Dimensions.get('window').height - 50,
          minWidth: Dimensions.get('window').width,
        }}
      >
        <View
          style={{
            height: 500,
            width: '90%',
            backgroundColor: '#fff',
            marginHorizontal: 'auto',
            marginTop: 'auto',
            marginBottom: 20,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#383A3F',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            <View>
              <Text style={{ fontWeight: 'bold', color: '#383A3F' }}>Update is here ! 🚀</Text>
              <Text style={{ fontSize: 12, color: '#383A3F' }}>Version {update?.version}</Text>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.screen_gutter}>
              <View style={[styles.screen_content, { gap: 10, marginTop: 10 }]}>
                <View>
                  <View
                    style={{
                      backgroundColor: '#f2f2f2',
                      padding: 15,
                      borderRadius: 10,
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ color: '#383A3F' }}>{update?.description}</Text>
                  </View>
                </View>

                <View className="justify-center items-center w-full">
                  <Text style={{ fontSize: 120, lineHeight: 150, textAlign: 'center' }}>😎</Text>
                </View>
                <View style={{ padding: 10 }}>
                  <TouchableOpacity
                    onPress={onClick}
                    className="h-[48px] w-full bg-green-900 rounded-[8px] justify-center items-center"
                  >
                    <Text className="text-white font-bold">Download Updates</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NewAppUpdateModal;

const styles = StyleSheet.create({
  screen_gutter: {
    flex: 1,
    paddingHorizontal: 30 * 0.9,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  screen_content: {
    flex: 1,
    width: '100%',
  },
});
