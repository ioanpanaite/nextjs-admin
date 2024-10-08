import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CatalogueModel from "src/lib/models/Catalogue.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { data } = req.body;
    await connectDB();

    const catalogue = await CatalogueModel.create({
      product_code: data.product_code,
      product_name: data.product_name,
      description: data.description,
      product_size_per_unit: data.product_size_per_unit,
      price_per_unit_measure: data.price_per_unit_measure,
      quantity: data.quantity,
      supplier_sku: data.supplier_sku,
      manufacturer: data.manufacturer,
      visible: data.visible,
      order_unit: data.order_unit,
      unit_price_delivery: data.unit_price_delivery,
      unit_price_collection: data.unit_price_collection,
      unit_price: data.unit_price,
      unit_measure: data.unit_measure,
      rrp: data.rrp,
      ingredients: data.ingredients,
      nutritional_value: data.nutritional_value,
      variants: data.variants,
      min_order_per_product_type: data.min_order_per_product_type,
      minimum_order_quantity: data.minimum_order_quantity,
      ship_window: data.ship_window,
      lead_time: data.lead_time,
      promotion: data.promotion,
      category: data.category,
      sub_category: data.sub_category,
      keyword: data.keyword,
      diet: data.diet,
      brand_supplier_values: data.brand_supplier_values,
      storage: data.storage,
      production: data.production,
      allergen: data.allergen,
      shelf_life: data.shelf_life,
      product_origin: data.product_origin,
      on_sale: data.on_sale,
      unlimited_stock: data.unlimited_stock,
      product_image: data.product_image
    })

    res.status(200).json({ ok: true, info: { id: catalogue._id.toString(), message: 'Catalogue added successfully!' } });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Catalogue: Something went wrong." });
  }
}
