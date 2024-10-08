import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { genSaltSync, hashSync } from "bcrypt-ts";
import TeamModel from "src/lib/models/Team.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    const email = session?.user.email

    const { q = '' } = req.query ?? ''
    const queryLowered = (q as string).toLowerCase()

    await connectDB();
    const teamsRaw = await TeamModel.find({ email: email })
    const teams = teamsRaw.flatMap((val) => val._id && { ...val._doc, id: val._id.toString() });

    const filteredData = teams.filter(
      team =>
      (team.memberEmail.toLowerCase().includes(queryLowered) ||
        team.role.toLowerCase().includes(queryLowered) ||
        team.status.toLowerCase().includes(queryLowered))
    )

    const result = {
      teams: filteredData,
      params: req.query,
      allData: teams,
      total: teams.length
    }

    res.status(200).json({ ok: true, info: result });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}