import Text from 'components/Text'

import tw from 'lib/tailwind'

interface SettingHeaderProps {
  title: string
}
const SettingHeader: React.FC<SettingHeaderProps> = ({ title }) => (
  <Text style={tw`px-4 py-2 text-xs font-semibold text-gray-500 uppercase`}>
    {title}
  </Text>
)

export default SettingHeader
