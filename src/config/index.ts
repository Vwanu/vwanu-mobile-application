import constants from 'expo-constants'
// Custom exports
export { default as image } from './image'

export enum endpoints {
  LOG_IN = '/auth',
  REGISTER = '/users',
  COUNTRIES = 'country',
  STATES = 'state',
  CITIES = 'city',
  LOCATION = '/location',
  INTERESTS = '/interests',
  USERS = '/users',
  POSTS = '/posts',
  POSTKOREMS = '/korem',
  COMMUNITY = '/commmunities',
  BANNER = '/banners',
  COMMENTS = 'comments',
  BLOGS = '/blogs',
}

export const HttpMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
}
