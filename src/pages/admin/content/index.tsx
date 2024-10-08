import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TabContext from '@mui/lab/TabContext'
import { Box, Tab } from '@mui/material'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import GlobalContent from 'src/layouts/views/content/GlobalContent'
import Icon from 'src/@core/components/icon'
import HomeContent from 'src/layouts/views/content/HomeContent'

const Content = () => {
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <TabContext value={value}>
              <TabList onChange={handleChange} aria-label='icon tabs example'>
                <Tab value='1' label='Global' icon={<Icon icon='tabler:heart' />} />
                <Tab value='2' label='Homepage' icon={<Icon icon='tabler:user' />} />
              </TabList>
              <TabPanel value='1'>
                <GlobalContent />
              </TabPanel>
              <TabPanel value='2'>
                <HomeContent />
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Content
