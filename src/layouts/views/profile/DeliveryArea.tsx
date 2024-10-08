// ** MUI Components
import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import AreaData from './AreaData'
import { ChangeEvent, useState } from 'react'
import CustomRadioBasic from 'src/@core/components/custom-radio/basic'
import { Box } from '@mui/system'

interface DeliveryTabType {
  title: string
  value: string
  content: string
  isSelected?: boolean
}

const data: DeliveryTabType[] = [
  {
    title: 'Delivery',
    value: 'delivery',
    content: 'Select your delivery days to let customers know which days they can place orders for',
    isSelected: true,
  },
  {
    title: 'Collection',
    value: 'collection',
    content: 'Select your collection days and hours'
  }
]

const DeliveryArea = () => {
  const { user } = useAuth()

  return user && Object.values(user).length ? (
    <Grid container spacing={6} sx={{ mt: 2 }}>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>

        </Grid>
      </Grid>
      <Grid item lg={4} md={5} xs={12}>
        <AreaData />
      </Grid>
    </Grid>
  ) : null
}

const Collection = () => {
  const { user } = useAuth()

  return user && Object.values(user).length ? (
    <Grid container spacing={6} sx={{ mt: 2 }}>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>

        </Grid>
      </Grid>
      <Grid item lg={4} md={5} xs={12}>
        <AreaData />
      </Grid>
    </Grid>
  ) : null
}

const DevliverySelectTab = () => {
  const initialSelected: string = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // ** State
  const [selected, setSelected] = useState<string>(initialSelected)

  const handleChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelected(prop)
    } else {
      setSelected((prop.target as HTMLInputElement).value)
    }
  }

  return (
    <Grid container spacing={4}>
      {data.map((item, index) => (
        <CustomRadioBasic
          key={index}
          data={data[index]}
          selected={selected}
          name='custom-radios-basic'
          handleChange={handleChange}
          gridProps={{ sm: 6, xs: 12 }}
        />
      ))}
      {
        selected == 'delivery' ?
          <DeliveryArea />
          : <Collection />
      }
    </Grid>
  )
}

export default DevliverySelectTab
