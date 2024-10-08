import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CustomerModel from "src/lib/models/Customer.model";
import OrderModel from "src/lib/models/Order.model";
import ProductModel from "src/lib/models/Product.model";
import { OrderStatus } from "src/types/apps/orderTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { data } = req.body;
    const session = await getServerSession(req, res, authOptions)
    const supplier_id = session?.user.id
    const customer_id = data.customerId;
    await connectDB();
    if (data.supplierEmail && customer_id) {
      const customer = await CustomerModel.findOne({ _id: data.customerId })
      await CustomerModel.updateOne(
        { _id: data.customerId },
        {
          username: data.contactData.name,
          email: data.contactData.email,
          contact: data.contactData.phone,
        }
      )

      const products = await ProductModel.find({ customerId: data.customerId })

      const initial = 0
      const totalPrice = products.reduce((prev: number, current: any) => {
        const total = prev + Number(current.quantity) * Number(current.price)
        
        return total
      }, initial)

      const lastOrder = await OrderModel.findOne({}).sort({ id: -1 })
      let newId = 1;
      
      if(lastOrder != undefined) {
        newId = lastOrder.id + 1
      }

      const orderData = {
        id: newId,
        issuedDate: new Date(),
        address: customer.deliveryAddress,
        company: customer.siteName,
        email: data.contactData.email,
        contact: data.contactData.phone,
        username: data.contactData.name,
        total: totalPrice,
        orderStatus: OrderStatus.Opened,
        dueDate: new Date(),
        subTotal: totalPrice,
        discount: 0,
        tax: 0,
        supplierId: supplier_id,
        customerId: customer_id,
      };
      await OrderModel.create(orderData)

      res.status(200).json({ ok: true, message: 'Contact updated successfully!' , orderData});
    }

    res.end();

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Product: Something went wrong." });
  }
}