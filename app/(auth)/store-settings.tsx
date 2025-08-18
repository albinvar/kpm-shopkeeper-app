// import { Entypo, FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import EmployeesIcon from '../../assets/icons/people.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';
import UploadIcon from '../../assets/icons/uploadfile.svg';
import TruckIcon from '../../assets/icons/truck.svg';
import RouteIcon from '../../assets/icons/routing.svg';
import Icon from '../../assets/icons/Logo.svg';
import LeftArrow from '../../assets/icons/arrow-left.svg';
import DocIcon from '../../assets/icons/folder-open.svg'; // Orange circle icon for modal

export default function StoreSettingsScreen() {
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    setShowModal(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 px-4 pt-16 bg-white">
        {/* Header with Back Arrow */}
        <View className="relative items-center justify-center mb-6">
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 19,
            }}
            onPress={() => router.push('/(auth)/storeInfo')}
          >
            <LeftArrow width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-center">Store Settings</Text>
        </View>

        {/* Card Items */}
        <SettingCard
          icon={<EmployeesIcon width={28} height={28} />}
          title="Manage Employees"
          subtitle="Assign/Manage Employees to handle the orders from KPM network"
        />

        <SettingCard
          icon={<CalendarIcon width={28} height={28} />}
          title="Store Timing"
          subtitle="Set store availability timings to manage the accept and block orders"
        />

        <SettingCard
          icon={<UploadIcon width={28} height={28} />}
          title="Upload Documents"
          subtitle="We will publish your store only after the verification from our end."
          onEdit={() => console.log('Edit Documents')}
        />

        <SettingCard
          icon={<TruckIcon width={28} height={28} />}
          title="Store Delivery"
          subtitle="Enable it if your store is able to deliver goods by itself."
          isSwitch
          switchValue={false}
          onSwitchChange={(val) => console.log('Switch toggled:', val)}
        />

        <SettingCard
          icon={<RouteIcon width={28} height={28} />}
          title="Delivery Location"
          subtitle="Enable it if your store is able to deliver goods by itself."
          isSwitch
          switchValue={false}
          onSwitchChange={(val) => console.log('Switch toggled:', val)}
        />

        {/* Logo and Terms */}
        <View className="items-center my-6">
          <Icon width={100} height={100} />
          <Text className="mt-2 text-sm text-center text-gray-400">
            By signing in with an account, you agree to KPM Terms of Service and Privacy Policy.
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#FFB700] py-4 rounded-xl items-center mt-2 mb-10"
        >
          <Text className="text-base font-bold text-white">Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL - Submitted For Verification */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View className="px-6 pt-6 pb-8 bg-white rounded-t-3xl">
          <Text className="mb-2 text-xs font-bold text-gray-400">NOTICE</Text>

          <View className="flex-row items-start gap-4 mb-4">
            <View className="p-3 bg-[#FFB700] rounded-full">
              <DocIcon width={28} height={28} />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-lg font-semibold text-black">
                Submitted For Verification
              </Text>
              <Text className="text-sm text-gray-600">
                Your details has been submitted with{' '}
                <Text className="text-[#4B5563] font-semibold">KPM876358</Text> and is in progress.
                We will notify you the conclusion after we validate your details.
              </Text>
            </View>
          </View>

          <TouchableOpacity
                    onPress={() => router.push("/(auth)/subscription")}

            // onPress={() => setShowModal(false)}
            className="bg-[#FFB700] py-3 rounded-xl items-center"
          >
            <Text className="font-bold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const SettingCard = ({
  icon,
  title,
  subtitle,
  onEdit,
  isSwitch = false,
  switchValue = false,
  onSwitchChange = () => {},
  highlighted = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onEdit?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  highlighted?: boolean;
}) => {
  return (
    <View
      style={{
        borderWidth: highlighted ? 2 : 0,
        borderColor: highlighted ? '#3b82f6' : 'transparent',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f9fafb',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={{
            padding: 10,
            backgroundColor: '#f3f4f6',
            borderRadius: 999,
            marginRight: 12,
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 2 }}>{title}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>{subtitle}</Text>
        </View>
      </View>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} />
      ) : (
        <TouchableOpacity onPress={onEdit}>
          <Text style={{ color: '#FFB700', fontWeight: '600' }}>Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
