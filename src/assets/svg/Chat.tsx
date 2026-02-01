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
      d="M15.9393 12.413H15.9483"
      stroke={fill}
      strokeWidth={stroke ? 3.0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9304 12.413H11.9394"
      stroke={fill}
      strokeWidth={stroke ? 3.0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.9214 12.413H7.9304"
      stroke={fill}
      strokeWidth={stroke ? 3.0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.071 19.0698C16.0159 22.1264 11.4896 22.7867 7.78631 21.074C7.23961 20.8539 3.70113 21.8339 2.93334 21.067C2.16555 20.2991 3.14639 16.7601 2.92631 16.2134C1.21285 12.5106 1.87411 7.9826 4.9302 4.9271C8.83147 1.0243 15.1698 1.0243 19.071 4.9271C22.9803 8.83593 22.9723 15.1681 19.071 19.0698Z"
      stroke={fill}
      strokeWidth={stroke ? 2.0 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)
export default SVGComponent
