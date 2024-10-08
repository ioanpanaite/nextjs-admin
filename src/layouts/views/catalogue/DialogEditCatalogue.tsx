// ** React Imports
import { ChangeEvent, Dispatch, ElementType, ReactElement, Ref, SetStateAction, forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { ButtonProps, Checkbox, CircularProgress, FormControlLabel, ListItemText, MenuItem, Switch } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { allergens, brand_supplier_values, categories, diets, keywords, lead_times, product_origin, productions, shelf_life, storages, sub_categories } from 'src/lib/catalogueConstant'
import { AppDispatch, RootState } from 'src/store'
import { CatalogueType, updateCatalogue } from 'src/store/apps/catalogue'
import * as yup from 'yup'

import axios from 'axios'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getRandomCode } from 'src/lib/utils'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

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

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

type Props = {
  show: boolean;
  id: string | number;
  setShow: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  product_code: string
  product_name: string
  description: string
  product_size_per_unit: string
  price_per_unit_measure: string
  quantity: string
  supplier_sku: string
  manufacturer: string
  order_unit: string
  unit_price_delivery: string
  unit_price_collection: string
  rrp: string
  ingredients: string
  nutritional_value: string
  variants: string
  min_order_per_product_type: string
  minimum_order_quantity: string
  promotion: string
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
  product_code: yup
    .string()
    .min(3, obj => showErrors('Product Code', obj.value.length, obj.min))
    .required(),
  product_name: yup
    .string()
    .min(3, obj => showErrors('Product Name', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  product_code: '',
  product_name: '',
  description: '',
  product_size_per_unit: '',
  price_per_unit_measure: '',
  quantity: '',
  supplier_sku: '',
  manufacturer: '',
  order_unit: '',
  unit_price_delivery: '',
  unit_price_collection: '',
  rrp: '',
  ingredients: '',
  nutritional_value: '',
  variants: '',
  min_order_per_product_type: '',
  minimum_order_quantity: '',
  promotion: ''
}

const DialogEditCatalogue = (props: Props) => {
  const { show, setShow, id } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)

  const [imgSrc, setImgSrc] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [category, setCategory] = useState<string[]>([])
  const [subCategory, setSubCategory] = useState<string[]>([])
  const [keyword, setKeyword] = useState<string[]>([])
  const [diet, setDiet] = useState<string[]>([])
  const [brandValues, setBrandValues] = useState<string[]>([])
  const [storage, setStorage] = useState<string[]>([])
  const [production, setProduction] = useState<string[]>([])
  const [allergen, setAllergen] = useState<string[]>([])
  const [leadTime, setLeadTime] = useState<string[]>([])
  const [shelf, setShelfLife] = useState<string>(shelf_life[0])
  const [productOrigin, setProductOrigin] = useState<string>(product_origin[0])

  const [startDate, setStartDate] = useState<DateType>(new Date())
  const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15))
  const [fileData, setFileData] = useState<File>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const catalogue = useSelector((state: RootState) => state.catalogue)
  const dispatch = useDispatch<AppDispatch>()

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

  useEffect(() => {
    const values = catalogue?.data.find((v: any) => v.id == id)
    if (values) {
      const catalogueData = values as CatalogueType
      const visible = catalogueData.visible as boolean

      setChecked(visible)
      reset(values)

      const selectedCategory = catalogueData.category ? catalogueData.category.split(',') : []
      const selectedSubCategory = catalogueData.sub_category ? catalogueData.sub_category.split(',') : []
      const selectedKeyword = catalogueData.keyword ? catalogueData.keyword.split(',') : []
      const selectedDiet = catalogueData.diet ? catalogueData.diet.split(',') : []
      const selectedBrand = catalogueData.brand_supplier_values ? catalogueData.brand_supplier_values.split(',') : []
      const selectedStorage = catalogueData.storage ? catalogueData.storage.split(',') : []
      const selectedProduction = catalogueData.production ? catalogueData.production.split(',') : []
      const selectedAllergen = catalogueData.allergen ? catalogueData.allergen.split(',') : []
      const selectedLeadTime = catalogueData.lead_time ? catalogueData.lead_time.split(',') : []

      // Considerate this in the future
      // const shipWindow = catalogueData.ship_window ? catalogueData.ship_window.split('-') : []

      setCategory(selectedCategory)
      setSubCategory(selectedSubCategory)
      setKeyword(selectedKeyword)
      setDiet(selectedDiet)
      setBrandValues(selectedBrand)
      setStorage(selectedStorage)
      setProduction(selectedProduction)
      setAllergen(selectedAllergen)
      setLeadTime(selectedLeadTime)
      setImgSrc(catalogueData.product_image)
    }
  }, [reset, catalogue])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const categorieName = category.length > 0 ? category.join(',') : ''
      const subCategoryName = subCategory.length > 0 ? subCategory.join(',') : ''
      const keywordName = keyword.length > 0 ? keyword.join(',') : ''
      const dietName = diet.length > 0 ? diet.join(',') : ''
      const brandValuesName = brandValues.length > 0 ? brandValues.join(',') : ''
      const storageName = storage.length > 0 ? storage.join(',') : ''
      const productionName = production.length > 0 ? production.join(',') : ''
      const allergenName = allergen.length > 0 ? allergen.join(',') : ''
      const leadTimeName = leadTime.length > 0 ? leadTime.join(',') : ''
      const ship_window = `${format((startDate as Date), 'dd/MM/yyyy')}-${format((endDate as Date), 'dd/MM/yyyy')}`

      let updateData = {
        id,
        ...data,
        visible: checked,
        category: categorieName,
        sub_category: subCategoryName,
        keyword: keywordName,
        diet: dietName,
        brand_supplier_values: brandValuesName,
        storage: storageName,
        production: productionName,
        allergen: allergenName,
        lead_time: leadTimeName,
        shelf_life: shelf,
        product_origin: productOrigin,
        ship_window
      } as CatalogueType

      if (fileData) {
        const fileType = fileData?.type as string
        const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'updateproduct', fileKey: `${id}-${getRandomCode()}`, fileType: fileType } })
        const preSignedUrl = result.data.url

        const response = await axios.put(preSignedUrl, fileData, {
          headers: {
            "Content-type": fileType,
            "Access-Control-Allow-Origin": "*",
          },
        })

        if (response) {
          const productImage = preSignedUrl.split('?')[0]
          updateData = { ...updateData, product_image: productImage } as CatalogueType
        }
      }

      const productRes = await dispatch(updateCatalogue(updateData)).unwrap()

      reset()
      setShow(false)
      setLoading(false)

    } catch (error) {

    }
  }

  const handleClose = () => {
    reset()
    setShow(false)
    setLoading(false)

    setImgSrc('')
    setCategory([])
    setSubCategory([])
    setKeyword([])
    setDiet([])
    setBrandValues([])
    setStorage([])
    setProduction([])
    setAllergen([])
    setLeadTime([])
    setStartDate(new Date())
    setEndDate(new Date())
  }


  const handleInputImageChange = async (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = async () => {
        setImgSrc(reader.result as string)
      }
      reader.readAsDataURL(files[0])
      setFileData(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }

    }
  }

  const handleRefreshImage = () => {
    setImgSrc('')
  }

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = format(props.start, 'dd/MM/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <CustomTextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  })


  return (
    <>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        onBackdropClick={() => handleClose()}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={() => setShow(false)}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Edit Catalogue Infomation
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='product_code'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      label='Product Code'
                      error={Boolean(errors.product_code)}
                      {...(errors.product_code && { helperText: errors.product_code.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='product_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onChange={onChange}
                      label='Product Name'
                      error={Boolean(errors.product_name)}
                      {...(errors.product_name && { helperText: errors.product_name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      rows={3}
                      multiline
                      label='Description'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.description)}
                      {...(errors.description && { helperText: errors.description.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='product_size_per_unit'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Product size / unit'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.product_size_per_unit)}
                      {...(errors.product_size_per_unit && { helperText: errors.product_size_per_unit.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='price_per_unit_measure'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Price / unit measure'
                      value={value}
                      placeholder='e.g: kg'
                      onChange={onChange}
                      error={Boolean(errors.price_per_unit_measure)}
                      {...(errors.price_per_unit_measure && { helperText: errors.price_per_unit_measure.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='quantity'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Quantity'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.quantity)}
                      {...(errors.quantity && { helperText: errors.quantity.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='order_unit'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      placeholder='e.g: kg, packet, box'
                      value={value}
                      label='Order Unit'
                      onChange={onChange}
                      error={Boolean(errors.order_unit)}
                      aria-describedby='stepper-linear-product-order_unit'
                      {...(errors.order_unit && { helperText: errors.order_unit.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='unit_price_delivery'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      placeholder='e.g: 20'
                      value={value}
                      label='Unit price delivery'
                      onChange={onChange}
                      error={Boolean(errors.unit_price_delivery)}
                      aria-describedby='stepper-linear-product-unit_price_delivery'
                      {...(errors.unit_price_delivery && { helperText: errors.unit_price_delivery.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='unit_price_collection'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      placeholder='e.g: 18'
                      value={value}
                      label='Unit price collection'
                      onChange={onChange}
                      error={Boolean(errors.unit_price_collection)}
                      aria-describedby='stepper-linear-product-unit_price_collection'
                      {...(errors.unit_price_collection && { helperText: errors.unit_price_collection.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='rrp'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      placeholder='e.g: 12'
                      value={value}
                      label='RRP'
                      onChange={onChange}
                      error={Boolean(errors.rrp)}
                      aria-describedby='stepper-linear-product-rrp'
                      {...(errors.rrp && { helperText: errors.rrp.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='supplier_sku'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Supplier sku'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.supplier_sku)}
                      {...(errors.supplier_sku && { helperText: errors.supplier_sku.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  name='manufacturer'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label='Manufacturer'
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.manufacturer)}
                      {...(errors.manufacturer && { helperText: errors.manufacturer.message })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <Controller
                  name='nutritional_value'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Nutritional information per serving'
                      onChange={onChange}
                      error={Boolean(errors.nutritional_value)}
                      aria-describedby='stepper-linear-product-nutritional_value'
                      {...(errors.nutritional_value && { helperText: errors.nutritional_value.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Category'
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
                  {categories.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Sub Category'
                  id='sub_category'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: subCategory,
                    onChange: e => setSubCategory(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {sub_categories.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Keyword'
                  id='keyword'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: keyword,
                    onChange: e => setKeyword(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {keywords.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  SelectProps={{ value: shelf, onChange: e => setShelfLife(e.target.value as string) }}
                  label='Shelf life'
                  id='shelf_life'
                  sx={{ width: '100%' }}
                >
                  {shelf_life.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name='minimum_order_quantity'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='minimum order quantity'
                      onChange={onChange}
                      placeholder='e.g £100 or less'
                      error={Boolean(errors.minimum_order_quantity)}
                      aria-describedby='stepper-minimum_order_quantity'
                      {...(errors.minimum_order_quantity && { helperText: errors.minimum_order_quantity.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Diet'
                  id='diet'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: diet,
                    onChange: e => setDiet(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {diets.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Brand/Supplier Values'
                  id='brand_supplier_values'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: brandValues,
                    onChange: e => setBrandValues(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {brand_supplier_values.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Storage'
                  id='storage'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: storage,
                    onChange: e => setStorage(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {storages.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Production'
                  id='production'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: production,
                    onChange: e => setProduction(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {productions.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Allergen'
                  id='allergen'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: allergen,
                    onChange: e => setAllergen(e.target.value as string[]),
                    renderValue: selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(selected as unknown as string[]).map(value => (
                          <CustomChip key={value} label={value} sx={{ m: 0.75 }} skin='light' color='primary' />
                        ))}
                      </Box>
                    )
                  }}
                >
                  {allergens.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue=''
                  SelectProps={{ value: productOrigin, onChange: e => setProductOrigin(e.target.value as string) }}
                  label='Product Origin'
                  id='product_origin'
                  sx={{ width: '100%' }}
                >
                  {product_origin.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePickerWrapper>
                  <DatePicker
                    selectsRange
                    endDate={endDate}
                    startDate={startDate}
                    selected={startDate}
                    id='date-range-picker'
                    onChange={handleOnChange}
                    shouldCloseOnSelect={false}
                    popperPlacement={'bottom-start'}
                    customInput={
                      <CustomInput label='Ship Window' start={startDate as Date | number} end={endDate as Date | number} />
                    }
                  />
                </DatePickerWrapper>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Lead Time'
                  id='lead_time'
                  SelectProps={{
                    MenuProps,
                    multiple: true,
                    value: leadTime,
                    onChange: e => setLeadTime(e.target.value as string[]),
                    renderValue: selected => (selected as unknown as string[]).join(', ')
                  }}
                >
                  {lead_times.map(name => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={leadTime.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name='promotion'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      placeholder='e.g: % off'
                      value={value}
                      label='Promotion'
                      onChange={onChange}
                      error={Boolean(errors.promotion)}
                      aria-describedby='stepper-linear-promotion'
                      {...(errors.promotion && { helperText: errors.promotion.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name='variants'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Product Variants'
                      onChange={onChange}
                      placeholder='e.g. 6'
                      error={Boolean(errors.variants)}
                      aria-describedby='stepper-linear-product-variants'
                      {...(errors.variants && { helperText: errors.variants.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Controller
                  name='min_order_per_product_type'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label='Min order per product type'
                      onChange={onChange}
                      error={Boolean(errors.min_order_per_product_type)}
                      aria-describedby='stepper-linear-min_order_per_product_type'
                      {...(errors.min_order_per_product_type && { helperText: errors.min_order_per_product_type.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography sx={{ mb: 4, }}>Product Image</Typography>
                {imgSrc ?
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImgStyled src={imgSrc} alt='Product Image' />
                      <Icon onClick={handleRefreshImage} icon='tabler:refresh' fontSize='1.75rem' />
                    </Box>
                  </> :
                  <Box
                    sx={{
                      mb: 8.75,
                      mx: 10,
                      px: 2,
                      width: 48,
                      height: 48,
                      display: 'flex',
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                    }}
                  >
                    <ButtonStyled sx={{ px: 0 }} component='label' variant='contained' htmlFor='product-update-upload-image'>
                      <Icon icon='tabler:upload' fontSize='1.75rem' />
                      <input
                        hidden
                        type='file'
                        value={inputValue}
                        accept='image/png, image/jpeg'
                        onChange={(e) => handleInputImageChange(e)}
                        id='product-update-upload-image'
                      />
                    </ButtonStyled>
                  </Box>
                }
                <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel label='Publish' control={<Switch checked={checked} onChange={handleChange} />} />
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

            <Button type='submit' variant='contained' sx={{ mr: 1 }} disabled={loading}>
              {loading ? <CircularProgress color='info' sx={{ width: '18px !important', height: '18px !important' }} /> : "Submit"}
            </Button>
            <Button variant='tonal' color='secondary' onClick={() => handleClose()}>
              Discard
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default DialogEditCatalogue
