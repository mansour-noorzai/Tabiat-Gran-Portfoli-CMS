import { NextResponse } from "next/server";export async function GET(){return NextResponse.json({status:"ok",service:"tabiat-gran-cms",timestamp:new Date().toISOString()})}
