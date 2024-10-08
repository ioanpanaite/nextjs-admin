import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CategoryModel from "src/lib/models/Category.model";
import CustomerModel from "src/lib/models/Customer.model";
import ProductModel from "src/lib/models/Product.model";

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
    if (data.customerData) {
      const customerData = data.customerData
      let customer = await CustomerModel.findOne({ siteName: customerData.siteName })
      if (!customer) {
        customer = await CustomerModel.create({
          supplierEmail: data.supplierEmail,
          siteName: customerData.siteName,
          deliveryAddress: customerData.address,
          accountId: customerData.accountId,
          blocked: '0',
        })
      }

      if (customer._id) {
        const productData = data.productData
        await ProductModel.create({
          customerId: customer._id.toString(),
          supplierEmail: data.supplierEmail,
          code: productData.code,
          name: productData.name,
          unit: productData.unit,
          quantity: productData.quantity,
          price: productData.price,
        })
      }

      res.status(200).json({ ok: true, info: { id: customer._id }, message: 'Product added successfully!' });
    }

    res.end();

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Product: Something went wrong." });
  }
}