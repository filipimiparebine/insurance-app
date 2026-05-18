"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { policyConfigSchema, leasingSchema } from "@blaj/shared"
import type { PolicyConfig, Leasing, Driver } from "@blaj/shared"
import { Input } from "./input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select"
import { FormField } from "./form-field"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { useWizard } from "./wizard-context"
import { t } from "@blaj/shared"
import {
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  ShieldCheck,
  Car,
  User,
  AlertTriangle,
} from "lucide-react"
import { useMemo } from "react"

const durataOptions = [
  { value: "1", label: t("config.durata_1_luna") },
  { value: "3", label: t("config.durata_3_luni") },
  { value: "6", label: t("config.durata_6_luni") },
  { value: "12", label: t("config.durata_12_luni") },
] as const

const secondaryDurataOptions = [
  { value: "1", label: t("config.durata_1_luna") },
  { value: "3", label: t("config.durata_3_luni") },
  { value: "6", label: t("config.durata_6_luni") },
] as const

export function ConfigStep() {
  const { state, setConfig, goNext, goPrev } = useWizard()

  const today = new Date().toISOString().split("T")[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  const existingConfig = state.policy_config
  const existingLeasing = state.leasing

  const defaultDrivers: Driver[] = existingConfig?.soferi_adiționali ?? []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<PolicyConfig & Leasing & { durata_luni_secondary: string }>({
    resolver: zodResolver(
      policyConfigSchema.and(leasingSchema),
      {},
      { mode: "sync" },
    ),
    mode: "onChange",
    defaultValues: {
      data_inceput: existingConfig?.data_inceput ?? today,
      durata_luni: existingConfig?.durata_luni ?? "12",
      decontare_directa: existingConfig?.decontare_directa ?? true,
      sofer_diferit: existingConfig?.sofer_diferit ?? false,
      soferi_adiționali: defaultDrivers,
      are_leasing: existingLeasing?.are_leasing ?? false,
      companie_leasing: existingLeasing?.companie_leasing ?? "",
      durata_luni_secondary: "1",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "soferi_adiționali",
  })

  const soferDiferit = watch("sofer_diferit")
  const areLeasing = watch("are_leasing")
  const decontareDirecta = watch("decontare_directa")
  const durataLuni = watch("durata_luni")

  // CNP duplicate validation
  const cnpValues = fields.map((_, i) => watch(`soferi_adiționali.${i}.cnp`))
  const cnpDuplicates = useMemo(() => {
    const seen = new Map<string, number[]>()
    cnpValues.forEach((cnp, i) => {
      if (cnp && cnp.length >= 13) {
        const existing = seen.get(cnp) ?? []
        existing.push(i)
        seen.set(cnp, existing)
      }
    })
    const dupes = new Set<number>()
    seen.forEach((indices) => {
      if (indices.length > 1) indices.forEach((i) => dupes.add(i))
    })
    return dupes
  }, [cnpValues])

  const onSubmit = (data: Record<string, unknown>) => {
    const are_leasing = data.are_leasing as boolean
    const companie_leasing = data.companie_leasing as string | undefined

    const validConfig: PolicyConfig = {
      data_inceput: data.data_inceput as string,
      durata_luni: data.durata_luni as PolicyConfig["durata_luni"],
      decontare_directa: data.decontare_directa as boolean,
      an_obtinere_permis: data.an_obtinere_permis as number | undefined,
      sofer_diferit: (data.sofer_diferit as boolean) ?? false,
      soferi_adiționali: (data.soferi_adiționali as Driver[]) ?? [],
    }

    const leasing: Leasing | undefined = are_leasing
      ? { are_leasing, companie_leasing: companie_leasing ?? "" }
      : undefined

    setConfig(validConfig, leasing)
    goNext()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent-soft">
              <Settings className="h-5 w-5 text-brand-accent" />
            </div>
            <h2 className="text-xl font-display font-semibold text-primary">
              {t("config.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label={t("config.data_inceput")}
              hint={t("config.data_inceput_help")}
              error={errors.data_inceput?.message}
              required
            >
              <Input
                id="data_inceput"
                type="date"
                min={today}
                max={maxDateStr}
                {...register("data_inceput")}
                error={errors.data_inceput?.message}
              />
            </FormField>

            <FormField label="Perioadă principală" required>
              <Select
                value={durataLuni}
                onValueChange={(v) =>
                  setValue("durata_luni", v as PolicyConfig["durata_luni"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="durata_luni">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durataOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Perioadă secundară" hint="Afișată în oferte pentru comparație">
              <Select
                value={watch("durata_luni_secondary")}
                onValueChange={(v) =>
                  setValue("durata_luni_secondary", v, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="durata_luni_secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {secondaryDurataOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Direct settlement */}
          <div className="bg-electric-soft rounded-lg p-5 flex items-start gap-4">
            <ShieldCheck className="h-5 w-5 text-electric mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {t("config.decontare_directa")}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {t("config.decontare_directa_help")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-neutral-300 text-electric focus:ring-electric flex-shrink-0"
                  checked={decontareDirecta}
                  onChange={(e) =>
                    setValue("decontare_directa", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                />
              </label>
            </div>
          </div>

          {/* Leasing */}
          <div className="bg-neutral-100 rounded-lg p-5 flex items-start gap-4">
            <div className="flex-1">
              <label className="flex items-center justify-between cursor-pointer">
                <p className="text-sm font-semibold text-primary">
                  {t("owner.leasing")}
                </p>
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-neutral-300 text-brand-primary focus:ring-electric flex-shrink-0"
                  checked={areLeasing}
                  onChange={(e) =>
                    setValue("are_leasing", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                />
              </label>
              {areLeasing && (
                <div className="mt-4">
                  <FormField label={t("owner.companie_leasing")} required>
                    <Input
                      placeholder="Porsche Leasing"
                      {...register("companie_leasing")}
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>

          {/* Drivers */}
          <div className="bg-neutral-100 rounded-lg p-5 space-y-4">
            {/* Primary driver license year — shown when owner IS the primary driver */}
            {!soferDiferit && (
              <FormField label={t("config.an_obtinere_permis")} error={errors.an_obtinere_permis?.message as string}>
                <Input
                  type="number"
                  placeholder="1990"
                  {...register("an_obtinere_permis", { valueAsNumber: true })}
                  error={errors.an_obtinere_permis?.message as string}
                />
              </FormField>
            )}

            <label className="flex items-center justify-between cursor-pointer">
              <p className="text-sm font-semibold text-primary">
                {t("config.sofer_diferit")}
              </p>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-neutral-300 text-brand-primary focus:ring-electric flex-shrink-0"
                checked={soferDiferit}
                onChange={(e) =>
                  setValue("sofer_diferit", e.target.checked, {
                    shouldValidate: true,
                  })
                }
              />
            </label>

            {soferDiferit && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-display font-semibold text-primary">
                    {t("config.soferi_adiționali")}
                  </h4>
                  {fields.length < 5 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        append({
                          nume: "",
                          prenume: "",
                          cnp: "",
                          data_obtinere_permis: new Date().getFullYear(),
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      {t("config.adauga_sofer")}
                    </Button>
                  )}
                </div>

                {fields.map((field, index) => {
                  const isDupe = cnpDuplicates.has(index)
                  return (
                    <div
                      key={field.id}
                      className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface rounded-lg border border-neutral-200"
                    >
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-danger transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <FormField label={t("owner.nume")} required>
                        <Input
                          placeholder="Popescu"
                          {...register(`soferi_adiționali.${index}.nume`)}
                        />
                      </FormField>
                      <FormField label={t("owner.prenume")} required>
                        <Input
                          placeholder="Ion"
                          {...register(`soferi_adiționali.${index}.prenume`)}
                        />
                      </FormField>
                      <FormField
                        label={t("owner.cnp")}
                        error={field.cnp && isDupe ? "CNP-ul este deja adăugat la un alt șofer" : errors.soferi_adiționali?.[index]?.cnp?.message as string}
                        required
                      >
                        <Input
                          placeholder="1970101123456"
                          {...register(`soferi_adiționali.${index}.cnp`)}
                        />
                      </FormField>
                      <FormField
                        label={t("config.an_obtinere_permis")}
                        required
                      >
                        <Input
                          type="number"
                          placeholder="1990"
                          {...register(
                            `soferi_adiționali.${index}.data_obtinere_permis`,
                            { valueAsNumber: true },
                          )}
                        />
                      </FormField>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Consultancy waiver */}
          <div className="space-y-3 pt-6 border-t border-neutral-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-electric"
              />
              <div>
                <span className="text-sm text-neutral-500">
                  {t("config.renuntare_consultanta")}
                </span>
                <p className="text-xs text-neutral-400 mt-1">
                  {t("config.renuntare_consultanta_nota")}
                </p>
              </div>
            </label>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
            <Button type="button" variant="ghost" onClick={goPrev}>
              <ChevronLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <Button
              type="submit"
              variant="hero-accent"
              size="lg"
              disabled={!isValid}
            >
              {t("config.vezi_oferte")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Summary sidebar */}
      {state.vehicle && state.owner && (
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="text-sm font-display font-semibold text-primary">
                  Rezumat
                </h3>

                {/* Vehicle summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <Car className="h-3 w-3" />
                    Vehicul
                  </div>
                  <p className="text-sm text-primary font-medium">
                    {state.vehicle.marca} {state.vehicle.model}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {state.vehicle.numar_inmatriculare ?? (state.vehicle.serie_sasiu ? state.vehicle.serie_sasiu.slice(0, 8) + "…" : "")}
                    {" · "}
                    {state.vehicle.an_fabricatie}
                    {" · "}
                    {state.vehicle.tip_combustibil}
                  </p>
                </div>

                <div className="border-t border-neutral-200" />

                {/* Owner summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <User className="h-3 w-3" />
                    Proprietar
                  </div>
                  <p className="text-sm text-primary font-medium">
                    {state.owner.tip_persoana === "pf"
                      ? `${state.owner.nume} ${state.owner.prenume}`
                      : state.owner.nume_companie}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {state.owner.tip_persoana === "pf"
                      ? state.owner.email
                      : state.owner.email_companie}
                  </p>
                </div>

                <div className="border-t border-neutral-200" />

                {/* Price hint */}
                <div className="flex items-start gap-2 text-xs text-neutral-500">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>Verifică datele înainte de a continua. Ofertele se bazează pe informațiile furnizate.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
