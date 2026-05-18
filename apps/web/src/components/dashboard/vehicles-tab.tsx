"use client"

import { Card, CardContent } from "@blaj/ui"
import { Button } from "@blaj/ui"
import { Car } from "lucide-react"

export function VehiclesTab({
  locale,
  profileData,
}: {
  locale: string
  profileData: Record<string, unknown> | null
}) {
  const vehicles = (profileData?.vehicles as Record<string, unknown>[] | undefined) ?? []
  const isRo = locale === "ro"

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Car className="h-12 w-12 text-neutral-300 mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700 font-display">
          {isRo ? "Niciun vehicul salvat" : "No saved vehicles"}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 max-w-sm">
          {isRo
            ? "Vehiculele tale vor apărea aici după ce obții o ofertă."
            : "Your vehicles will appear here after you get a quote."}
        </p>
        <Button variant="primary" size="md" className="mt-4" asChild>
          <a href={`/${locale}/asigurare`}>
            {isRo ? "Obține o ofertă →" : "Get a quote →"}
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 font-display">
            {isRo ? "Vehiculele mele" : "My vehicles"}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {vehicles.length} {isRo ? "vehicule" : "vehicles"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {vehicles.map((v) => (
          <Card key={v.id as string} className="hover:border-neutral-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <Car className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-sm text-neutral-900">
                    {((v.make as string) ?? "—")} {((v.model as string) ?? "")}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {((v.plateNumber as string) ?? (v.vin as string) ?? "—")} &middot;{" "}
                    {((v.year as number) ?? "—")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
