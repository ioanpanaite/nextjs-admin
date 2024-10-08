// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import AnalyticsWebsiteAnalyticsSlider from 'src/layouts/components/analytics/AnalyticsWebsiteAnalyticsSlider'
import AnalyticsOrderVisits from 'src/layouts/components/analytics/AnalyticsOrderVisits'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import AnalyticsEarningReports from 'src/layouts/components/analytics/AnalyticsEarningReports'
import AnalyticsSupportTracker from 'src/layouts/components/analytics/AnalyticsSupportTracker'
import AnalyticsTotalEarning from 'src/layouts/components/analytics/AnalyticsTotalEarning'
import AnalyticsMonthlyCampaignState from 'src/layouts/components/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsSourceVisits from 'src/layouts/components/analytics/AnalyticsSourceVisits'

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <AnalyticsWebsiteAnalyticsSlider />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnalyticsOrderVisits />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <CardStatsWithAreaChart
              stats='97.5k'
              chartColor='success'
              avatarColor='success'
              title='Revenue Generated'
              avatarIcon='tabler:credit-card'
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsEarningReports />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsSupportTracker />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSourceVisits />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTotalEarning />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsMonthlyCampaignState />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard-page'
}

export default Dashboard
