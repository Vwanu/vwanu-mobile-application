import { User } from '../../types'

export interface Reply {
  id: string
  body: string
  user: User
  amountOfLikes: number
  createdAt: string
}

export interface Discussion {
  id: string
  title: string
  body: string
  user: User
  amountOfLikes: number
  replies: Reply[]
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Joseph',
    email: 'marie@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    amountOfFollower: 120,
    amountOfFollowing: 80,
    amountOfFriends: 45,
    nextCompletionStep: 4,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    firstName: 'Jean',
    lastName: 'Baptiste',
    email: 'jean@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    amountOfFollower: 200,
    amountOfFollowing: 150,
    amountOfFriends: 90,
    nextCompletionStep: 4,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
    amountOfFollower: 95,
    amountOfFollowing: 60,
    amountOfFriends: 30,
    nextCompletionStep: 4,
    createdAt: new Date('2024-03-05'),
  },
]

export const mockDiscussions: Record<string, Discussion[]> = {
  default: [
    {
      id: 'd1',
      title: 'Welcome to the community!',
      body: 'Introduce yourself and let us know what brings you here. We are excited to have you join the conversation.',
      user: mockUsers[0],
      amountOfLikes: 12,
      replies: [
        {
          id: 'r1-1',
          body: 'Hey everyone! I am a developer from Port-au-Prince. Excited to be here and connect with like-minded people.',
          user: mockUsers[1],
          amountOfLikes: 5,
          createdAt: '2025-12-01T12:30:00Z',
        },
        {
          id: 'r1-2',
          body: 'Welcome! This community has been amazing for networking. You will love it here.',
          user: mockUsers[2],
          amountOfLikes: 3,
          createdAt: '2025-12-01T14:00:00Z',
        },
        {
          id: 'r1-3',
          body: 'Glad to join! Looking forward to learning from everyone.',
          user: mockUsers[0],
          amountOfLikes: 1,
          createdAt: '2025-12-02T09:00:00Z',
        },
      ],
      createdAt: '2025-12-01T10:00:00Z',
    },
    {
      id: 'd2',
      title: 'Best resources to get started?',
      body: 'I am new here and looking for recommendations on books, courses, or tutorials. What helped you the most when you were starting out?',
      user: mockUsers[1],
      amountOfLikes: 8,
      replies: [
        {
          id: 'r2-1',
          body: 'I would recommend starting with the official documentation. It is well written and covers all the basics.',
          user: mockUsers[2],
          amountOfLikes: 7,
          createdAt: '2025-12-03T16:00:00Z',
        },
        {
          id: 'r2-2',
          body: 'YouTube has some great free tutorials. Check out channels like Fireship and Traversy Media.',
          user: mockUsers[0],
          amountOfLikes: 4,
          createdAt: '2025-12-04T10:15:00Z',
        },
      ],
      createdAt: '2025-12-03T14:30:00Z',
    },
    {
      id: 'd3',
      title: 'Weekly discussion thread',
      body: 'Share what you have been working on this week. Any wins, challenges, or interesting discoveries? Let us keep each other motivated.',
      user: mockUsers[2],
      amountOfLikes: 15,
      replies: [
        {
          id: 'r3-1',
          body: 'Just shipped a new feature at work. Feels great to see it live!',
          user: mockUsers[0],
          amountOfLikes: 9,
          createdAt: '2025-12-05T11:00:00Z',
        },
      ],
      createdAt: '2025-12-05T09:15:00Z',
    },
    {
      id: 'd4',
      title: 'Tips for staying consistent',
      body: 'Consistency is key but it is hard to maintain. What strategies do you use to stay on track with your goals?',
      user: mockUsers[0],
      amountOfLikes: 6,
      replies: [],
      createdAt: '2025-12-07T16:45:00Z',
    },
    {
      id: 'd5',
      title: 'Collaboration opportunities',
      body: 'Looking for people to collaborate on projects. If you are interested in teaming up, drop a comment with your skills and availability.',
      user: mockUsers[1],
      amountOfLikes: 10,
      replies: [
        {
          id: 'r5-1',
          body: 'I am a designer and would love to collaborate. Send me a message!',
          user: mockUsers[2],
          amountOfLikes: 2,
          createdAt: '2025-12-10T14:00:00Z',
        },
        {
          id: 'r5-2',
          body: 'Full-stack dev here. Open to weekend projects. What kind of ideas do you have in mind?',
          user: mockUsers[0],
          amountOfLikes: 3,
          createdAt: '2025-12-11T08:30:00Z',
        },
        {
          id: 'r5-3',
          body: 'Count me in! I have experience with mobile development and would love to contribute.',
          user: mockUsers[1],
          amountOfLikes: 1,
          createdAt: '2025-12-11T15:20:00Z',
        },
      ],
      createdAt: '2025-12-10T11:20:00Z',
    },
  ],
}
