import React from 'react'

import CoverHero from '../CreateBlog.screen/BlogContent/CoverHero'
import { Blog } from '../../../../types'
import HeroActionBar from './HeroActionBar'
import BlogTitle from './BlogTitle'

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
    titleComponent={<BlogTitle title={blog.title} />}
  />
)

export default BlogHero
