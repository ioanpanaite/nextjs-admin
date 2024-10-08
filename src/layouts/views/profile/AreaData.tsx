// ** MUI Components
import Box from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ProfileTabCommonType, ProfileTeamsType } from 'src/types/apps/profileTypes'

import { UserDataType } from 'src/context/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { Button, CardActions, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, FormControl, InputAdornment, MenuItem, Select } from '@mui/material'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import UserSuspendDialog from '../user/view/UserSubscriptionDialog'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateUser } from 'src/store/apps/user'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import axios from 'axios'

interface ColorsType {
  [key: string]: ThemeColor
}

const defaultValues = {
  locationName: '',
  minOrder: 0
}

interface FormData {
  locationName: string,
  minOrder: number
}

interface WeekTime {
  key: number
  cutoff_day: number
  cutoff_time: string
}

type CustomCheckboxBasicData = {
  value: WeekTime
  content?: ReactNode
  isSelected?: boolean
} & (
    | {
      meta: ReactNode
      title: ReactNode
    }
    | {
      meta?: never
      title?: never
    }
    | {
      title: ReactNode
      meta?: never
    }
  )

type CustomCheckboxBasicProps = {
  name: string
  color?: ThemeColor
  selected: WeekTime[]
  gridProps: GridProps
  data: CustomCheckboxBasicData
  handleChange: (value: WeekTime, cutoff: boolean) => void
  handleSelected: (value: WeekTime[]) => void
}

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
  locationName: yup
    .string()
    .min(3, obj => showErrors('Location Name', obj.value.length, obj.min))
    .required(),
  minOrder: yup
    .number()
    .required()
})

const cutoffTime: CustomCheckboxBasicData[] = [
  {
    value: { key: 6, cutoff_day: 5, cutoff_time: '21:00' },
    title: 'Sunday',
    content: 'cut off time'
  },
  {
    value: { key: 0, cutoff_day: 6, cutoff_time: '21:00' },
    title: 'Monday',
    content: 'cut off time'
  },
  {
    value: { key: 1, cutoff_day: 0, cutoff_time: '21:00' },
    title: 'Tuesday',
    content: 'cut off time'
  },
  {
    value: { key: 2, cutoff_day: 1, cutoff_time: '21:00' },
    title: 'Wednesday',
    content: 'cut off time'
  },
  {
    value: { key: 3, cutoff_day: 2, cutoff_time: '21:00' },
    title: 'Thursday',
    content: 'cut off time'
  },
  {
    value: { key: 4, cutoff_day: 3, cutoff_time: '21:00' },
    title: 'Friday',
    content: 'cut off time'
  },
  {
    value: { key: 5, cutoff_day: 4, cutoff_time: '21:00' },
    title: 'Saturday',
    content: 'cut off time'
  }
]

const AreaData = () => {
  const dispatch = useDispatch<AppDispatch>()
  const initialSelected: WeekTime[] = cutoffTime.filter(item => item.isSelected).map(item => item.value)

  // ** State
  const [selected, setSelected] = useState<WeekTime[]>(initialSelected)

  const handleChange = (value: WeekTime, cutoff: boolean) => {
    const selectWeekTime = selected.find(val => val.key === value.key)
    if (selectWeekTime) {
      if (cutoff) {
        const updatedArr = selected.filter(item => item.key !== value.key)
        setSelected([...updatedArr, value])
      } else {
        const updatedArr = selected.filter(item => item.key !== value.key)
        setSelected(updatedArr)
      }
    } else {
      setSelected([...selected, value])
    }
  }

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

  const handleCancel = () => {
    reset()
    setSelected([])
  }

  const onSubmit = async (deliveryArea: FormData) => {
    try {
      console.log(deliveryArea, '===deliveryArea')
      
      // await dispatch(updateUser({ ...profileData })).unwrap()

      // toast.success('Updated profile info successfully')
    } catch (error: any) {
      toast.error(error?.message)
    }

  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='locationName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        label='Location Name'
                        error={Boolean(errors.locationName)}
                        {...(errors.locationName && { helperText: errors.locationName.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name='minOrder'
                    control={control}
                    rules={{ required: true }}
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
                <Grid item xs={12} sm={12}>
                  Delivery days and cut off time
                </Grid>
                <Grid item xs={12} sm={12}>
                  {cutoffTime.map((item, index) => (
                    <CustomCheckbox
                      key={index}
                      data={cutoffTime[index]}
                      selected={selected}
                      handleChange={handleChange}
                      handleSelected={setSelected}
                      name='custom-checkbox-basic'
                      gridProps={{ sm: 12, xs: 12 }}
                    />
                  ))}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                    Submit
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={handleCancel}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

const CustomCheckbox = (props: CustomCheckboxBasicProps) => {
  // ** Props
  const { data, name, selected, gridProps, handleChange, handleSelected, color = 'primary' } = props

  const { title, value, content } = data

  const timeList = () => {
    const item = []
    for (let i = 1; i < 24; i++) {
      item.push(<MenuItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>{`${i.toString().padStart(2, '0')}:00`}</MenuItem>)
      item.push(<MenuItem key={`${i}-30`} value={`${i.toString().padStart(2, '0')}:30`}>{`${i.toString().padStart(2, '0')}:30`}</MenuItem>)
    }
    
    return item
  }

  const handleWeek = (e: any) => {
    e.preventDefault()
    const updateVal = { ...value, cutoff_day: e.target.value }
    handleChange(updateVal, true)
  }

  const handleTime = (e: any) => {
    e.preventDefault()
    const updateVal = { ...value, cutoff_time: e.target.value }
    handleChange(updateVal, true)
  }

  const handleCheckBox = () => {
    const selectedCheck = selected.find(val => val.key === value.key)
    
    return selectedCheck ? true : false
  }

  const renderData = () => {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {typeof title === 'string' ? <Typography onClick={() => handleChange(value, false)} sx={{ mb: 1, fontWeight: 500 }}>{title}</Typography> : title}
        {
          handleCheckBox() ? (
            <>
              {typeof content === 'string' ? <Typography variant='body2'>{content}</Typography> : content}
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl variant='standard'>
                    <Select
                      name='week'
                      label='Week'
                      defaultValue={value.cutoff_day}
                      id='demo-simple-select-outlined'
                      labelId='demo-simple-select-outlined-label'
                      onChange={handleWeek}
                    >
                      {cutoffTime.map((val) => <MenuItem key={val.value.key} value={val.value.key}>{val.title}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant='standard'>
                    <Select
                      name='time'
                      label='Time'
                      defaultValue={value.cutoff_time}
                      id='demo-simple-select-outlined'
                      labelId='demo-simple-select-outlined-label'
                      onChange={handleTime}
                    >
                      {timeList()}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          ) : null
        }
      </Box >
    )
  }

  const renderComponent = () => {
    return (
      <Grid item {...gridProps}>
        <Box
          sx={{
            p: 4,
            mt: 4,
            height: '100%',
            display: 'flex',
            borderRadius: 1,
            cursor: 'pointer',
            position: 'relative',
            alignItems: 'flex-start',
            border: theme => `1px solid ${theme.palette.divider}`,
            ...(selected.includes(value)
              ? { borderColor: `${color}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } })
          }}
        >
          <Checkbox
            size='small'
            color={color}
            name={`${name}-${value}`}
            checked={handleCheckBox()}
            sx={{ mb: -2, mt: -2.5, ml: -2.75 }}
            onChange={() => handleChange(value, false)}
          />
          {renderData()}
        </Box>
      </Grid>
    )
  }

  return data ? renderComponent() : null
}

export default AreaData
