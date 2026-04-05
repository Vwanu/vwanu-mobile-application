import { parseValue } from 'react-native-controlled-mentions'
import { mentionConfigs } from 'config/mentionConfig'

const extractMentionIds = (value: string): string[] => {
  const { parts } = parseValue(value, mentionConfigs)
  return parts.filter((part) => part.data).map((part) => part.data!.id)
}

export default extractMentionIds
