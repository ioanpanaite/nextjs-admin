// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { refundOrder } from 'src/store/apps/order'
import CustomTextField from 'src/@core/components/mui/text-field'

type Props = {
  orderId: number
  open: boolean
  setOpen: (val: boolean) => void
}

const OrderDeleteDialog = (props: Props) => {
  // ** Props
  const { orderId, open, setOpen } = props

  // ** States
  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [reason, setReason] = useState<string>('')
  const [errorReason, setErrorReason] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  const handleConfirmation = async (value: string) => {
    if (value === 'yes') {
      try {
        if (reason) {
          console.log(reason)
          const data = { orderId, reason }
          await dispatch(refundOrder(data)).unwrap()
        } else {
          setErrorReason(true)
        }
        setReason('')
      } catch (error) {
        console.log(error)
      }
    }
    handleClose()
    setUserInput(value)
    if (value !== 'cancel') setSecondDialogOpen(true)
  }

  const handleTypingReason = (reason: string) => {
    setReason(reason)
    if (reason) setErrorReason(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              Are you sure to refund order #{orderId}?
            </Typography>

            <CustomTextField
              fullWidth
              value={reason}
              multiline
              rows={2}
              placeholder='Reason: e.g customer return'
              onChange={e => handleTypingReason(e.target.value)}
              sx={{ width: { sm: '250px', xs: '170px' } }}
              error={Boolean(errorReason)}
              {...(errorReason && { helperText: 'Reason field is required.' })}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes, Refund order!
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Refunded!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput === 'yes' ? 'Order has been refunded.' : 'Cancelled Order Refund :)'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OrderDeleteDialog
