import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CategoryModel from "src/lib/models/Category.model";
import TeamModel from "src/lib/models/Team.model";
import { authOptions } from "../../auth/[...nextauth]";
import { sendEmail, sentDynamicEmail } from "src/lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { data } = req.body;
    const header = req.headers

    const session = await getServerSession(req, res, authOptions)
    const email = session?.user.email as string

    await connectDB();
    await TeamModel.create({
      email: email,
      name: data.member,
      memberEmail: data.email,
      role: data.role,
      status: 'active'
    })

    // Send invitation email
    const mailData = {
      to: data.email,
      data: {
        "name": data.member,
        "support_email": "hello@wearenom.com",
        "action_url": `${header.origin}/register`,
        "subject": "Invitation team member from NOM"
      },
      template_id: process.env.SENDGRID_INVITE_TEAM_EMAIL as string
    }
    const result = await sentDynamicEmail(mailData)

    res.status(200).json({ ok: true, message: 'Team added successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Team: Something went wrong." });
  }
}