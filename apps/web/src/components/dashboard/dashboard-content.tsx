"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@blaj/ui"
import { OverviewTab } from "./overview-tab"
import { PoliciesTab } from "./policies-tab"
import { VehiclesTab } from "./vehicles-tab"
import { PeopleTab } from "./people-tab"
import { ProfileTab } from "./profile-tab"

type TabKey = "home" | "policies" | "vehicles" | "people" | "profile"

export function DashboardContent({
  locale,
  profileData,
  userName,
}: {
  locale: string
  profileData: Record<string, unknown> | null
  userName: string
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("home")
  const t = useTranslations("dashboard")

  const tabKeys: Record<TabKey, string> = {
    home: "home",
    policies: "policies",
    vehicles: "vehicles",
    people: "people",
    profile: "profile",
  }

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)} className="w-full">
      <TabsList className="mb-6">
        {(Object.keys(tabKeys) as TabKey[]).map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {t(tabKeys[tab])}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="home">
        <OverviewTab locale={locale} profileData={profileData} userName={userName} />
      </TabsContent>

      <TabsContent value="policies">
        <PoliciesTab locale={locale} profileData={profileData} />
      </TabsContent>

      <TabsContent value="vehicles">
        <VehiclesTab locale={locale} profileData={profileData} />
      </TabsContent>

      <TabsContent value="people">
        <PeopleTab locale={locale} profileData={profileData} />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileTab locale={locale} profileData={profileData} />
      </TabsContent>
    </Tabs>
  )
}
