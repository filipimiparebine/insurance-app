"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { vehicleSchema, type Vehicle } from "@blaj/shared"
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
import { useWizard } from "./wizard-context"
import { t } from "@blaj/shared"
import { Car, ChevronRight, ChevronLeft } from "lucide-react"

const stareOptions = [
  { value: "inmatriculat", label: t("vehicle.inmatriculat") },
  { value: "in_vederea_inmatricularii", label: t("vehicle.in_vederea_inmatricularii") },
  { value: "inregistrat_primarie", label: t("vehicle.inregistrat_primarie") },
] as const

const categorieOptions = [
  { value: "autoturism", label: "Autoturism" },
  { value: "autoutilitara", label: "Autoutilitară" },
  { value: "motocicleta", label: "Motocicletă" },
  { value: "camion", label: "Camion" },
  { value: "autobuz", label: "Autobuz" },
  { value: "remorca", label: "Remorcă" },
  { value: "semiremorca", label: "Semiremorcă" },
  { value: "tractor", label: "Tractor" },
  { value: "masina_agricola", label: "Mașină agricolă" },
] as const

const modUtilizareOptions = [
  { value: "privat", label: "Privat" },
  { value: "taxi", label: "Taxi" },
  { value: "rent_a_car", label: "Rent a Car" },
  { value: "scoala_soferi", label: "Școală de șoferi" },
  { value: "firma_distributie", label: "Firmă distribuție" },
  { value: "firma_securitate", label: "Firmă securitate" },
  { value: "curierat", label: "Curierat" },
  { value: "transport_national_persoane", label: "Transport național persoane" },
  { value: "transport_marfa", label: "Transport marfă" },
  { value: "transport_international_marfa", label: "Transport internațional marfă" },
  { value: "transport_international_persoane", label: "Transport internațional persoane" },
] as const

const combustibilOptions = [
  { value: "benzina", label: "Benzină" },
  { value: "motorina", label: "Motorină" },
  { value: "gpl", label: "GPL" },
  { value: "hibrid", label: "Hibrid" },
  { value: "electric", label: "Electric" },
  { value: "hidrogen", label: "Hidrogen" },
] as const

