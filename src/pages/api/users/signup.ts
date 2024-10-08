import { genSaltSync, hashSync } from "bcrypt-ts";
import { NextApiRequest, NextApiResponse } from "next/types";
import { Plan, Role, Status } from "src/context/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { data } = req.body;

    await connectDB()
    const user = await UserModel.findOne({ email: data.email })
    if (user) {
      res.status(200).json({ ok: false, message: 'The email user already used.' });
      
      return false
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(data.password, salt);
    await UserModel.create({
      email: data.email,
      fullName: `${data.firstName} ${data.lastName}`,
      username: `${data.firstName.toLowerCase()}_${data.lastName.toLowerCase()}`,
      password: hashedPassword,
      isTerms: data.isTerms,
      status: Status.Pending,
      role: Role.Supplier,
      currentPlan: Plan.Free
    })

    res.status(200).json({ ok: true, message: 'User created successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Sign up API server is not working." });
  }
}