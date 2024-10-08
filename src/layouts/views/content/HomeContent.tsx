// ** MUI Imports
import Card from '@mui/material/Card'
import Grid, { GridProps } from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent, { CardContentProps } from '@mui/material/CardContent'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, BoxProps, IconButton, Typography, styled } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData, updateContent } from 'src/store/apps/content'
import { useEffect } from 'react'

const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(16, 1, 1),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(16)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1)
  }
}))

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-2.375rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

interface HomeContent {
  heroTitle: string,
  items: {
    key: string,
    content: string
  }[]
}

const defaultValues = {
  heroTitle: '',
  items: [{
    key: '',
    content: ''
  }],
}

const schema = yup.object().shape({
  heroTitle: yup.string(),
  lastName: yup.string()
})

const HomeContent = () => {
  // ** Hook
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control,
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.content)

  useEffect(() => {
    dispatch(fetchData())
    if (store.homeContent) {
      const home = store.homeContent as HomeContent
      const forms = { ...home }
      reset(forms)
    }
  }, [dispatch])

  const onSubmit = async (formData: HomeContent) => {
    try {
      const home = { HomeContent: formData }
      await dispatch(updateContent(home)).unwrap()

      reset(formData)
      toast.success('Updated homepage content successfully')
    } catch (error: any) {
      toast.error(error?.message)
    }

    reset()
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='heroTitle'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Hero Title'
                    onChange={onChange}
                    placeholder='NOM'
                    error={Boolean(errors.heroTitle)}
                    aria-describedby='validation-schema-hero-tile'
                    {...(errors.heroTitle && { helperText: errors.heroTitle.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <RepeaterWrapper>
                {fields.map((field, index) => {
                  return (
                    <Box key={field.id} className='repeater-wrapper' >
                      <Grid container>
                        <RepeatingContent item xs={12}>
                          <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                            <Grid item lg={6} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                              <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                                Item
                              </Typography>
                              <CustomTextField
                                fullWidth
                                placeholder='Key'
                                {...register(`items.${index}.key`, { required: true })}
                              />
                            </Grid>
                            <Grid item lg={6} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                              <CustomTextField
                                fullWidth
                                placeholder='Content'
                                {...register(`items.${index}.content`, { required: true })}
                              />
                            </Grid>
                          </Grid>
                          <RepeaterAction>
                            <IconButton size='small' onClick={() => remove(index)}>
                              <Icon icon='tabler:x' fontSize='1.25rem' />
                            </IconButton>
                          </RepeaterAction>
                        </RepeatingContent>
                      </Grid>
                    </Box>
                  )
                })}

                <Grid container sx={{ mt: 4 }}>
                  <Grid item xs={12} sx={{ px: 0 }}>
                    <Button variant='contained' onClick={() => append({ key: '', content: '' })}>
                      Add Item
                    </Button>
                  </Grid>
                </Grid>
              </RepeaterWrapper>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default HomeContent
