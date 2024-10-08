// ** React Imports
import { FormEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TeamRole } from 'src/context/types'
import { MenuItem } from '@mui/material'

interface FormData {
  email: string
  member: string
  role: string
}

interface TableHeaderProps {
  value: string
  open: boolean
  handleDialogToggle: () => void
  handleFilter: (val: string) => void
  handleInviteMember: (val: FormData) => void
}

const roleDesc = new Map()
roleDesc.set('admin', "administrator to manage team")
roleDesc.set('processor', "processor to manage orders etc")
roleDesc.set('representative', "representative for supplier")
roleDesc.set('driver', "driver to deliver something etc")

const defaultValues = {
  email: '',
  member: '',
  role: '',
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
  email: yup.string().email().required(),
  member: yup
    .string()
    .min(3, obj => showErrors('Name', obj.value.length, obj.min))
    .required(),
})

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, open, handleDialogToggle, handleInviteMember } = props

  // ** State
  const [role, setRole] = useState<string>('processor')


  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const teamData = { ...data, role }
    console.log(teamData, '==teamData adding')
    handleInviteMember(teamData)
    handleDialogToggle()
    reset()
  }

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <CustomTextField
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search Team'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} variant='contained' onClick={handleDialogToggle}>
          Invite your team to NOM
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3' sx={{ mb: 2 }}>
            Invite team member
          </Typography>
          <Typography color='text.secondary'>you can give members different roles depending on what they need to do on NOM.</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 4,
              mx: 'auto',
              width: '100%',
              maxWidth: 360,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Controller
              name='member'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  value={value}
                  sx={{ mb: 4 }}
                  label='Name'
                  onChange={onChange}
                  placeholder='e.g. Jone Doe'
                  error={Boolean(errors.member)}
                  {...(errors.member && { helperText: errors.member.message })}
                />
              )}
            />
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  type='email'
                  label='Email'
                  value={value}
                  sx={{ mb: 4 }}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  placeholder='e.g. johndoe@email.com'
                  {...(errors.email && { helperText: errors.email.message })}
                />
              )}
            />
            <CustomTextField
              select
              fullWidth
              value={role}
              sx={{ mb: 4 }}
              label='Select Role'
              onChange={e => setRole(e.target.value)}
              SelectProps={{ value: role, onChange: e => setRole(e.target.value as string) }}
            >
              {
                Object.keys(TeamRole).map((val) =>
                  <MenuItem key={val} value={val.toLowerCase()}>
                    <Box >
                      <Typography variant='body1'>
                        {val}
                      </Typography>
                      <Typography variant='body2'>
                        {roleDesc.get(val.toLowerCase())}
                      </Typography>
                    </Box>
                  </MenuItem>
                )
              }
            </CustomTextField>
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button type='submit' variant='contained'>
                Invite
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={handleDialogToggle}>
                Discard
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
