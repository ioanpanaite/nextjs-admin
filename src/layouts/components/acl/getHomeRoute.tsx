/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'buyer') return '/buyer'
  else return '/dashboard'
}

export default getHomeRoute
