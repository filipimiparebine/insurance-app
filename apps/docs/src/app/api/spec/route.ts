import { NextResponse } from "next/server";
import { generateOpenApiSpec } from "@blaj/api/openapi";

export async function GET(): Promise<NextResponse> {
  const spec = await generateOpenApiSpec();
  return NextResponse.json(spec);
}
