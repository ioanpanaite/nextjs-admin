import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { q = '', role = null, status = null, currentPlan = null } = req.query ?? ''

    const queryLowered = (q as string).toLowerCase()

    await connectDB();
    const usersFind = await UserModel.find();
    const users = usersFind.flatMap((val) => val._id && { ...val._doc, id: val._id.toString() });

    const filteredData = users.filter(
      user =>
        (user.username.toLowerCase().includes(queryLowered) ||
          user.fullName.toLowerCase().includes(queryLowered) ||
          user.role.toLowerCase().includes(queryLowered) ||
          (user.email.toLowerCase().includes(queryLowered) &&
            user.currentPlan.toLowerCase().includes(queryLowered) &&
            user.status.toLowerCase().includes(queryLowered))) &&
        user.role === (role || user.role) &&
        user.currentPlan === (currentPlan || user.currentPlan) &&
        user.status === (status || user.status)
    )

    const userData = {
      allData: users,
      users: filteredData,
      params: req.query,
      total: filteredData.length
    }

    res.status(200).json({ ok: true, data: userData });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Sign up API server is not working." });
  }
}