export function VehicleStep() {
  const { state, setVehicle, goNext, goPrev, isFirstStep } = useWizard()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<Vehicle>({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: state.vehicle ?? {
      stare: "inmatriculat",
      categorie: "autoturism",
      mod_utilizare: "privat",
      tip_combustibil: "benzina",
      an_fabricatie: new Date().getFullYear(),
      numar_locuri: 5,
      data_primei_inmatriculari: "",
      masa_maxima: 0,
      capacitate_cilindrica: 0,
      putere: 0,
      marca: "",
      model: "",
      subcategorie: "",
      serie_sasiu: "",
    },
  })

  const stare = watch("stare")

  const onSubmit = (data: Vehicle) => {
    setVehicle(data)
    goNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent-soft">
          <Car className="h-5 w-5 text-brand-accent" />
        </div>
        <h2 className="text-xl font-display font-semibold text-primary">
          {t("vehicle.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Row 1: Stare + Numar inmatriculare */}
        <FormField label={t("vehicle.stare_label")} required>
          <Select
            value={stare}
            onValueChange={(v) =>
              setValue("stare", v as Vehicle["stare"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="stare">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stareOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {stare === "inmatriculat" && (
          <FormField label={t("vehicle.numar_inmatriculare")}>
            <Input
              id="numar_inmatriculare"
              placeholder="B 123 ABC"
              {...register("numar_inmatriculare")}
              error={errors.numar_inmatriculare?.message}
            />
          </FormField>
        )}

        {/* Row: VIN */}
        <FormField
          label={t("vehicle.vin")}
          hint={t("vehicle.vin_help")}
          error={errors.serie_sasiu?.message}
          required
          className="md:col-span-2"
        >
          <Input
            id="serie_sasiu"
            placeholder="WVWZZZ3CZ..."
            {...register("serie_sasiu")}
            error={errors.serie_sasiu?.message}
          />
        </FormField>

        {/* Marca + Model */}
        <FormField label={t("vehicle.marca")} error={errors.marca?.message} required>
          <Input id="marca" placeholder="Volkswagen" {...register("marca")} error={errors.marca?.message} />
        </FormField>
        <FormField label={t("vehicle.model")} error={errors.model?.message} required>
          <Input id="model" placeholder="Golf" {...register("model")} error={errors.model?.message} />
        </FormField>

        {/* Categorie + Subcategorie */}
        <FormField label={t("vehicle.categorie")} required>
          <Select
            value={watch("categorie")}
            onValueChange={(v) =>
              setValue("categorie", v as Vehicle["categorie"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="categorie">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categorieOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label={t("vehicle.subcategorie")} error={errors.subcategorie?.message} required>
          <Input
            id="subcategorie"
            placeholder="1.6 TDI"
            {...register("subcategorie")}
            error={errors.subcategorie?.message}
          />
        </FormField>

        {/* Mod utilizare + Tip combustibil */}
        <FormField label={t("vehicle.mod_utilizare")} required>
          <Select
            value={watch("mod_utilizare")}
            onValueChange={(v) =>
              setValue("mod_utilizare", v as Vehicle["mod_utilizare"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="mod_utilizare">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modUtilizareOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label={t("vehicle.tip_combustibil")} required>
          <Select
            value={watch("tip_combustibil")}
            onValueChange={(v) =>
              setValue("tip_combustibil", v as Vehicle["tip_combustibil"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="tip_combustibil">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {combustibilOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* An fabricatie + Masa maxima */}
        <FormField label={t("vehicle.an_fabricatie")} error={errors.an_fabricatie?.message} required>
          <Input
            id="an_fabricatie"
            type="number"
            {...register("an_fabricatie", { valueAsNumber: true })}
            error={errors.an_fabricatie?.message}
          />
        </FormField>
        <FormField label={t("vehicle.masa_maxima")} error={errors.masa_maxima?.message} required>
          <Input
            id="masa_maxima"
            type="number"
            {...register("masa_maxima", { valueAsNumber: true })}
            error={errors.masa_maxima?.message}
          />
        </FormField>

        {/* Capacitate + Putere */}
        <FormField label={t("vehicle.capacitate_cilindrica")} error={errors.capacitate_cilindrica?.message} required>
          <Input
            id="capacitate_cilindrica"
            type="number"
            {...register("capacitate_cilindrica", { valueAsNumber: true })}
            error={errors.capacitate_cilindrica?.message}
          />
        </FormField>
        <FormField label={t("vehicle.putere")} error={errors.putere?.message} required>
          <Input
            id="putere"
            type="number"
            {...register("putere", { valueAsNumber: true })}
            error={errors.putere?.message}
          />
        </FormField>

        {/* Numar locuri */}
        <FormField label={t("vehicle.numar_locuri")} error={errors.numar_locuri?.message} required>
          <Input
            id="numar_locuri"
            type="number"
            {...register("numar_locuri", { valueAsNumber: true })}
            error={errors.numar_locuri?.message}
          />
        </FormField>

        {/* Serie CIV + Data primei inmatriculari */}
        <FormField label={t("vehicle.serie_civ")}>
          <Input id="serie_civ" {...register("serie_civ")} />
        </FormField>
        <FormField label={t("vehicle.data_primei_inmatriculari")} error={errors.data_primei_inmatriculari?.message} required>
          <Input
            id="data_primei_inmatriculari"
            type="date"
            {...register("data_primei_inmatriculari")}
            error={errors.data_primei_inmatriculari?.message}
          />
        </FormField>

        {/* Kilometraj + Data ITP */}
        <FormField label={t("vehicle.kilometraj")}>
          <Input
            id="kilometraj"
            type="number"
            {...register("kilometraj", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label={t("vehicle.data_expirare_itp")}>
          <Input id="data_expirare_itp" type="date" {...register("data_expirare_itp")} />
        </FormField>
      </div>

      {/* Declarations */}
      <div className="space-y-3 mt-6 pt-6 border-t border-neutral-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-electric"
            defaultChecked
          />
          <span className="text-sm text-neutral-500">
            {t("vehicle.declaratie_date_reale")}
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-electric"
            defaultChecked
          />
          <span className="text-sm text-neutral-500">
            {t("vehicle.declaratie_proprietar")}
          </span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        {!isFirstStep && (
          <Button type="button" variant="ghost" onClick={goPrev}>
            <ChevronLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
        )}
        <div className="flex-1" />
        <Button type="submit" variant="primary" disabled={!isValid}>
          {t("common.next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
