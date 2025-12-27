import React, { useState } from 'react'
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'

import Text from 'components/Text'
import Screen from 'components/screen'
import tw from 'lib/tailwind'
import { CommunityStackParams } from '../../../types'

type CommunitySettingsRouteProp = RouteProp<
  CommunityStackParams,
  'CommunitySettings'
>
type NavigationProp = StackNavigationProp<
  CommunityStackParams,
  'CommunitySettings'
>

interface Member {
  id: number
  name: string
  role: 'Admin' | 'Manager' | 'Member'
  avatar: string
}

interface BannedUser {
  id: number
  name: string
  avatar: string
}

const CommunitySettings = () => {
  const route = useRoute<CommunitySettingsRouteProp>()
  const navigation = useNavigation<NavigationProp>()
  const { communityId } = route.params

  const mockCommunities = [
    {
      id: 1,
      name: 'Nature Lovers',
      backgroundImage:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
      interests: [
        { id: 1, name: 'Nature' },
        { id: 2, name: 'Travel' },
        { id: 3, name: 'Photography' },
      ],
      memberCount: 1250,
    },
    {
      id: 2,
      name: 'Cultural Explorers',
      backgroundImage:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop',
      interests: [
        { id: 4, name: 'Culture' },
        { id: 5, name: 'History' },
        { id: 6, name: 'Art' },
      ],
      memberCount: 870,
    },
  ]
  // Find the community data
  const community =
    mockCommunities.find((c) => c.id === parseInt(communityId)) ||
    mockCommunities[1]

  const [communityType, setCommunityType] = useState<
    'Public' | 'Private' | 'Member'
  >('Public')
  const [invitationSettings, setInvitationSettings] = useState({
    nature: true,
    travel: false,
    culture: true,
    haiti: false,
  })

  // Mock data for members and banned users
  const members: Member[] = [
    {
      id: 1,
      name: 'Ti Joe',
      role: 'Admin',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Marie Jean',
      role: 'Manager',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
  ]

  const bannedUsers: BannedUser[] = [
    {
      id: 1,
      name: 'BadUser123',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    },
  ]

  const renderHeader = () => (
    <View
      style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100`}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="menu" size={24} color="#000" />
      </TouchableOpacity>

      <Text category="h6" style={tw`font-semibold text-lg`}>
        Community Settings
      </Text>

      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  )

  const renderCommunityHero = () => (
    <View style={tw`relative`}>
      <ImageBackground
        source={{ uri: community.backgroundImage }}
        style={tw`w-full h-64`}
        resizeMode="cover"
      >
        {/* Community info overlay */}
        <View
          style={tw`absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4`}
        >
          {/* Interest tags */}
          <View style={tw`flex-row flex-wrap mb-3`}>
            {community.interests.slice(0, 3).map((interest) => (
              <View
                key={interest.id}
                style={tw`bg-white bg-opacity-80 px-3 py-1 rounded-full mr-2 mb-2`}
              >
                <Text style={tw`text-black text-xs font-medium`}>
                  {interest.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Community name */}
          <Text
            category="h3"
            style={tw`text-white font-bold text-2xl mb-2 leading-7`}
            numberOfLines={2}
          >
            {community.name}
          </Text>

          {/* Join button */}
          <TouchableOpacity
            style={tw`bg-white bg-opacity-90 px-6 py-3 rounded-full self-start`}
          >
            <Text style={tw`text-black font-semibold text-sm`}>Join</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )

  const renderStatsSection = () => (
    <View style={tw`bg-white border-b border-gray-100`}>
      <View style={tw`flex-row justify-center py-4`}>
        <View style={tw`items-center flex-1`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>
            {community.memberCount?.toLocaleString() || '870'}
          </Text>
          <Text style={tw`text-gray-600 text-sm`}>Members</Text>
        </View>

        <View style={tw`w-px bg-gray-200 mx-4`} />

        <View style={tw`items-center flex-1`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>15k</Text>
          <Text style={tw`text-gray-600 text-sm`}>Posts</Text>
        </View>
      </View>
    </View>
  )

  const renderMemberManagement = () => (
    <View style={tw`bg-white p-4 border-b border-gray-100`}>
      <Text style={tw`text-gray-800 font-semibold text-lg mb-4`}>
        Member Management
      </Text>

      {members.map((member) => (
        <View
          key={member.id}
          style={tw`flex-row items-center justify-between py-3`}
        >
          <View style={tw`flex-row items-center flex-1`}>
            <View style={tw`w-12 h-12 rounded-full bg-gray-300 mr-3`}>
              <ImageBackground
                source={{ uri: member.avatar }}
                style={tw`w-full h-full rounded-full`}
                resizeMode="cover"
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-800 font-medium text-base`}>
                {member.name}
              </Text>
              <Text style={tw`text-gray-500 text-sm`}>{member.role}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )

  const renderCommunityType = () => (
    <View style={tw`bg-white p-4 border-b border-gray-100`}>
      <Text style={tw`text-gray-800 font-semibold text-lg mb-4`}>
        Community Type
      </Text>

      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row`}>
          {(['Public', 'Private', 'Member'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setCommunityType(type)}
              style={[
                tw`px-4 py-2 rounded-full mr-3`,
                communityType === type ? tw`bg-blue-500` : tw`bg-gray-200`,
              ]}
            >
              <Text
                style={[
                  tw`font-medium text-sm`,
                  communityType === type ? tw`text-white` : tw`text-gray-700`,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderCommunitySettings = () => (
    <View style={tw`bg-white p-4 border-b border-gray-100`}>
      <Text style={tw`text-gray-800 font-semibold text-lg mb-4`}>
        Community Settings
      </Text>

      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`text-gray-700 font-medium text-base`}>
            Invitations
          </Text>
          <TouchableOpacity>
            <Ionicons name="duplicate-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-gray-600 text-sm mb-3`}>
          Who can invite new members?
        </Text>

        <View style={tw`flex-row flex-wrap`}>
          {Object.entries(invitationSettings).map(([key, enabled]) => (
            <TouchableOpacity
              key={key}
              onPress={() =>
                setInvitationSettings((prev) => ({ ...prev, [key]: !enabled }))
              }
              style={[
                tw`px-3 py-1 rounded-full mr-2 mb-2`,
                enabled ? tw`bg-blue-500` : tw`bg-gray-200`,
              ]}
            >
              <Text
                style={[
                  tw`text-sm font-medium`,
                  enabled ? tw`text-white` : tw`text-gray-700`,
                ]}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={tw`flex-row items-center py-3`}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#6B7280"
          style={tw`mr-3`}
        />
        <Text style={tw`text-gray-600 text-base flex-1`}>
          Community Interests
        </Text>
        <Text style={tw`text-blue-500 text-sm`}>Add more...</Text>
      </TouchableOpacity>
    </View>
  )

  const renderBannedUsers = () => (
    <View style={tw`bg-white p-4`}>
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Text style={tw`text-gray-800 font-semibold text-lg`}>
          Banned Users
        </Text>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-blue-500 text-sm mr-2`}>Unban</Text>
          <TouchableOpacity
            style={tw`w-8 h-8 bg-blue-500 rounded-full items-center justify-center`}
          >
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {bannedUsers.map((user) => (
        <View
          key={user.id}
          style={tw`flex-row items-center justify-between py-3`}
        >
          <View style={tw`flex-row items-center flex-1`}>
            <View style={tw`w-12 h-12 rounded-full bg-gray-300 mr-3`}>
              <ImageBackground
                source={{ uri: user.avatar }}
                style={tw`w-full h-full rounded-full`}
                resizeMode="cover"
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-800 font-medium text-base`}>
                {user.name}
              </Text>
              <Text style={tw`text-gray-500 text-sm`}>Member</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )

  return (
    <Screen>
      <View style={tw`flex-1 bg-gray-50`}>
        {renderHeader()}

        <ScrollView
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {renderCommunityHero()}
          {renderStatsSection()}
          {renderMemberManagement()}
          {renderCommunityType()}
          {renderCommunitySettings()}
          {renderBannedUsers()}
        </ScrollView>
      </View>
    </Screen>
  )
}

export default CommunitySettings
