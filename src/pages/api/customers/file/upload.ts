import { NextApiRequest, NextApiResponse } from "next/types";
import * as AWS from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserModel from "src/lib/models/User.model";
import CatalogueModel from "src/lib/models/Catalogue.model";
import CompanyModel from "src/lib/models/Company.model";
import CustomerModel from "src/lib/models/Customer.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  try {
    if (req.method === "POST") {
      const { data } = req.body;
      console.log(data, 'file upload avatar')

      const s3Client = new AWS.S3Client({
        region: process.env.AWS_REGION as string,
        credentials: {
          accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY as string
        }
      })
      const timestamps = new Date().getTime();
      const imageKey = (data.imageType === 'avatar') ?
        `images/${data.fileKey}-${timestamps}.${getExtension(data.fileType)}` :
        (data.imageType === 'companypromote') ?
          `assets/${data.imageType}-${data.fileKey}-${timestamps}.${getExtension(data.fileType)}` :
          `images/${data.imageType}-${data.fileKey}-${timestamps}.${getExtension(data.fileType)}`

      const input = {
        Bucket: process.env.AWS_ASSET_BUCKET,
        Key: imageKey,
        ContentType: data.fileType,
        ACL: AWS.ObjectCannedACL.public_read,
      }

      // Create presigned url
      const command = new AWS.PutObjectCommand(input);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      if (data.imageType === 'avatar') {
        // Update profile image
        const userAvatarUrl = getImageUrl(url)
        await CustomerModel.updateOne(
          { _id: data.fileKey },
          { avatarImage: userAvatarUrl }
        )
      } else if (data.imageType === 'cover') {
        // Update suuplier's profile cover image
        const supplierCoverUrl = getImageUrl(url)
        await UserModel.updateOne(
          { _id: data.fileKey },
          { supplierCover: supplierCoverUrl }
        )
      } else if (data.imageType === 'product') {
        // Update product's image from catalogue
        const productUrl = getImageUrl(url)
        await CatalogueModel.updateOne(
          { _id: data.fileKey },
          { product_image: productUrl }
        )
      } else if (data.imageType === 'companypromote') {
        // Update company's image or video for promote
        const productUrl = getImageUrl(url)
        await CompanyModel.updateOne(
          { email: data.email },
          { productCover: productUrl }
        )
      }

      res.status(200).json({ ok: true, url });
    }
    res.status(200).json({ ok: true, result: 'ok' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Supplier Image: Something went wrong." });
  }
}

function getExtension(filename: string) {
  return filename.split('/').pop();
}

function getImageUrl(url: string) {
  return url.split('?')[0]
}