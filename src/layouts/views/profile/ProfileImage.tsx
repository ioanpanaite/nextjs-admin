// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { ThemeColor } from 'src/@core/layouts/types'
import { Button, ButtonProps, styled } from '@mui/material'
import { ChangeEvent, ElementType, useEffect, useState } from 'react'
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {imgSrc ?
                <ImgStyled src={imgSrc} alt='Profile Image' /> :
                <Box
                  sx={{
                    mb: 8.75,
                    mx: 10,
                    px: 2,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                  }}
                >
                  <Icon icon='tabler:upload' fontSize='1.75rem' />
                </Box>
              }
              <div>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload Profile Image
                  <input
                    hidden
                    type='file'
                    value={inputValue}
                    accept='image/png, image/jpeg'
                    onChange={(e) => handleInputImageChange(e)}
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
              </div>
            </Box>
          </CardContent>

        </Card>
      </Grid>
    </Grid>
  )
}

ProfileCover.acl = {
  action: 'manage',
  subject: 'profilecover'
}

export default ProfileCover
