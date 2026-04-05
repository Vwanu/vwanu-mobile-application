import type { TriggersConfig } from 'react-native-controlled-mentions'

export const mentionTriggersConfig: TriggersConfig<'mention'> = {
  mention: {
    trigger: '@',
    textStyle: { fontWeight: 'bold', color: '#3B82F6' },
    isInsertSpaceAfterMention: true,
  },
}

export const mentionConfigs = Object.values(mentionTriggersConfig)
