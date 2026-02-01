import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { SVGProps } from './style'

const SVGComponent: React.FC<SVGProps> = ({ width, height, fill, stroke }) => (
  <Svg
    width={width || 24}
    height={height || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M11.9849 21.2205C15.8525 21.2205 19.1545 20.6348 19.1545 18.2938C19.1545 15.9529 15.8735 15.3462 11.9849 15.3462C8.11731 15.3462 4.81445 15.931 4.81445 18.2729C4.81445 19.8591 6.32011 20.6488 8.50012 20.9933"
      stroke={fill}
      strokeWidth={stroke ? 2.0 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9849 12.0059C14.523 12.0059 16.5801 9.94782 16.5801 7.40972C16.5801 4.87163 14.523 2.81448 11.9849 2.81448C9.44679 2.81448 7.3887 4.87163 7.3887 7.40972C7.38013 9.93925 9.42394 11.9973 11.9525 12.0059H11.9849Z"
      stroke={fill}
      strokeWidth={stroke ? 2.0 : 1.42857}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)
export default SVGComponent
