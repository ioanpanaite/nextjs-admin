// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { useAuth } from 'src/hooks/useAuth'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Role, Status, UserDataType } from 'src/context/types'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData, getUser } from 'src/store/apps/user'
import { ChangeEvent, useEffect, useState } from 'react'
import ProfileCover from './ProfileCover'
import { Button } from '@mui/material'
import axios from 'axios'
import toast from 'react-hot-toast'

const getInitials = (string: string) =>
  string.split(/\s/).reduce((response, word) => (response += word.slice(0, 2)), '')

const UserProfileHeader = () => {
  // ** State
  const { user } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)
  const [cover, setCover] = useState('')
  const [avatar, setAvatar] = useState('')
  const [inputAvatar, setInputAvatar] = useState('')
  const userAuth = useAuth()

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

  const handleInputAvatarChange = async (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = async () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputAvatar(reader.result as string)
      }

      try {
        const fileData = files[0]
        if (fileData) {
          const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'avatar', fileKey: userAuth.user?.id, fileType: fileData.type } })
          const preSignedUrl = result.data.url

          const response = await axios.put(preSignedUrl, fileData, {
            headers: {
              "Content-type": fileData.type,
              "Access-Control-Allow-Origin": "*",
            },
          })
          if (response.statusText === "OK") {
            toast.success('Profile image updated successfully.')
          }
        }
      } catch (error) {
      }

    }
  }

  return user !== null ? (
    <Card sx={{ position: "relative" }}>
      <ProfileCover data={{ image: cover }} />

      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        {
          avatar ?
            <Button component='label' variant='text' htmlFor='avatar-upload-image'>
              <input
                hidden
                type='file'
                value={inputAvatar}
                accept='image/png, image/jpeg'
                onChange={handleInputAvatarChange}
                id='avatar-upload-image'
              />
              <CustomAvatar src={avatar} sx={{ mr: 2.5, width: 108, height: 108, border: theme => `4px solid ${theme.palette.common.white}` }} />
            </Button>
            :
            <Button component='label' variant='text' htmlFor='account-settings-upload-image'>
              <CustomAvatar
                skin='light'
                sx={{ mr: 2.5, width: 108, height: 108, fontWeight: 500, border: theme => `4px solid ${theme.palette.common.white}`, fontSize: theme => theme.typography.h2 }}
              >
                <input
                  hidden
                  type='file'
                  value={inputAvatar}
                  accept='image/png, image/jpeg'
                  onChange={handleInputAvatarChange}
                  id='account-settings-upload-image'
                />
                {getInitials(user.fullName ? user.fullName : 'John Doe')}
              </CustomAvatar>
            </Button>
        }
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {user?.fullName}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon={'tabler:briefcase'} />
                <Typography sx={{ color: 'text.secondary' }}>{user?.role.toUpperCase()}</Typography>
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:map-pin' />
                <Typography sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:calendar' />
                <Typography sx={{ color: 'text.secondary' }}>Joined with {user?.currentPlan}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default UserProfileHeader
