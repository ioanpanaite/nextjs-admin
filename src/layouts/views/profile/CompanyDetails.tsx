// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import { Loader } from '@googlemaps/js-api-loader'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem } from '@mui/material'
import Alert from '@mui/material/Alert'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Autocomplete from "react-google-autocomplete"
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { useAuth } from 'src/hooks/useAuth'
import { lead_times, prod_values } from 'src/lib/catalogueConstant'
import { AppDispatch, RootState } from 'src/store'
import { CompanyDetailsType, fetchCompany, updateCompany } from 'src/store/apps/company'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

interface FileProp {
  name: string
  type: string
  size: number
}

interface FormDetails {
  minOrder: string
  productCover: string
  productTitle: string
  productText: string
}

const defaultValues = {
  minOrder: '',
  productCover: '',
  productTitle: '',
  productText: '',
}

const CompanyDetails = () => {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [status, setStatus] = useState<boolean>(false)
  const [prodValue, setProdValue] = useState<string[]>([])
  const [company, setCompany] = useState<CompanyDetailsType>()
  const [files, setFiles] = useState<File[]>([])
  const userAuth = useAuth()
  const [foundIn, setFoundIn] = useState<string>('')
  const [basedIn, setBasedIn] = useState<string>('')
  const [shipsFrom, setShipsFrom] = useState<string>('')
  const [productMadeIn, setProductMadeIn] = useState<string>('')
  const [requiredError, setRequiredError] = useState<boolean>(false)
  const [leadTime, setLeadTime] = useState<string>('')

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Hook
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.company)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    const getSupplierCompany = async () => {
      await dispatch(fetchCompany()).unwrap()
      const companyDetails = store.data as CompanyDetailsType

      setCompany(companyDetails)
      reset(companyDetails)

      const values = companyDetails.values?.split(',')
      setProdValue(values)
      setStatus(true)
    }

    if (!status) getSupplierCompany()
    else {
      const companyDetails = store.data as CompanyDetailsType

      setCompany(companyDetails)
      reset(companyDetails)
      const values = companyDetails.values?.split(',')
      setProdValue(values)

      setFoundIn(companyDetails.foundedIn)
      setBasedIn(companyDetails.basedIn)
      setShipsFrom(companyDetails.shipsFrom)
      setProductMadeIn(companyDetails.productMadeIn)
      setLeadTime(companyDetails.leadTime)
    }

  }, [reset, store])

  const googleKey = process.env.googleKey as string
  const loader = new Loader({
    apiKey: googleKey,
    version: "weekly",
  });

  const onSubmit = async (details: FormDetails) => {
    try {
      if (!foundIn || !basedIn || !shipsFrom || !productMadeIn) {
        setRequiredError(true)

        return false
      }

      const fileData = files[0]
      let promoteUrl = ''

      if (fileData) {
        const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'companypromote', fileKey: userAuth.user?.id, email: userAuth.user?.email, fileType: fileData.type } })
        const preSignedUrl = result.data.url

        const response = await axios.put(preSignedUrl, fileData, {
          headers: {
            "Content-type": fileData.type,
            "Access-Control-Allow-Origin": "*",
          },
        })
        if (response.statusText === "OK") {
          toast.success('Company promote cover updated successfully.')
          promoteUrl = preSignedUrl.split('?')[0]
          setFiles([])
        }
      }

      const data = promoteUrl ?
        {
          ...details,
          values: prodValue.join(','),
          foundedIn: foundIn,
          basedIn: basedIn,
          shipsFrom: shipsFrom,
          productMadeIn: productMadeIn,
          leadTime: leadTime,
          productCover: promoteUrl
        } :
        {
          ...details,
          values: prodValue.join(','),
          leadTime: leadTime,
          basedIn: basedIn,
          shipsFrom: shipsFrom,
          productMadeIn: productMadeIn,
          foundedIn: foundIn
        }
      const result = await dispatch(updateCompany(data)).unwrap()

      if (result?.ok) {
        toast.success('Updated company details successfully')
      }
    } catch (error: any) {
      toast.error(error?.message)
    }

    handleEditClose()
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'video/*': ['.mp4', '.mpg'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const fileContent = files.map((file: FileProp) => {
    if (file.type.includes('image')) {
      return (
        <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
      )
    } else {
      return (
        <Box key={file.name} sx={{
          backgroundColor: theme => theme.palette.primary.light,
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: "center"
        }}>
          <img alt={file.name} src={'/images/video.svg'} width={50} height={50} />
        </Box>
      )
    }
  })

  const handleCoverType = () => {
    if (company?.productCover?.includes('.mp4') || company?.productCover?.includes('.mpg')) {
      return true
    }

    return false
  }


  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  Company Details
                </Typography>
                <Icon icon={'tabler:edit'} fontSize='1.625rem' onClick={handleEditClickOpen} />
              </Box>
              <Box sx={{ pt: 4 }}>
                {company?.foundedIn && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Founded In:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.foundedIn}
                  </Typography>
                </Box>}
                {company?.basedIn && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Based In: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.basedIn}
                  </Typography>
                </Box>}
                {company?.shipsFrom && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Ships from: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.shipsFrom}
                  </Typography>
                </Box>}
                {company?.productMadeIn && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Product made in: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.productMadeIn}
                  </Typography>
                </Box>}
                {company?.leadTime && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Lead time: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.leadTime}
                  </Typography>
                </Box>}
                {company?.minOrder && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Min order: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.minOrder}
                  </Typography>
                </Box>}
                {company?.values && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Values: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.values}
                  </Typography>
                </Box>}
                {company?.productText && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Description: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.productText}
                  </Typography>
                </Box>}
                {company?.productTitle && <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Title: </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {company?.productTitle}
                  </Typography>
                </Box>}
                {company?.productCover && <Box sx={{ mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Promote Cover: </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: "center"
                  }}>
                    {handleCoverType() ?
                      <>
                        <video width="100%" height="100%" controls>
                          <source src={company?.productCover} type="video/mp4" />
                        </video>
                      </> :
                      <img className='promote-file-image' alt={company?.productTitle} src={company?.productCover} />
                    }
                  </Box>
                </Box>}
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
              Edit Company Details
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  make your company details visible on your NOM supplier profile
                  {requiredError && <Alert severity='error'>Required (Founded In, Based in, Ships from, Product made in)</Alert>}
                </DialogContentText>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled placeTitle" >Founded In</label>
                    <div className='placeCover'>
                      <Autocomplete
                        className='businessAddress'
                        apiKey={googleKey}
                        defaultValue={foundIn}
                        placeholder='e.g Paris'
                        onPlaceSelected={(place) => {
                          setFoundIn(place.formatted_address)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled placeTitle" >Based in</label>
                    <div className='placeCover'>
                      <Autocomplete
                        className='businessAddress'
                        apiKey={googleKey}
                        defaultValue={basedIn}
                        placeholder='e.g London'
                        onPlaceSelected={(place) => {
                          setBasedIn(place.formatted_address)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled placeTitle" >Ships from</label>
                    <div className='placeCover'>
                      <Autocomplete
                        className='businessAddress'
                        apiKey={googleKey}
                        defaultValue={shipsFrom}
                        placeholder='e.g London'
                        onPlaceSelected={(place) => {
                          setShipsFrom(place.formatted_address)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label className="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-sizeSmall MuiInputLabel-filled placeTitle" >Product made in</label>
                    <div className='placeCover'>
                      <Autocomplete
                        className='businessAddress'
                        apiKey={googleKey}
                        defaultValue={productMadeIn}
                        placeholder='e.g London'
                        onPlaceSelected={(place) => {
                          setProductMadeIn(place.formatted_address)
                        }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      value={leadTime}
                      sx={{ mb: 4 }}
                      label='Lead Time'
                      onChange={e => setLeadTime(e.target.value)}
                      SelectProps={{ value: leadTime, onChange: e => setLeadTime(e.target.value as string) }}
                    >
                      {lead_times.map(val => (<MenuItem key={val} value={val}>{val}</MenuItem>))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='minOrder'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Min Order'
                          error={Boolean(errors.minOrder)}
                          {...(errors.minOrder && { helperText: errors.minOrder.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      label='Values'
                      id='values'
                      SelectProps={{
                        MenuProps,
                        multiple: true,
                        value: prodValue,
                        onChange: e => setProdValue(e.target.value as string[]),
                        renderValue: selected => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            {(selected as unknown as string[]).map(value => (
                              <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                            ))}
                          </Box>
                        )
                      }}
                    >
                      {prod_values.map(name => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='productText'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          multiline
                          rows={4}
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Description'
                          placeholder='Describe your content'
                          error={Boolean(errors.productText)}
                          {...(errors.productText && { helperText: errors.productText.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='productTitle'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          onChange={onChange}
                          label='Title'
                          error={Boolean(errors.productTitle)}
                          {...(errors.productTitle && { helperText: errors.productTitle.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>Promote your Company</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'text.disabled' }}>Use this section to show your buyers what you company is about. You can upload a company/product promo video or image and description.</Typography>
                    <DropzoneWrapper sx={{ marginTop: 4 }}>
                      <Box {...getRootProps({ className: 'dropzone' })} sx={files.length ? { height: 300, minHeight: 200 } : { minHeight: 200 }}>
                        <input {...getInputProps()} />
                        {files.length ? (
                          fileContent
                        ) : (
                          <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <Box
                              sx={{
                                mb: 8.75,
                                width: 48,
                                height: 48,
                                display: 'flex',
                                borderRadius: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Icon icon='tabler:upload' fontSize='1.75rem' />
                            </Box>
                            <Typography variant='h4' sx={{ mb: 1 }}>
                              Click to upload a file
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                              (Upload a company/product promo video or image.)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </DropzoneWrapper>
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
    </Grid >
  )
}

CompanyDetails.acl = {
  action: 'manage',
  subject: 'CompanyDetails'
}

export default CompanyDetails
