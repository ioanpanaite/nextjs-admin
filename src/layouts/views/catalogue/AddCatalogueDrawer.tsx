import { yupResolver } from '@hookform/resolvers/yup'
import { Box, BoxProps, Button, ButtonProps, Checkbox, CircularProgress, Drawer, FormControlLabel, Grid, IconButton, ListItemText, MenuItem, Switch, Typography, styled } from '@mui/material'
import axios from 'axios'
import { ChangeEvent, ElementType, forwardRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import { allergens, brand_supplier_values, categories, diets, keywords, lead_times, product_origin, productions, shelf_life, storages, sub_categories } from 'src/lib/catalogueConstant'
import { AppDispatch } from 'src/store'
import { addProduct } from 'src/store/apps/catalogue'
import * as yup from 'yup'

// ** Third Party Imports
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

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

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

interface SidebarAddProductType {
  open: boolean
  toggle: () => void
}

interface ProductDataType {
  code: string
  name: string
  description: string
  size: string
  quantity: string
  unit_measure: string
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

const defaultProductValues = {
  code: '',
  name: '',
  description: '',
  size: '',
  quantity: '',
  unit_measure: '',
  supplier_sku: '',
  order_unit: '',
  manufacturer: '',
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

const productSchema = yup.object().shape({
  code: yup.string().required(),
  name: yup.string().required(),
  size: yup.string().required(),
  unit_price_delivery: yup.string().required(),
})

const AddCatalogueDrawer = (props: SidebarAddProductType) => {
  // ** Props
  const { open, toggle } = props
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

  const dispatch = useDispatch<AppDispatch>()

  const {
    reset,
    control: productControl,
    handleSubmit: handleProductSubmit,
    formState: { errors: productErrors }
  } = useForm({
    defaultValues: defaultProductValues,
    resolver: yupResolver(productSchema)
  })

  const onSubmit = async (data: ProductDataType) => {
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

      const product = {
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
      }
      const productRes = await dispatch(addProduct(product)).unwrap()

      if (fileData) {
        const id = productRes.info.id as string
        const fileType = fileData?.type as string
        const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'product', fileKey: id, fileType: fileType } })
        const preSignedUrl = result.data.url

        const response = await axios.put(preSignedUrl, fileData, {
          headers: {
            "Content-type": fileType,
            "Access-Control-Allow-Origin": "*",
          },
        })
      }

    } catch (error) {
    }
    handleClose()
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    toggle()

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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 600, sm: 800, md: 1200 } } }}
    >
      <Header>
        <Typography variant='h2' style={{ textAlign: 'center' }}>Product Details</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form key={1} onSubmit={handleProductSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='code'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Code'
                    onChange={onChange}
                    placeholder='e.g 122312'
                    aria-describedby='stepper-linear-product-code'
                    error={Boolean(productErrors.code)}
                    {...(productErrors.code && { helperText: productErrors.code.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='name'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Name'
                    onChange={onChange}
                    placeholder='e.g Banana'
                    error={Boolean(productErrors.name)}
                    aria-describedby='stepper-linear-product-name'
                    {...(productErrors.name && { helperText: productErrors.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Controller
                name='description'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={3}
                    value={value}
                    label='Description'
                    onChange={onChange}
                    error={Boolean(productErrors.description)}
                    aria-describedby='stepper-linear-product-description'
                    {...(productErrors.description && { helperText: productErrors.description.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='size'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Size'
                    placeholder='e.g 6x100'
                    onChange={onChange}
                    error={Boolean(productErrors.size)}
                    aria-describedby='stepper-linear-product-size'
                    {...(productErrors.size && { helperText: productErrors.size.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='quantity'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='1'
                    value={value}
                    label='Quantity'
                    onChange={onChange}
                    error={Boolean(productErrors.quantity)}
                    aria-describedby='stepper-linear-product-quantity'
                    {...(productErrors.quantity && { helperText: productErrors.quantity.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='order_unit'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    placeholder='e.g: kg, packet, box'
                    value={value}
                    label='Order Unit'
                    onChange={onChange}
                    error={Boolean(productErrors.order_unit)}
                    aria-describedby='stepper-linear-product-order_unit'
                    {...(productErrors.order_unit && { helperText: productErrors.order_unit.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='unit_price_delivery'
                control={productControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='e.g: 20'
                    value={value}
                    label='Unit price delivery'
                    onChange={onChange}
                    error={Boolean(productErrors.unit_price_delivery)}
                    aria-describedby='stepper-linear-product-unit_price_delivery'
                    {...(productErrors.unit_price_delivery && { helperText: productErrors.unit_price_delivery.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='unit_price_collection'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='e.g: 18'
                    value={value}
                    label='Unit price collection'
                    onChange={onChange}
                    error={Boolean(productErrors.unit_price_collection)}
                    aria-describedby='stepper-linear-product-unit_price_collection'
                    {...(productErrors.unit_price_collection && { helperText: productErrors.unit_price_collection.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='rrp'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='e.g: 12'
                    value={value}
                    label='RRP'
                    onChange={onChange}
                    error={Boolean(productErrors.rrp)}
                    aria-describedby='stepper-linear-product-rrp'
                    {...(productErrors.rrp && { helperText: productErrors.rrp.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='unit_measure'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    placeholder='e.g: kg'
                    value={value}
                    label='Unit measure'
                    onChange={onChange}
                    error={Boolean(productErrors.unit_measure)}
                    aria-describedby='stepper-linear-product-measure'
                    {...(productErrors.unit_measure && { helperText: productErrors.unit_measure.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='supplier_sku'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type='number'
                    placeholder='1'
                    label='Supplier sku'
                    onChange={onChange}
                    error={Boolean(productErrors.supplier_sku)}
                    aria-describedby='stepper-linear-product-measure'
                    {...(productErrors.supplier_sku && { helperText: productErrors.supplier_sku.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name='ingredients'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Ingredients'
                    onChange={onChange}
                    error={Boolean(productErrors.ingredients)}
                    aria-describedby='stepper-linear-product-ingredients'
                    {...(productErrors.ingredients && { helperText: productErrors.ingredients.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='manufacturer'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Manufacturer'
                    onChange={onChange}
                    error={Boolean(productErrors.manufacturer)}
                    aria-describedby='stepper-linear-product-manufacturer'
                    {...(productErrors.manufacturer && { helperText: productErrors.manufacturer.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='nutritional_value'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nutritional information per serving'
                    onChange={onChange}
                    error={Boolean(productErrors.nutritional_value)}
                    aria-describedby='stepper-linear-product-nutritional_value'
                    {...(productErrors.nutritional_value && { helperText: productErrors.nutritional_value.message })}
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
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='minimum order quantity'
                    onChange={onChange}
                    placeholder='e.g £100 or less'
                    error={Boolean(productErrors.minimum_order_quantity)}
                    aria-describedby='stepper-minimum_order_quantity'
                    {...(productErrors.minimum_order_quantity && { helperText: productErrors.minimum_order_quantity.message })}
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
                  selected={startDate}
                  startDate={startDate}
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
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    placeholder='e.g: % off'
                    value={value}
                    label='Promotion'
                    onChange={onChange}
                    error={Boolean(productErrors.promotion)}
                    aria-describedby='stepper-linear-promotion'
                    {...(productErrors.promotion && { helperText: productErrors.promotion.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Controller
                name='variants'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Product Variants'
                    onChange={onChange}
                    placeholder='e.g. 6'
                    error={Boolean(productErrors.variants)}
                    aria-describedby='stepper-linear-product-variants'
                    {...(productErrors.variants && { helperText: productErrors.variants.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Controller
                name='min_order_per_product_type'
                control={productControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Min order per product type'
                    onChange={onChange}
                    error={Boolean(productErrors.min_order_per_product_type)}
                    aria-describedby='stepper-linear-min_order_per_product_type'
                    {...(productErrors.min_order_per_product_type && { helperText: productErrors.min_order_per_product_type.message })}
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
                  <ButtonStyled sx={{ px: 0 }} component='label' variant='contained' htmlFor='product-upload-image'>
                    <Icon icon='tabler:upload' fontSize='1.75rem' />
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept='image/png, image/jpeg'
                      onChange={(e) => handleInputImageChange(e)}
                      id='product-upload-image'
                    />
                  </ButtonStyled>
                </Box>
              }
              <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControlLabel label='Publish' control={<Switch checked={checked} onChange={handleChange} />} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleClose} variant='tonal'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress color='info' sx={{ width: '18px !important', height: '18px !important' }} /> : "Add"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddCatalogueDrawer
