// ** MUI Components
import Box from '@mui/material/Box'
import { Button, ButtonProps, CardActions, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, InputAdornment, styled } from '@mui/material'
import { ChangeEvent, ElementType, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

interface PropsType {
  data: any
}

const ProfileCover = (props: PropsType) => {
  const { data } = props
  const [imgSrc, setImgSrc] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const userAuth = useAuth()

  useEffect(() => {
    if (data.image) {
      setImgSrc(data.image)
    }
  }, [data])

  const handleInputImageChange = async (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = async () => {
        setImgSrc(reader.result as string)
      }
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }

      try {
        const fileData = files[0]
        if (fileData) {
          const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'cover', fileKey: userAuth.user?.id, fileType: fileData.type } })
          const preSignedUrl = result.data.url

          const response = await axios.put(preSignedUrl, fileData, {
            headers: {
              "Content-type": fileData.type,
              "Access-Control-Allow-Origin": "*",
            },
          })
          if (response.statusText === "OK") {
            toast.success('Profile cover updated successfully.')
          }
        }
      } catch (error) {
      }

    }
  }

  return (
    <>
      {imgSrc ?
        <CardMedia
          component='img'
          alt='profile-header'
          image={imgSrc}
          sx={{
            height: { xs: 50, md: 150 }
          }}
        />
        :
        <>
          <CardMedia
            component='img'
            alt='profile-header'
            image={'/images/pages/profile-banner.png'}
            sx={{
              height: { xs: 50, md: 150 }
            }}
          />
        </>
      }

      <Box
        sx={{
          top: 8,
          right: 20,
          pb: 2,
          width: 40,
          height: 40,
          borderRadius: 1,
          position: 'absolute',
          backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
        }}
      >
        <Button sx={{ right: 20, top: 0 }} component='label' variant='contained' htmlFor='account-settings-upload-cover'>
          <input
            hidden
            type='file'
            value={inputValue}
            accept='image/png, image/jpeg'
            onChange={(e) => handleInputImageChange(e)}
            id='account-settings-upload-cover'
          />
          <Icon icon='tabler:edit' fontSize='1.75rem' />
        </Button>
      </Box>
    </>
  )
}

ProfileCover.acl = {
  action: 'manage',
  subject: 'profilecover'
}

export default ProfileCover
