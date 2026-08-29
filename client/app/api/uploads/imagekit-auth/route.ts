import { createHmac, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

interface ImageKitAuthResponse {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
}

export async function GET() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json({ success: false, error: "Image uploads are not configured yet." }, { status: 503 });
  }

  const token = randomBytes(16).toString("hex");
  const expire = Math.floor(Date.now() / 1000) + 60 * 10;
  const signature = createHmac("sha1", privateKey).update(`${token}${expire}`).digest("hex");
  const response: ImageKitAuthResponse = { token, expire, signature, publicKey, urlEndpoint };

  return NextResponse.json({ success: true, ...response });
}
