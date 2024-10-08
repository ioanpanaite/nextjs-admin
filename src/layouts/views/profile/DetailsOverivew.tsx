// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, FormControl, InputAdornment, MenuItem, Select } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { countries } from 'src/lib/common'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
import styled from '@emotion/styled'
import { usePlacesWidget } from "react-google-autocomplete";
import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from 'next/types'
import Autocomplete from "react-google-autocomplete";
import { Loader } from "@googlemaps/js-api-loader"


const defaultValues = {
  email: '',
  businessName: '',
  businessPhone: ''
}

interface FormData {
  businessName: string
  businessPhone: string
}

interface ProfileData {
  businessName: string
  businessDesc: string
  businessAddress: string
  businessPhone: string
  businessPhoneCode: string
}

interface DetailsProps {
  googleKey: string
}

const StyledBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: '1rem',
  paddingLeft: '1rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '2px dashed rgba(47, 43, 61, 0.16)'
}))

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  businessName: yup
    .string()
    .min(3, obj => showErrors('Business Name', obj.value.length, obj.min))
    .required(),
  businessAddress: yup
    .string()
    .min(3, obj => showErrors('Business Address', obj.value.length, obj.min))
    .required(),
  businessPhone: yup
    .string()
    .min(7, obj => showErrors('Business Phone', obj.value.length, obj.min))
    .required()
})


const DetailsOverivew = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [profile, setProfile] = useState<ProfileData>()
  const [phoneCode, handlePhone] = useState<string>('44')
  const [description, setDesc] = useState(EditorState.createEmpty())
  const [descContent, setDescContent] = useState<string>('')
  const [address, setAddress] = useState<string>('')

  const { data: session } = useSession()

  // Handle Edit dialog 
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)


  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const googleKey = process.env.googleKey as string
  const loader = new Loader({
    apiKey: googleKey,
    version: "weekly",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: profileData } = await axios.get(`/api/profile/supplier/get`, { params: { email: session?.user.email } })

      if (profileData.ok) {
        setProfile({ ...profileData.result })
        reset({ ...profileData.result })

        const phoneCode = profileData.result.businessPhoneCode as string
        const address = profileData.result.businessAddress as string
        handlePhone(phoneCode)
        setAddress(address)

        try {
          const description = JSON.parse(profileData.result.businessDesc)
          const currentContent = draftToHtml(description)
          setDescContent(currentContent)

          const contentState = convertFromRaw(description);
          const content = EditorState.createWithContent(contentState)
          setDesc(content)
        } catch (error) {
          console.log(error)
        }
      }
    }

    getUserProfile()
  }, [reset])

  const onSubmit = async (profileData: FormData) => {
    try {
      const descriptionRaw = convertToRaw(description.getCurrentContent())
      const content = JSON.stringify(descriptionRaw)

      const updateData = { email: session?.user.email, ...profileData, businessAddress: address, businessDesc: content, businessPhoneCode: phoneCode }
      const { data: result } = await axios.post(`/api/profile/supplier/update`, { data: updateData })
      if (result?.ok) {
        toast.success('Updated supplier info successfully')
      }
      setProfile({ ...profileData, businessDesc: content, businessAddress: address, businessPhoneCode: phoneCode })

      // Set converted HTML content
      const currentContent = draftToHtml(descriptionRaw)
      setDescContent(currentContent)
    } catch (error: any) {
      toast.error(error?.message)
    }

    handleEditClose()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  supplier details
                </Typography>
                <Icon icon={'tabler:edit'} fontSize='1.625rem' onClick={handleEditClickOpen} />
              </Box>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Business name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{profile?.businessName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Short business description:</Typography>
                </Box>
                <StyledBox>
                  <div dangerouslySetInnerHTML={{ __html: descContent }} />
                </StyledBox>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Business address:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{profile?.businessAddress}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Business phone number:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+{profile?.businessPhoneCode}{profile?.businessPhone}</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>

          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='user-view-edit'
            aria-describedby='user-view-edit-description'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              Edit Supplier Details
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  these details will be used to help local customers connect with you on NOM
                </DialogContentText>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='businessName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Business name'
                          error={Boolean(errors.businessName)}
                          {...(errors.businessName && { helperText: errors.businessName.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <EditorWrapper>
                      <ReactDraftWysiwyg editorState={description} onEditorStateChange={data => setDesc(data)} />
                    </EditorWrapper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled placeTitle" >Business Address</label>
                    <div className='placeCover'>
                      <Autocomplete
                        className='businessAddress'
                        apiKey={googleKey}
                        defaultValue={address}
                        onPlaceSelected={(place) => {
                          setAddress(place.formatted_address)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='businessPhone'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Business phone number'
                          error={Boolean(errors.businessPhone)}
                          {...(errors.businessPhone && { helperText: errors.businessPhone.message })}
                          InputProps={{
                            startAdornment:
                              <>
                                <Select
                                  native
                                  value={phoneCode}
                                  inputProps={{
                                    name: 'phone',
                                    id: 'phone'
                                  }}
                                  sx={{
                                    width: 150,
                                    border: 'none !important',
                                    boxShadow: 'none !important'
                                  }}
                                  onChange={(e) => handlePhone(e.target.value)}
                                >
                                  {
                                    countries ? countries.map(option => {
                                      return (
                                        <option key={option.label} value={option.phone} >
                                          +{option.phone}
                                        </option>
                                      )
                                    }) :
                                      null
                                  }
                                </Select>
                              </>
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                  Submit
                </Button>
                <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )
}

DetailsOverivew.acl = {
  action: 'manage',
  subject: 'detailsoverivew'
}

export default DetailsOverivew
