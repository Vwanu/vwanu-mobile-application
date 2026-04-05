import { parseValue, TriggersConfig } from 'react-native-controlled-mentions'

const triggersConfig: TriggersConfig<'mention'> = {
  mention: {
    trigger: '@',
  },
}

const configs = Object.values(triggersConfig)

const extractMentionIds = (value: string): string[] => {
  const { parts } = parseValue(value, configs)
  return parts.filter((part) => part.data).map((part) => part.data!.id)
}

export default extractMentionIds
