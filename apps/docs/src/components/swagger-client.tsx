"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export function SwaggerClient({ spec }: { spec: Record<string, unknown> }) {
  return <SwaggerUI spec={spec} />;
}
