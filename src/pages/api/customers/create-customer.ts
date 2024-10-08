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
    console.log(data);
    const customerData = data
    let customer = await CustomerModel.findOne({ accountId: customerData.accountId })
    if (!customer) {
      customer = await CustomerModel.create({
        supplierEmail: data.supplierEmail,
        siteName: data.siteName,
        deliveryAddress: data.deliveryAddress,
        accountId: data.accountId,
        username: data.name,
        email: data.email,
        contact: data.phone,
        blocked: '0',
      })
      res.status(200).json({ ok: true, info: { id: customer._id }, message: 'Customer created successfully!' });
    }else{
      res.status(422).json({ ok: false, message: "Account ID already used." });  
    }

    res.end();

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Customer: Something went wrong." });
  }
}