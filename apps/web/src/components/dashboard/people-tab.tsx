"use client"

import { Card, CardContent } from "@blaj/ui"
import { Button } from "@blaj/ui"
import { Users, User } from "lucide-react"

export function PeopleTab({
  locale,
  profileData,
}: {
  locale: string
  profileData: Record<string, unknown> | null
}) {
  const persons = (profileData?.persons as Record<string, unknown>[] | undefined) ?? []
  const isRo = locale === "ro"

  if (persons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-neutral-300 mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700 font-display">
          {isRo ? "Nicio persoană salvată" : "No saved people"}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 max-w-sm">
          {isRo
            ? "Persoanele asociate polițelor tale vor apărea aici."
            : "People associated with your policies will appear here."}
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
      <div>
        <h2 className="text-xl font-bold text-neutral-900 font-display">
          {isRo ? "Persoane" : "People"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {persons.length} {isRo ? "persoane" : "people"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {persons.map((p) => (
          <Card key={p.id as string} className="hover:border-neutral-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-medium text-sm text-neutral-900">
                    {[p.firstName, p.lastName].filter(Boolean).join(" ") || (p.companyName as string) || "—"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {((p.type as string) === "individual"
                      ? (isRo ? "Persoană fizică" : "Individual")
                      : (isRo ? "Persoană juridică" : "Company"))}
                    {p.email ? ` · ${p.email as string}` : ""}
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
