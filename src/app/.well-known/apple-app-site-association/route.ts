// app/api/hello/route.js

import { NextResponse } from "next/server";
import AppleAppSite from "../../../../public/.well-known/apple-app-site-association.json";

export async function GET(request: any) {
  return NextResponse.json(AppleAppSite);
}
