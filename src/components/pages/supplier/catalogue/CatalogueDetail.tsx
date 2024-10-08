import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, BoxProps, Button, ButtonProps, Card, CardContent, Checkbox, CircularProgress, Drawer, FormControlLabel, Grid, IconButton, ListItemText, MenuItem, Switch, Typography, styled } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, ElementType, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'src/@core/components/icon';
import CustomChip from 'src/@core/components/mui/chip';
import CustomTextField from 'src/@core/components/mui/text-field';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import { allergens, brand_supplier_values, categories, diets, lead_times, orderUnits, product_origin, productions, shelf_life, storages, subCategories, unitMeasures } from 'src/lib/catalogueConstant';
import { getRandomCode } from 'src/lib/utils';
import { AppDispatch, RootState } from 'src/store';
import { CatalogueType, addProduct, updateCatalogue } from 'src/store/apps/catalogue';
import * as yup from 'yup';

// ** Third Party Imports
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { DateType } from 'src/types/forms/reactDatepickerTypes';

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
  id: number | string
}

interface ProductDataType {
  product_code: string
  product_name: string
  description: string
  product_size_per_unit: string
  quantity: string
  unit_measure: string
  supplier_sku: string
  manufacturer: string
  order_unit: string
  unit_price: string
  unit_price_delivery: string
  unit_price_collection: string
  rrp: string
  ingredients: string
  nutritional_value: string
  variants: string
  min_order_per_product_type: string
  minimum_order_quantity: string
  promotion: string
  price_per_unit_measure: string
  product_image: string
}

const defaultProductValues = {
  product_code: '',
  product_name: '',
  description: '',
  product_size_per_unit: '',
  quantity: '',
  unit_measure: '',
  supplier_sku: '',
  order_unit: '',
  manufacturer: '',
  unit_price: '',
  unit_price_delivery: '',
  unit_price_collection: '',
  rrp: '',
  ingredients: '',
  nutritional_value: '',
  variants: '',
  min_order_per_product_type: '',
  minimum_order_quantity: '',
  promotion: '',
  price_per_unit_measure: '',
  product_image: ''
}

const productSchema = yup.object().shape({
  product_code: yup.string().required(),
  product_name: yup.string().required(),
  product_size_per_unit: yup.string().required(),

  // unit_price_delivery: yup.string().required(),
})

