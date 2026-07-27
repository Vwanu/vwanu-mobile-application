import React from 'react'

import tw from 'lib/tailwind'
import Text from 'components/Text'
import CoverHero from '../CreateBlog.screen/BlogContent/CoverHero'
import { Blog } from '../../../../types'
import HeroActionBar from './HeroActionBar'

interface Props {
  blog: Blog
  onClose: () => void
}

const BlogHero: React.FC<Props> = ({ blog, onClose }) => (
  <CoverHero
    coverImage={blog.titlePicture}
    interests={blog.interests || []}
    headerComponent={
      <HeroActionBar onClose={onClose} isDraft={!blog.publishedAt} />
    }
    titleComponent={
      <Text
        style={tw`text-3xl font-syne-bold text-white`}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {blog.title}
      </Text>
    }
  />
)

export default BlogHero
