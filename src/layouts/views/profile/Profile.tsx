// ** MUI Components
import Grid from '@mui/material/Grid'
import AboutOverivew from './AboutOverivew'
import ProfileSecurity from './ProfileSecurity'
import { useAuth } from 'src/hooks/useAuth'
import ProfileCover from './ProfileCover'
import ProfileImage from './ProfileImage'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useEffect, useState } from 'react'
import { fetchData, getUser } from 'src/store/apps/user'
import { Role, Status } from 'src/context/types'

const ProfileTab = () => {
  const { user } = useAuth()

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const [cover, setCover] = useState('')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    dispatch(
      fetchData({
        role: user?.role || "",
        status: Status.Active || "",
        q: '',
        currentPlan: ''
      })
    )

  }, [dispatch])


  useEffect(() => {
    if (user?.role === Role.Supplier) {
      const userId = user?.id
      const storeUser = getUser(store, userId)
      const coverImage = storeUser?.supplierCover as string
      const profileImage = storeUser?.supplierImage as string

      setCover(coverImage)
      setAvatar(profileImage)
    }

  }, [store])

  return user && Object.values(user).length ? (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew data={user} />
      </Grid>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ProfileSecurity />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab
