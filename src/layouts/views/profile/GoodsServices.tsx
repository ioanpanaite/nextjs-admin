// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListProps, MenuItem, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import CustomChip from 'src/@core/components/mui/chip'
import { categories } from 'src/lib/catalogueConstant'
import { Controller, useForm } from 'react-hook-form'

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

interface FormType {
  category: string
}

const defaultValues = {
  category: '',
}

interface PropsType {
  supplierEmail: string
}

const GoodsServices = (props: PropsType) => {
  const { supplierEmail } = props
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [category, setCategory] = useState<string[]>([])

  const [needMore, setNeedMore] = useState<boolean>(false)
  const [needCategory, setNeedCategory] = useState<string[]>([])

  const { data: session } = useSession()

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => {
    setOpenEdit(false)
    setNeedMore(false)
  }

  useEffect(() => {
    const getUserProfile = async () => {
      const email = supplierEmail ? supplierEmail : session?.user?.email
      const { data: categoryData } = await axios.get(`/api/profile/category/get`, { params: { email } })

      if (categoryData.ok) {
        const selectedCategory = categoryData.info.selected ? categoryData.info.selected.split(',') : []
        const needCategory = categoryData.info.category ? categoryData.info.category.split(',') : []
        setCategory(selectedCategory)
        setNeedCategory(needCategory)
      }
    }

    getUserProfile()
  }, [])

  const onSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const categorieName = category.length > 0 ? category.join(',') : ''
      const email = supplierEmail ? supplierEmail : session?.user?.email
      const data = { categories: categorieName, email }
      const { data: result } = await axios.post('/api/profile/supplier/update', { data })
      if (result?.ok) {
        toast.success('Updated category successfully')
      }
    } catch (error: any) {
      toast.error(error?.message)
    }

    handleEditClose()
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  const submitNeedCategory = async () => {
    try {
      const categorieName = needCategory.length > 0 ? needCategory.join(',') : ''

      const email = supplierEmail ? supplierEmail : session?.user?.email
      const data = { category: categorieName, email }
      const { data: result } = await axios.post('/api/profile/category/add', { data })
      if (result?.ok) {
        toast.success('Updated category successfully')
      }
    } catch (error: any) {
      toast.error(error?.message)
    }
    setNeedMore(false)
  }

  const addNeedCategory = (data: FormType) => {
    if (data.category === ' ' || !data.category) return false

    const filtered = needCategory.find((val: string) => val === data.category)
    if (filtered) return false

    setNeedCategory([...needCategory, data.category])
    reset({ category: '' })
  }

  const handleDeleteCategory = (category: string) => {
    const filtered = needCategory.filter((val: string) => val !== category)
    setNeedCategory(filtered)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                  Goods and services
                </Typography>
                <Icon icon={'tabler:edit'} fontSize='1.625rem' onClick={handleEditClickOpen} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 8 }}>
                {category.map(value => (
                  <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                ))}
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

            <DialogContentText variant='body1' id='user-view-edit-description' sx={{ textAlign: 'center', mt: 7, px: 4 }}>
              select the categories you specialise in, this enables us to promote you in relevant searches on NOM
            </DialogContentText>
            {
              supplierEmail &&
              <Typography
                onClick={() => setNeedMore(true)}
                variant='body1'
                sx={{ mb: 4, textAlign: 'center', color: theme => theme.palette.primary.main, cursor: "default" }}
              >
                need more categories?
              </Typography>
            }

            {!needMore ?
              <form onSubmit={onSubmit}>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                  }}
                >
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        select
                        fullWidth
                        label='Select categories'
                        id='category'
                        SelectProps={{
                          MenuProps,
                          multiple: true,
                          value: category,
                          onChange: e => setCategory(e.target.value as string[]),
                          renderValue: selected => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                              {(selected as unknown as string[]).map(value => (
                                <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                              ))}
                            </Box>
                          )
                        }}
                      >
                        {needCategory.map(name => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
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
              :
              <form onSubmit={handleSubmit(addNeedCategory)}>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 8 }}>
                    {needCategory.map(value => (
                      <CustomChip onDelete={() => handleDeleteCategory(value)} key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                    ))}
                  </Box>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={10}>
                      <Controller
                        name='category'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            onChange={onChange}
                            label='Category'
                            placeholder='e.g. Meat'
                            error={Boolean(errors.category)}
                            {...(errors.category && { helperText: errors.category.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ marginTop: 4 }}>
                      <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                        <Icon icon='tabler:circle-plus' fontSize={20} />
                      </Button>
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
                  <Button onClick={submitNeedCategory} variant='contained' sx={{ mr: 2 }}>
                    Update
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </form>}
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )
}

GoodsServices.acl = {
  action: 'manage',
  subject: 'goodservices'
}

export default GoodsServices
