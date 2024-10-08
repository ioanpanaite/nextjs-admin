import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    product_code: {
      type: String,
    },
    product_name: {
      type: String
    },
    description: {
      type: String
    },
    product_size_per_unit: {
      type: String
    },
    unit_price: {
      type: String,
    },
    unit_measure: {
      type: String,
    },
    unit_price_delivery: {
      type: String,
    },
    unit_price_collection: {
      type: String
    },
    rrp: {
      type: String
    },
    price_per_unit_measure: {
      type: String
    },
    quantity: {
      type: String
    },
    order_unit: {
      type: String
    },
    supplier_sku: {
      type: String
    },
    manufacturer: {
      type: String
    },
    ingredients: {
      type: String
    },
    nutritional_value: {
      type: String
    },
    variants: {
      type: Object
    },
    min_order_per_product_type: {
      type: String
    },
    category: {
      type: String
    },
    sub_category: {
      type: String
    },
    keyword: {
      type: String
    },
    minimum_order_quantity: {
      type: String
    },
    diet: {
      type: String
    },
    shelf_life: {
      type: String
    },
    brand_supplier_values: {
      type: String
    },
    storage: {
      type: String
    },
    production: {
      type: String
    },
    allergen: {
      type: String
    },
    ship_window: {
      type: String
    },
    lead_time: {
      type: String
    },
    promotion: {
      type: String
    },
    product_origin: {
      type: String
    },
    product_image: {
      type: String
    },
    visible: {
      type: Boolean
    },
    on_sale: {
      type: Boolean
    },
    unlimited_stock: {
      type: Boolean
    }
  },
  {
    collection: 'Catalogue',
    timestamps: true
  }
)

export default mongoose.models.Catalogue || mongoose.model('Catalogue', schema)
