import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import CustomerModel from "src/lib/models/Customer.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    const supplierEmail = session?.user.email

    const { q = '', role = '', status='' } = req.query ?? ''
    const queryLowered = (q as string).toLowerCase()

    await connectDB();
    const customerData = await CustomerModel
      .aggregate([
        {
          $lookup: {
            from: "Orders",
            localField: "_id",
            foreignField: "customerId",
            as: "orders",
          },
        },
        {
          $unwind: {
            path: "$orders",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            week_count: {
              $sum: {
                $cond: [
                  {
                    $gt: [
                      "$orders.issuedDate",
                      new Date(
                        new Date().getTime() -
                        7 * 24 * 60 * 60 * 1000
                      ),
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            week_count_12: {
              $sum: {
                $cond: [
                  {
                    $gt: [
                      "$orders.issuedDate",
                      new Date(
                        new Date().getTime() -
                        84 * 24 * 60 * 60 * 1000
                      ),
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            week_sum_12: {
              $sum: {
                $cond: [
                  {
                    $gt: [
                      "$orders.issuedDate",
                      new Date(
                        new Date().getTime() -
                        84 * 24 * 60 * 60 * 1000
                      ),
                    ],
                  },
                  "$orders.total",
                  0,
                ],
              },
            },
            week_sum_compare: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gt: [
                          "$orders.issuedDate",
                          new Date(
                            new Date().getTime() -
                            168 * 24 * 60 * 60 * 1000
                          ),
                        ],
                      },
                      {
                        $lte: [
                          "$orders.issuedDate",
                          new Date(
                            new Date().getTime() -
                            84 * 24 * 60 * 60 * 1000
                          ),
                        ],
                      },
                    ],
                  },
                  "$orders.total",
                  0,
                ],
              },
            },
            email: {
              $first: "$email",
            },
            avatarImage: {
              $first: "$avatarImage",
            },
            siteName: {
              $first: "$siteName",
            },
            blocked: {
              $first: "$blocked",
            },
            supplierEmail: {
              $first: "$supplierEmail",
            },
            deliveryAddress: {
              $first: "$deliveryAddress"
            },
            accountId: {
              $first: "$accountId"
            },
            contact: {
              $first: "$contact"
            },
            username: {
              $first: "$username"
            },
            company: {
              $push: "$orders.company",
            },
            deletedAt: {
              $first: "$deletedAt"
            },
          },
        },
        {
          $addFields: {
            trend_products_12: {
              $reduce: {
                input: "$company",
                initialValue: "",
                in: {
                  $cond: {
                    if: { "$eq": ["$$value", ""] },
                    then: "$$this",
                    else: {
                      "$concat": ["$$value", ",", "$$this"]
                    }
                  }
                }
              }
            },
            trend_spent_12: {
              $subtract: ["$week_sum_12", "$week_sum_compare"]
            }
          }
        },
        {
          $match: {
            $and: [
              {
                "supplierEmail": supplierEmail,
              },
              {
                "deletedAt": {
                  "$eq": null
                }
              },
            ],
          }
        },
        {
          $sort: {
            '_id': -1
          }
        }
      ]);

    const customers = customerData.flatMap(val => val._id && { ...val, id: val._id.toString() })
    let filteredData = customers;
    if (queryLowered != '') {
      filteredData = customers.filter(
        customer =>
        (customer.siteName.toLowerCase().includes(queryLowered) ||
          customer.deliveryAddress.toLowerCase().includes(queryLowered))
      )
    }

    if(status != '') {
      filteredData = filteredData.filter(
        customer =>
        (customer.blocked == status)
      )
    }

    const result = {
      data: filteredData,
      params: req.query,
      allData: customers,
      total: filteredData.length,
      date: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    res.status(200).json({ ok: true, info: result });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Profile Get: Something went wrong." });
  }
}