import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function generatePresignedUrl(bucketName, objectKey) {
  // Asserting the environment variables as strings. Make sure they are defined to avoid runtime errors.
  const awsCredentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  };

  const client = new S3Client({
    region: "us-east-1",
    credentials: awsCredentials,
  });

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  // URL expiration time in seconds (e.g., 3600 seconds = 1 hour)
  const expiresInSeconds = 604800;

  try {
    const url = await getSignedUrl(client, command, {
      expiresIn: expiresInSeconds,
    });
    return url;
  } catch (error) {
    console.error("Error generating pre-signed URL", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);

  const getDDAProduct = await fetch(
    `https://app.digital-downloads.com/api/v1/products?with_assets=true&page=1&limit=1000?&product_id=${body.productId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DDA_API_KEY}`,
      },
    }
  );
  const ddaProductData = await getDDAProduct.json();
  console.log(ddaProductData);
  const imageName = ddaProductData.data[0].assets[0].filename;
  console.log("adjkasdjk", imageName);
  const AWS_KEY = process.env.AWS_ACCESS_KEY_ID as string;
  const AWS_SECRET = process.env.AWS_SECRET_ACCESS_KEY as string;

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: AWS_KEY,
      secretAccessKey: AWS_SECRET,
    },
  });
  console.log("name");
  const command = new GetObjectCommand({
    Bucket: "000006-city-stock",
    Key: `source/${imageName}`,
  });

  try {
    const presignedUrl = await generatePresignedUrl(
      "000006-city-stock",
      `source/${imageName}`
    );
    return NextResponse.json({ url: presignedUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate pre-signed URL." });
  }
}