const AddCatalogueDrawer = (props: SidebarAddProductType) => {
  // ** Props
  const { open, toggle, id } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [checked, setChecked] = useState<boolean>(false)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [subCategory, setSubCategory] = useState<string>("")
  const [orderUnit, setOrderUnit] = useState<string>("");
  const [unitMeasure, setUnitMeasure] = useState<string>("")
  const [keyword, setKeyword] = useState<string[]>([])
  const [diet, setDiet] = useState<string[]>([])
  const [brandValues, setBrandValues] = useState<string[]>([])
  const [storage, setStorage] = useState<string[]>([])
  const [production, setProduction] = useState<string[]>([])
  const [allergen, setAllergen] = useState<string[]>([])
  const [leadTime, setLeadTime] = useState<string[]>([])
  const [shipWindow, setShipWindow] = useState<string[]>([])
  const [shelf, setShelfLife] = useState<string>(shelf_life[0])
  const [productOrigin, setProductOrigin] = useState<string>(product_origin[0])

  const [startDate, setStartDate] = useState<DateType>(new Date())
  const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15))
  const [fileData, setFileData] = useState<File>()

  const [option, setOption] = useState<string>('');
  const [variant, setVariant] = useState<string>('');

  const [addVariantShow, setAddVariantShow] = useState<boolean>(false);

  const [variants, setVariants] = useState<any>({});

  const [unlimitedStock, setUnlimitedStock] = useState<boolean>(false)
  const [onSale, setOnSale] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const addVariant = () => {
    setVariants({ ...variants, [option]: variant })
  }

  const deleteVariant = (option: string) => {
    const temp = variants;
    delete temp[option]
    setVariants({ ...temp });
  }

  const catalogue = useSelector((state: RootState) => state.catalogue)

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

  useEffect(() => {
    console.log(id);
    const values = catalogue?.data.find((v: any) => v.id == id)
    if (values) {
      const catalogueData = values as CatalogueType

      reset(values)

      const visible = catalogueData.visible as boolean
      const selectedCategory = catalogueData.category
      const selectedSubCategory = catalogueData.sub_category
      const selectedKeyword = catalogueData.keyword ? catalogueData.keyword.split(',') : []
      const selectedDiet = catalogueData.diet ? catalogueData.diet.split(',') : []
      const selectedBrand = catalogueData.brand_supplier_values ? catalogueData.brand_supplier_values.split(',') : []
      const selectedStorage = catalogueData.storage ? catalogueData.storage.split(',') : []
      const selectedProduction = catalogueData.production ? catalogueData.production.split(',') : []
      const selectedAllergen = catalogueData.allergen ? catalogueData.allergen.split(',') : []
      const selectedLeadTime = catalogueData.lead_time ? catalogueData.lead_time.split(',') : []
      const variants = catalogueData.variants;
      const onSale = catalogueData.on_sale;
      const unlimitedStock = catalogueData.unlimited_stock;
      const unitMeasure = catalogueData.unit_measure;
      const orderUnit = catalogueData.order_unit;

      // Considerate this in the future
      // const shipWindow = catalogueData.ship_window ? catalogueData.ship_window.split('-') : []

      setChecked(visible)
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
      setVariants(variants);
      setOnSale(onSale);
      setUnlimitedStock(unlimitedStock);
      setUnitMeasure(unitMeasure);
      setOrderUnit(orderUnit);
    } else {
      reset(defaultProductValues)
    }
  }, [reset, catalogue])

  const onSubmit = async (data: ProductDataType) => {
    try {
      setLoading(true)
      const categorieName = category;
      const subCategoryName = subCategory;
      const keywordName = keyword.length > 0 ? keyword.join(',') : ''
      const dietName = diet.length > 0 ? diet.join(',') : ''
      const brandValuesName = brandValues.length > 0 ? brandValues.join(',') : ''
      const storageName = storage.length > 0 ? storage.join(',') : ''
      const productionName = production.length > 0 ? production.join(',') : ''
      const allergenName = allergen.length > 0 ? allergen.join(',') : ''
      const leadTimeName = leadTime.length > 0 ? leadTime.join(',') : ''
      const ship_window = `${format((startDate as Date), 'dd/MM/yyyy')}-${format((endDate as Date), 'dd/MM/yyyy')}`

      let product = {
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
        order_unit: orderUnit,
        unit_measure: unitMeasure,
        variants: variants,
        on_sale: onSale,
        unlimited_stock: unlimitedStock,
        ship_window
      }

      let productRes;

      if (id == 0) {

        if (fileData) {
          // const id = productRes.info.id as string
          const fileType = fileData?.type as string
          // const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'product', fileKey: id, fileType: fileType } })
          const result = await axios.post('/api/profile/file/upload', { data: { imageType: 'product', fileKey: getRandomCode(), fileType: fileType } })
          const preSignedUrl = result.data.url

          console.log(fileData);

          const response = await axios.put(preSignedUrl, fileData, {
            headers: {
              "Content-type": fileType,
              "Access-Control-Allow-Origin": "*",
            },
          })

          if (response) {
            const productImage = preSignedUrl.split('?')[0]
            product = { ...product, product_image: productImage }
          }
        }

        productRes = await dispatch(addProduct(product)).unwrap()

      } else {

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
            product = { ...product, product_image: productImage }
          }
        }

        productRes = await dispatch(updateCatalogue(product)).unwrap()

        reset()
      }

    } catch (error) {
      // alert("ok")
    }
    handleClose()
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    toggle()

    setImgSrc('')
    setCategory('')
    setSubCategory("")
    setKeyword([])
    setDiet([])
    setBrandValues([])
    setStorage([])
    setProduction([])
    setAllergen([])
    setLeadTime([])
    setShipWindow([])
    setStartDate(new Date())
    setEndDate(new Date())
  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 2,
    maxSize: 100000000,
    accept: {
      'image/jpg': ['.jpg'],
      'image/png': ['.png']
    },
    onDrop: (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      const reader = new FileReader()
      if (acceptedFiles && acceptedFiles.length !== 0) {
        reader.onload = async () => {
          setImgSrc(reader.result as string)
        }
        reader.readAsDataURL(acceptedFiles[0])
        setFileData(acceptedFiles[0])
        if (reader.result !== null) {
          setInputValue(reader.result as string)
        }

      }
    },
    onDropRejected: () => {
      toast.error('You can only upload .jpeg or .png files', {
        duration: 2000
      })
    }
  })

  const handleRefreshImage = () => {
    console.log(files);
    setFiles([]);
    setImgSrc('')
  }


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 600, md: 900 } } }}
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
          <Grid item xs={12} sm={4} md={3}>
            <FormControlLabel label='Visibility' control={<Switch checked={checked} onChange={handleChange} />} />
          </Grid>

          {/* Product Details Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Details
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* Product Name */}
                  <Grid item md={12}>
                    <Controller
                      name='product_name'
                      control={productControl}

                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='PRODUCT NAME'
                          onChange={onChange}
                          placeholder='e.g Banana'
                          error={Boolean(productErrors.product_name)}
                          aria-describedby='stepper-linear-product-name'
                          {...(productErrors.product_name && { helperText: productErrors.product_name.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* Product Code */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='product_code'
                      control={productControl}

                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='CODE'
                          onChange={onChange}
                          placeholder='e.g 122312'
                          aria-describedby='stepper-linear-product-code'
                          error={Boolean(productErrors.product_code)}
                          {...(productErrors.product_code && { helperText: productErrors.product_code.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* Product Description */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='description'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          multiline
                          rows={3}
                          value={value}
                          label='DESCRIPTION'
                          onChange={onChange}
                          error={Boolean(productErrors.description)}
                          aria-describedby='stepper-linear-product-description'
                          {...(productErrors.description && { helperText: productErrors.description.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* Product Category */}
                  <Grid container spacing={5} style={{ marginTop: '2px' }}>
                    <Grid item md={6}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        SelectProps={{ value: category, onChange: e => setCategory(e.target.value as string) }}
                        label='CATEGORY'
                        id='category'
                        sx={{ width: '100%' }}
                      >
                        {categories.map(name => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                    <Grid item md={6}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        SelectProps={{ value: subCategory, onChange: e => setSubCategory(e.target.value as string) }}
                        label='SUB CATEGORY'
                        id='sub_category'
                        sx={{ width: '100%' }}
                      >
                        {subCategories[category as keyof typeof subCategories].map(name => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Minimum Order Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              Minimum Order
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* Minium Order Value per Product Type */}
                  <Grid item md={12}>
                    <Controller
                      name='minimum_order_quantity'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Set a minimum order value'
                          onChange={onChange}
                          placeholder='e.g £100 or less'
                          error={Boolean(productErrors.minimum_order_quantity)}
                          aria-describedby='stepper-minimum_order_quantity'
                          {...(productErrors.minimum_order_quantity && { helperText: productErrors.minimum_order_quantity.message })}
                        />
                      )}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Images Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Images
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
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
                    <DropzoneWrapper>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                          <Typography variant='h4' sx={{ mb: 2.5 }}>
                            Add images
                          </Typography>
                        </Box>
                      </div>
                    </DropzoneWrapper>
                  }
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Ingredients & Nutrition Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              Ingredients & Nutrition
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* Ingredients Value */}
                  <Grid item md={12}>
                    <Controller
                      name='ingredients'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='INGREDIENTS'
                          onChange={onChange}
                          placeholder='E.g: Skipjack Tuna (Fish), Spring Water'
                          error={Boolean(productErrors.ingredients)}
                          aria-describedby='stepper-linear-product-ingredients'
                          {...(productErrors.ingredients && { helperText: productErrors.ingredients.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* Nutritional Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='nutritional_value'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='NUTRITION'
                          onChange={onChange}
                          placeholder='E.g: per 100g (drained): Energy441kJ/104kcal / Fat0.3g /Protein25.3g..'
                          error={Boolean(productErrors.nutritional_value)}
                          aria-describedby='stepper-linear-product-nutritional_value'
                          {...(productErrors.nutritional_value && { helperText: productErrors.nutritional_value.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* Allergens Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <CustomTextField
                      select
                      fullWidth
                      label='ALLERGENS'
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
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>


          {/* Unit Measures Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              Unit Measures
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* PRODUCT SIZE PER UNIT and ORDER UNIT */}
                  <Grid container spacing={5} style={{ marginTop: '2px' }}>
                    <Grid item md={6}>
                      <Controller
                        name='product_size_per_unit'
                        control={productControl}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            label='PRODUCT SIZE PER UNIT'
                            onChange={onChange}
                            placeholder='Enter a number for product size. e.g: 6x100'
                            error={Boolean(productErrors.product_size_per_unit)}
                            aria-describedby='stepper-linear-product-size'
                            {...(productErrors.product_size_per_unit && { helperText: productErrors.product_size_per_unit.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={6}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        placeholder='Select the unit'
                        SelectProps={{ value: orderUnit, onChange: e => setOrderUnit(e.target.value as string) }}
                        label='ORDER UNIT'
                        id='order_unit'
                        sx={{ width: '100%' }}
                      >
                        {orderUnits.map(name => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                  </Grid>
                  {/* UNIT OF MEASURE and PRICE PER UNIT OF MEASURE */}
                  <Grid container spacing={5} style={{ marginTop: '2px' }}>
                    <Grid item md={6}>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        placeholder='Select the unit'
                        SelectProps={{ value: unitMeasure, onChange: e => setUnitMeasure(e.target.value as string) }}
                        label='UNIT OF MEASURE'
                        id='unit_measure'
                        sx={{ width: '100%' }}
                      >
                        {unitMeasures.map(name => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                    <Grid item md={6}>
                      <Controller
                        name='price_per_unit_measure'
                        control={productControl}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            label='PRICE PER UNIT OF MEASURE'
                            onChange={onChange}
                            placeholder='E.g: £10'
                            error={Boolean(productErrors.ingredients)}
                            aria-describedby='stepper-linear-price-per-unit-of-measure'
                            {...(productErrors.ingredients && { helperText: productErrors.ingredients.message })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Other Product Details Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              Other Product Details
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* Diet Value */}
                  <Grid item md={12}>
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
                  {/* Shelf life Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
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
                  {/* Storage Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
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
                  {/* Product Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <CustomTextField
                      select
                      fullWidth
                      label='Product Values'
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
                  {/* Production Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
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
                  {/* Production Origin Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
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
                  {/* Manufacturer Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='manufacturer'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          label='Manufacturer'
                          onChange={onChange}
                          placeholder='E.g: Nestle'
                          error={Boolean(productErrors.manufacturer)}
                          aria-describedby='stepper-linear-product-manufacturer'
                          {...(productErrors.manufacturer && { helperText: productErrors.manufacturer.message })}
                        />
                      )}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Inventory Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              Inventory
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* Price Value */}
                  <Grid item md={12}>
                    <Controller
                      name='unit_price'
                      control={productControl}

                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='number'
                          placeholder='£0.00'
                          value={value}
                          label='Price'
                          onChange={onChange}
                        />
                      )}
                    />
                  </Grid>
                  {/* RRP Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='rrp'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='number'
                          placeholder='£0.00'
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
                  {/* On Sale Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ marginLeft: "0px" }}
                      value="top"
                      control={<Switch color="primary" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />}
                      label="On Sale"
                      labelPlacement="start"
                    />
                  </Grid>
                  {/* Quantity Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='quantity'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='number'
                          placeholder='1'
                          value={value}
                          label='Stock'
                          onChange={onChange}
                          error={Boolean(productErrors.quantity)}
                          aria-describedby='stepper-linear-product-quantity'
                          {...(productErrors.quantity && { helperText: productErrors.quantity.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* Unlimited stock Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ marginLeft: "0px" }}
                      value="unlimited stock"
                      control={<Switch color="primary" checked={unlimitedStock} onChange={(e) => setUnlimitedStock(e.target.checked)} />}
                      label="Unlimited stock"
                      labelPlacement="start"
                    />
                  </Grid>
                  {/* sku Value */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Controller
                      name='supplier_sku'
                      control={productControl}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          type='number'
                          placeholder='1'
                          label='SKU'
                          onChange={onChange}
                          error={Boolean(productErrors.supplier_sku)}
                          aria-describedby='stepper-linear-product-measure'
                          {...(productErrors.supplier_sku && { helperText: productErrors.supplier_sku.message })}
                        />
                      )}
                    />
                  </Grid>
                  {/* variants */}
                  <Grid item md={12} style={{ marginTop: '16px' }}>
                    <Typography>Variants</Typography>
                    <Button variant="text" startIcon={<AddIcon />} onClick={() => setAddVariantShow(true)} style={{ marginTop: '2px' }}>Add</Button>
                  </Grid>
                  {
                    Object.keys(variants).map(option => (
                      <Grid container spacing={5} style={{ marginTop: '0px', alignItems: "center" }} key={option}>
                        <Grid item md={3} style={{ paddingTop: '0px' }}>
                          <Typography>{option}</Typography>
                        </Grid>
                        <Grid item md={8} style={{ paddingTop: '0px' }}>
                          <Typography>{variants[option]}</Typography>
                        </Grid>
                        <Grid item md={1} style={{ paddingTop: '0px' }}>
                          <IconButton aria-label="delete" size="large" color="secondary" onClick={() => deleteVariant(option)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))
                  }
                  {addVariantShow &&
                    <Grid container spacing={5} style={{ marginTop: '0px', alignItems: "end" }}>
                      <Grid item md={3}>
                        <CustomTextField
                          fullWidth
                          value={option}
                          label='OPTIONS'
                          onChange={(e) => setOption(e.target.value)}
                        />
                      </Grid>
                      <Grid item md={8}>
                        <CustomTextField
                          fullWidth
                          value={variant}
                          label='VARIANTS'
                          placeholder='hint: separate values by comma'
                          onChange={(e) => setVariant(e.target.value)}
                        />
                      </Grid>
                      <Grid item md={1}>
                        <Button variant="text" onClick={addVariant}>Add</Button>
                      </Grid>
                    </Grid>}
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          {/* Fulfilment Collapse */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              Fulfilment
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardContent>
                  {/* Set up fulfilment profiles */}
                  <Grid item md={12}>
                    <Button variant="text" startIcon={<AddIcon />}>Set up fulfilment profiles</Button>
                  </Grid>
                  {/* Delivery Checkbox */}
                  <Grid container spacing={5} style={{ marginTop: '4px' }}>
                    <Grid item md={6}>
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Delivery by Company Driver" />
                    </Grid>
                    <Grid item md={6}>
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Mail Delivery" />
                    </Grid>
                  </Grid>
                  {/* Delivery Checkbox */}
                  <Grid container spacing={5} style={{ marginTop: '16px' }}>
                    <Grid item md={6}>
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
                    <Grid item md={6}>
                      <CustomTextField
                        select
                        fullWidth
                        label='Ship Window'
                        id='ship_window'
                        SelectProps={{
                          MenuProps,
                          multiple: true,
                          value: shipWindow,
                          onChange: e => setShipWindow(e.target.value as string[]),
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
                  </Grid>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
          <Grid container spacing={5} style={{ marginTop: '8px' }}>
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
