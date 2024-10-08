// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { fetchData, updateContent } from 'src/store/apps/content'

const defaultValues = {
  siteTitle: '',
  siteDesc: '',
}

interface GlobalContent {
  siteTitle: string,
  siteDesc: string
}

const GlobalContent = () => {
  const [global, setGlobal] = useState<GlobalContent | undefined>()
  
  // ** Hook
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
  })

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.content)

  useEffect(() => {
    setGlobal(store.globalContent as GlobalContent)

    if (global) {
      const globalContent = store.globalContent as GlobalContent
      const forms = { ...globalContent }
      reset(forms)
    } else {
      dispatch(fetchData())
    }

  }, [store])


  const onSubmit = async (formData: GlobalContent) => {
    try {
      const global = { GlobalContent: formData }
      await dispatch(updateContent(global)).unwrap()

      reset(formData)
      toast.success('Updated global settings successfully')
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
                name='siteTitle'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Site Title'
                    onChange={onChange}
                    placeholder='NOM - B2B Marketplace'
                    error={Boolean(errors.siteTitle)}
                    aria-describedby='validation-schema-site-tile'
                    {...(errors.siteTitle && { helperText: errors.siteTitle.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='siteDesc'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    rows={4}
                    multiline
                    fullWidth
                    value={value}
                    label='Site Description'
                    onChange={onChange}
                    placeholder='...'
                    error={Boolean(errors.siteDesc)}
                    aria-describedby='validation-schema-site-desciption'
                    {...(errors.siteDesc && { helperText: errors.siteDesc.message })}
                  />
                )}
              />
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

export default GlobalContent
