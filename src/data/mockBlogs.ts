import { User, NextCompletionStep } from '../../types.d'

export interface BlogInterest {
  id: string
  name: string
}

export interface MockBlog {
  id: string
  author: User
  title: string
  titlePicture: string
  content: string
  interests: BlogInterest[]
  amountOfLikes: number
  createdAt: string
  publishedAt: string
  updatedAt: string
}

const createAuthor = (
  id: string,
  firstName: string,
  lastName: string,
  profilePicture: string,
  about?: string
): User => ({
  id,
  firstName,
  lastName,
  profilePicture,
  email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
  createdAt: new Date('2024-01-15'),
  amountOfFollower: Math.floor(Math.random() * 500) + 50,
  amountOfFollowing: Math.floor(Math.random() * 200) + 20,
  amountOfFriends: Math.floor(Math.random() * 150) + 10,
  nextCompletionStep: NextCompletionStep.PROFILE_COMPLETE,
  online: Math.random() > 0.5,
  about,
})

export const mockBlogs: MockBlog[] = [
  {
    id: '1',
    author: createAuthor(
      '1',
      'Emma',
      'Johnson',
      'https://i.pravatar.cc/150?img=1',
      'Photography enthusiast | Travel lover'
    ),
    title: 'The Art of Capturing Golden Hour Photography',
    titlePicture: 'https://picsum.photos/seed/blog1/800/400',
    content:
      'Golden hour is that magical time just after sunrise or before sunset when the light is soft, warm, and perfect for photography. In this post, I share my favorite techniques for making the most of this fleeting window of opportunity. From finding the right location to adjusting your camera settings, these tips will help you capture stunning images that truly glow.',
    interests: [
      { id: '1', name: 'Photography' },
      { id: '2', name: 'Travel' },
      { id: '3', name: 'Nature' },
    ],
    amountOfLikes: 324,
    createdAt: '2025-12-15T08:30:00Z',
    publishedAt: '2025-12-16T10:00:00Z',
    updatedAt: '2025-12-16T10:00:00Z',
  },
  {
    id: '2',
    author: createAuthor(
      '2',
      'Michael',
      'Chen',
      'https://i.pravatar.cc/150?img=12',
      'Software developer | Tech enthusiast'
    ),
    title: 'Building Scalable APIs with Node.js and TypeScript',
    titlePicture: 'https://picsum.photos/seed/blog2/800/400',
    content:
      'When building modern web applications, having a well-structured API is crucial. In this comprehensive guide, I walk through the best practices for creating scalable, maintainable APIs using Node.js and TypeScript. We cover everything from project setup to error handling, authentication, and deployment strategies.',
    interests: [
      { id: '4', name: 'Technology' },
      { id: '5', name: 'Programming' },
      { id: '6', name: 'Web Development' },
    ],
    amountOfLikes: 512,
    createdAt: '2025-12-10T14:20:00Z',
    publishedAt: '2025-12-11T09:00:00Z',
    updatedAt: '2025-12-20T15:30:00Z',
  },
  {
    id: '3',
    author: createAuthor(
      '3',
      'Sarah',
      'Williams',
      'https://i.pravatar.cc/150?img=5',
      'Artist | Coffee addict'
    ),
    title: 'Finding Inspiration in Everyday Objects',
    titlePicture: 'https://picsum.photos/seed/blog3/800/400',
    content:
      'As an artist, inspiration can come from the most unexpected places. Today I want to share how I find creative ideas in ordinary household items. A simple coffee cup, a crumpled piece of paper, or the way light falls through a window can spark an entire series of artwork. Let me show you how to train your eye to see the extraordinary in the ordinary.',
    interests: [
      { id: '7', name: 'Art' },
      { id: '8', name: 'Creativity' },
      { id: '9', name: 'Lifestyle' },
    ],
    amountOfLikes: 189,
    createdAt: '2025-12-18T11:45:00Z',
    publishedAt: '2025-12-18T16:00:00Z',
    updatedAt: '2025-12-18T16:00:00Z',
  },
  {
    id: '4',
    author: createAuthor(
      '4',
      'David',
      'Martinez',
      'https://i.pravatar.cc/150?img=13',
      'Fitness coach | Nutrition expert'
    ),
    title: '5 Morning Habits That Transformed My Fitness Journey',
    titlePicture: 'https://picsum.photos/seed/blog4/800/400',
    content:
      'Your morning routine sets the tone for the entire day. After years of coaching clients, I have identified five habits that consistently lead to better fitness results. From hydration strategies to mindful movement, these simple changes can have a profound impact on your health and energy levels throughout the day.',
    interests: [
      { id: '10', name: 'Fitness' },
      { id: '11', name: 'Health' },
      { id: '12', name: 'Wellness' },
    ],
    amountOfLikes: 876,
    createdAt: '2025-12-05T06:00:00Z',
    publishedAt: '2025-12-06T07:00:00Z',
    updatedAt: '2025-12-25T08:15:00Z',
  },
  {
    id: '5',
    author: createAuthor(
      '5',
      'Jessica',
      'Taylor',
      'https://i.pravatar.cc/150?img=9',
      'Blogger | Fashion enthusiast'
    ),
    title: 'Sustainable Fashion: Building a Capsule Wardrobe',
    titlePicture: 'https://picsum.photos/seed/blog5/800/400',
    content:
      'Fast fashion is out, and conscious consumption is in. In this post, I break down how to build a versatile capsule wardrobe that reduces waste while keeping you stylish all year round. Learn which essential pieces to invest in and how to mix and match for endless outfit possibilities.',
    interests: [
      { id: '13', name: 'Fashion' },
      { id: '14', name: 'Sustainability' },
      { id: '9', name: 'Lifestyle' },
    ],
    amountOfLikes: 445,
    createdAt: '2025-12-20T13:00:00Z',
    publishedAt: '2025-12-21T10:00:00Z',
    updatedAt: '2025-12-21T10:00:00Z',
  },
  {
    id: '6',
    author: createAuthor(
      '6',
      'James',
      'Anderson',
      'https://i.pravatar.cc/150?img=14',
      'Entrepreneur | Startup founder'
    ),
    title: 'Lessons Learned from My First Failed Startup',
    titlePicture: 'https://picsum.photos/seed/blog6/800/400',
    content:
      'Not every venture succeeds, and that is okay. My first startup failed spectacularly after 18 months, but the lessons I learned were invaluable. In this honest reflection, I share the mistakes I made, from hiring too fast to ignoring customer feedback, and how these failures shaped my approach to building my current successful company.',
    interests: [
      { id: '15', name: 'Business' },
      { id: '16', name: 'Entrepreneurship' },
      { id: '17', name: 'Startups' },
    ],
    amountOfLikes: 1203,
    createdAt: '2025-11-28T09:30:00Z',
    publishedAt: '2025-11-30T12:00:00Z',
    updatedAt: '2025-12-15T14:20:00Z',
  },
  {
    id: '7',
    author: createAuthor(
      '7',
      'Olivia',
      'Thompson',
      'https://i.pravatar.cc/150?img=10',
      'Designer | Creative thinker'
    ),
    title: 'Color Theory for Digital Designers: A Practical Guide',
    titlePicture: 'https://picsum.photos/seed/blog7/800/400',
    content:
      'Understanding color theory is fundamental to creating visually appealing designs. This guide covers the basics of the color wheel, complementary and analogous color schemes, and how to use color psychology to evoke specific emotions in your designs. Plus, I share my favorite tools for generating harmonious color palettes.',
    interests: [
      { id: '18', name: 'Design' },
      { id: '8', name: 'Creativity' },
      { id: '7', name: 'Art' },
    ],
    amountOfLikes: 298,
    createdAt: '2025-12-12T10:15:00Z',
    publishedAt: '2025-12-13T09:00:00Z',
    updatedAt: '2025-12-13T09:00:00Z',
  },
  {
    id: '8',
    author: createAuthor(
      '8',
      'Robert',
      'Garcia',
      'https://i.pravatar.cc/150?img=15',
      'Chef | Food lover'
    ),
    title: 'The Perfect Homemade Pasta: From Scratch to Plate',
    titlePicture: 'https://picsum.photos/seed/blog8/800/400',
    content:
      'There is something deeply satisfying about making pasta from scratch. In this detailed tutorial, I walk you through the entire process, from mixing the dough to shaping various pasta types. Whether you want silky fettuccine or delicate ravioli, these techniques will elevate your home cooking to restaurant quality.',
    interests: [
      { id: '19', name: 'Food' },
      { id: '20', name: 'Cooking' },
      { id: '21', name: 'Recipes' },
    ],
    amountOfLikes: 721,
    createdAt: '2025-12-08T15:45:00Z',
    publishedAt: '2025-12-09T11:00:00Z',
    updatedAt: '2025-12-22T16:30:00Z',
  },
  {
    id: '9',
    author: createAuthor(
      '9',
      'Sophia',
      'Rodriguez',
      'https://i.pravatar.cc/150?img=16',
      'Writer | Book reviewer'
    ),
    title: 'Why Literary Fiction Still Matters in the Digital Age',
    titlePicture: 'https://picsum.photos/seed/blog9/800/400',
    content:
      'In an era of endless scrolling and bite-sized content, long-form literary fiction might seem outdated. But I argue that it is more important than ever. Deep reading develops empathy, improves focus, and offers a unique window into the human experience. Here is my case for why we should all make time for serious literature.',
    interests: [
      { id: '22', name: 'Books' },
      { id: '23', name: 'Literature' },
      { id: '24', name: 'Writing' },
    ],
    amountOfLikes: 156,
    createdAt: '2025-12-14T17:00:00Z',
    publishedAt: '2025-12-15T14:00:00Z',
    updatedAt: '2025-12-15T14:00:00Z',
  },
  {
    id: '10',
    author: createAuthor(
      '10',
      'Daniel',
      'Lee',
      'https://i.pravatar.cc/150?img=17',
      'Musician | Producer'
    ),
    title: 'Recording Vocals at Home: A Complete Setup Guide',
    titlePicture: 'https://picsum.photos/seed/blog10/800/400',
    content:
      'You do not need a professional studio to record great vocals. With the right equipment and techniques, your home setup can produce broadcast-quality recordings. I cover everything from microphone selection and acoustic treatment to software settings and mixing tips that will make your vocals shine.',
    interests: [
      { id: '25', name: 'Music' },
      { id: '26', name: 'Audio Production' },
      { id: '4', name: 'Technology' },
    ],
    amountOfLikes: 534,
    createdAt: '2025-12-01T12:00:00Z',
    publishedAt: '2025-12-02T10:00:00Z',
    updatedAt: '2025-12-18T11:45:00Z',
  },
  {
    id: '11',
    author: createAuthor(
      '11',
      'Ava',
      'White',
      'https://i.pravatar.cc/150?img=18',
      'Yoga instructor | Mindfulness coach'
    ),
    title: 'Mindfulness Meditation for Beginners: Start Your Practice Today',
    titlePicture: 'https://picsum.photos/seed/blog11/800/400',
    content:
      'Meditation does not have to be complicated or time-consuming. In this beginner-friendly guide, I introduce simple mindfulness techniques you can practice in just five minutes a day. Learn how to quiet your mind, reduce stress, and cultivate a sense of inner peace that will benefit every area of your life.',
    interests: [
      { id: '27', name: 'Mindfulness' },
      { id: '12', name: 'Wellness' },
      { id: '28', name: 'Mental Health' },
    ],
    amountOfLikes: 892,
    createdAt: '2025-12-19T07:30:00Z',
    publishedAt: '2025-12-19T08:00:00Z',
    updatedAt: '2025-12-19T08:00:00Z',
  },
  {
    id: '12',
    author: createAuthor(
      '12',
      'Christopher',
      'Harris',
      'https://i.pravatar.cc/150?img=19',
      'Photographer | Visual storyteller'
    ),
    title: 'Street Photography Ethics: Capturing Life Responsibly',
    titlePicture: 'https://picsum.photos/seed/blog12/800/400',
    content:
      'Street photography raises important questions about privacy, consent, and respect. As photographers, we have a responsibility to document life without exploiting our subjects. This post explores the ethical considerations every street photographer should keep in mind, along with practical tips for engaging with the people we photograph.',
    interests: [
      { id: '1', name: 'Photography' },
      { id: '29', name: 'Ethics' },
      { id: '7', name: 'Art' },
    ],
    amountOfLikes: 267,
    createdAt: '2025-12-07T16:20:00Z',
    publishedAt: '2025-12-08T09:00:00Z',
    updatedAt: '2025-12-08T09:00:00Z',
  },
  {
    id: '13',
    author: createAuthor(
      '13',
      'Mia',
      'Clark',
      'https://i.pravatar.cc/150?img=20',
      'Marketing specialist | Brand strategist'
    ),
    title: 'Building Your Personal Brand on Social Media',
    titlePicture: 'https://picsum.photos/seed/blog13/800/400',
    content:
      'In today competitive landscape, your personal brand is your most valuable asset. This comprehensive guide covers strategies for defining your unique value proposition, creating consistent content, and growing an engaged following. Learn how to stand out and attract opportunities in your industry.',
    interests: [
      { id: '30', name: 'Marketing' },
      { id: '31', name: 'Social Media' },
      { id: '15', name: 'Business' },
    ],
    amountOfLikes: 643,
    createdAt: '2025-12-22T10:00:00Z',
    publishedAt: '2025-12-23T09:00:00Z',
    updatedAt: '2025-12-23T09:00:00Z',
  },
  {
    id: '14',
    author: createAuthor(
      '14',
      'Matthew',
      'Lewis',
      'https://i.pravatar.cc/150?img=21',
      'Data scientist | AI enthusiast'
    ),
    title: 'Introduction to Machine Learning: Key Concepts Explained',
    titlePicture: 'https://picsum.photos/seed/blog14/800/400',
    content:
      'Machine learning is transforming industries, but the terminology can be intimidating for newcomers. This post breaks down essential concepts like supervised learning, neural networks, and model training in plain language. By the end, you will have a solid foundation for exploring this exciting field further.',
    interests: [
      { id: '32', name: 'AI' },
      { id: '33', name: 'Machine Learning' },
      { id: '34', name: 'Data Science' },
    ],
    amountOfLikes: 1456,
    createdAt: '2025-12-03T14:30:00Z',
    publishedAt: '2025-12-04T10:00:00Z',
    updatedAt: '2025-12-20T09:15:00Z',
  },
  {
    id: '15',
    author: createAuthor(
      '15',
      'Isabella',
      'Walker',
      'https://i.pravatar.cc/150?img=22',
      'Architect | Urban planner'
    ),
    title: 'Designing Spaces for Wellbeing: Biophilic Architecture',
    titlePicture: 'https://picsum.photos/seed/blog15/800/400',
    content:
      'Biophilic design incorporates natural elements into built environments to improve occupant wellbeing. From living walls to natural lighting strategies, I explore how architects are creating spaces that reconnect us with nature. Discover the science behind why these designs make us feel better and more productive.',
    interests: [
      { id: '35', name: 'Architecture' },
      { id: '18', name: 'Design' },
      { id: '12', name: 'Wellness' },
    ],
    amountOfLikes: 378,
    createdAt: '2025-12-11T11:00:00Z',
    publishedAt: '2025-12-12T10:00:00Z',
    updatedAt: '2025-12-12T10:00:00Z',
  },
  {
    id: '16',
    author: createAuthor(
      '16',
      'Joshua',
      'Hall',
      'https://i.pravatar.cc/150?img=23',
      'Gamer | Streamer'
    ),
    title: 'The Rise of Indie Games: Why Small Studios Are Winning',
    titlePicture: 'https://picsum.photos/seed/blog16/800/400',
    content:
      'While AAA titles dominate headlines, indie games are having a renaissance. With lower budgets but unlimited creativity, small studios are producing some of the most innovative and emotionally resonant games of our time. I analyze what makes indie games special and highlight some must-play titles you might have missed.',
    interests: [
      { id: '36', name: 'Gaming' },
      { id: '37', name: 'Indie Games' },
      { id: '38', name: 'Entertainment' },
    ],
    amountOfLikes: 987,
    createdAt: '2025-12-16T20:00:00Z',
    publishedAt: '2025-12-17T15:00:00Z',
    updatedAt: '2025-12-17T15:00:00Z',
  },
  {
    id: '17',
    author: createAuthor(
      '17',
      'Charlotte',
      'Allen',
      'https://i.pravatar.cc/150?img=24',
      'Teacher | Education advocate'
    ),
    title: 'Project-Based Learning: Engaging Students in Real-World Problems',
    titlePicture: 'https://picsum.photos/seed/blog17/800/400',
    content:
      'Traditional lecture-based teaching is giving way to more engaging methodologies. Project-based learning puts students at the center of their education, challenging them to solve authentic problems. This post shares practical strategies for implementing PBL in your classroom, along with examples of successful projects.',
    interests: [
      { id: '39', name: 'Education' },
      { id: '40', name: 'Teaching' },
      { id: '41', name: 'Learning' },
    ],
    amountOfLikes: 412,
    createdAt: '2025-12-09T08:45:00Z',
    publishedAt: '2025-12-10T09:00:00Z',
    updatedAt: '2025-12-10T09:00:00Z',
  },
  {
    id: '18',
    author: createAuthor(
      '18',
      'Andrew',
      'Young',
      'https://i.pravatar.cc/150?img=25',
      'Lawyer | Human rights activist'
    ),
    title: 'Understanding Your Rights: A Guide to Digital Privacy Laws',
    titlePicture: 'https://picsum.photos/seed/blog18/800/400',
    content:
      'In an increasingly connected world, understanding your digital privacy rights is essential. This guide breaks down key legislation like GDPR and CCPA, explaining what they mean for you as an individual and how to exercise your rights. Knowledge is power when it comes to protecting your personal data.',
    interests: [
      { id: '42', name: 'Law' },
      { id: '43', name: 'Privacy' },
      { id: '4', name: 'Technology' },
    ],
    amountOfLikes: 589,
    createdAt: '2025-12-13T13:15:00Z',
    publishedAt: '2025-12-14T10:00:00Z',
    updatedAt: '2025-12-21T11:30:00Z',
  },
  {
    id: '19',
    author: createAuthor(
      '19',
      'Amelia',
      'King',
      'https://i.pravatar.cc/150?img=26',
      'Journalist | News reporter'
    ),
    title: 'The Future of Journalism in the Age of AI',
    titlePicture: 'https://picsum.photos/seed/blog19/800/400',
    content:
      'Artificial intelligence is reshaping how news is gathered, written, and distributed. As a journalist, I have mixed feelings about these changes. This piece examines both the opportunities and threats AI presents to quality journalism, and argues for why human reporters will always be essential.',
    interests: [
      { id: '44', name: 'Journalism' },
      { id: '32', name: 'AI' },
      { id: '45', name: 'Media' },
    ],
    amountOfLikes: 834,
    createdAt: '2025-12-17T09:00:00Z',
    publishedAt: '2025-12-17T12:00:00Z',
    updatedAt: '2025-12-17T12:00:00Z',
  },
  {
    id: '20',
    author: createAuthor(
      '20',
      'Ryan',
      'Scott',
      'https://i.pravatar.cc/150?img=27',
      'Doctor | Medical researcher'
    ),
    title: 'Breakthroughs in Cancer Research: What Patients Should Know',
    titlePicture: 'https://picsum.photos/seed/blog20/800/400',
    content:
      'Recent advances in immunotherapy and targeted treatments are giving new hope to cancer patients. In this accessible overview, I explain the science behind these breakthroughs and what they mean for treatment options. While we are not at a cure yet, the progress being made is truly remarkable.',
    interests: [
      { id: '46', name: 'Medicine' },
      { id: '11', name: 'Health' },
      { id: '47', name: 'Science' },
    ],
    amountOfLikes: 1089,
    createdAt: '2025-12-21T14:00:00Z',
    publishedAt: '2025-12-22T10:00:00Z',
    updatedAt: '2025-12-22T10:00:00Z',
  },
]
