import { PostCardReply } from './PostCard'

 const mappedReplies = (comments): PostCardReply[] =>

 comments.map((reply) => ({
    ...reply,
    amountOfLikes: reply.amountOfKorems,
    isFetchingLikers: false,
    onLike: async (id: string) => {
      await toggleKore(id)
    },
    onFetchLikers: () => {
      fetchLikers({ postId: reply.id.toString() })
    },
  }))
