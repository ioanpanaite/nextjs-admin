import { NextApiRequest, NextApiResponse } from "next/types";
import { getDateRange } from "src/@core/utils/get-daterange";
import connectDB from "src/lib/connectDB";
import CustomerModel from "src/lib/models/Customer.model";
import OrderModel from "src/lib/models/Order.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { q = '', status = '', dates = [], id = '' } = req.query ?? ''

    const queryLowered = (q as string).toLowerCase()

    // Getting order data from db
    await connectDB()
    
    // const customer = await CustomerModel.findOne({ _id: id })
    const orders = await OrderModel.find({ customerId: id });
    console.log(id);
    console.log(orders);
    const filteredData = orders.filter(order => {
      if (dates.length) {
        const [start, end] = dates
        const filtered: number[] = []
        const range = getDateRange(new Date(start), new Date(end))
        const orderDate = new Date(order.issuedDate)

        range.filter(date => {
          const rangeDate = new Date(date)
          if (
            orderDate.getFullYear() === rangeDate.getFullYear() &&
            orderDate.getDate() === rangeDate.getDate() &&
            orderDate.getMonth() === rangeDate.getMonth()
          ) {
            filtered.push(order.id)
          }
        })

        if (filtered.length && filtered.includes(order.id)) {
          return (
            (order.email.toLowerCase().includes(queryLowered) ||
              order.username.toLowerCase().includes(queryLowered) ||
              String(order.id).toLowerCase().includes(queryLowered) ||
              String(order.total).toLowerCase().includes(queryLowered) ||
              order.dueDate.toLowerCase().includes(queryLowered)) &&
            order.orderStatus.toLowerCase() === ((status as string).toLowerCase() || order.orderStatus.toLowerCase())
          )
        }
      } else {
        return (
          (order.email.toLowerCase().includes(queryLowered) ||
            order.username.toLowerCase().includes(queryLowered) ||
            String(order.id).toLowerCase().includes(queryLowered) ||
            String(order.total).toLowerCase().includes(queryLowered) ||
            order.dueDate.toLowerCase().includes(queryLowered)) &&
          order.orderStatus.toLowerCase() === ((status as string).toLowerCase() || order.orderStatus.toLowerCase())
        )
      }
    })

    const result = {
      params: req.query,
      allData: orders,
      data: filteredData,
      total: filteredData.length
    }

    res.status(200).json({ ok: true, data: result });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Order API is not working." });
  }
}