
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { PersonOwner, CompanyOwner } from "@blaj/shared"
import { personOwnerSchema, companyOwnerSchema } from "@blaj/shared"
import { Input } from "./input"
import { FormField } from "./form-field"
import { Button } from "./button"
import { useWizard } from "./wizard-context"
import { t } from "@blaj/shared"
import { User, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "../lib/utils"
import { useState } from "react"

function AddressFields({
  prefix,
  register,
  errors,
}: {
  prefix: "adresa" | "adresa_sediu"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-neutral-200">
      <FormField label={t("owner.judet")} error={errors[prefix]?.judet?.message} required>
        <Input
          placeholder="București"
          {...register(`${prefix}.judet`)}
          error={errors[prefix]?.judet?.message}
        />
      </FormField>
      <FormField label={t("owner.localitate")} error={errors[prefix]?.localitate?.message} required>
        <Input
          placeholder="Sector 1"
          {...register(`${prefix}.localitate`)}
          error={errors[prefix]?.localitate?.message}
        />
      </FormField>
      <FormField label={t("owner.strada")} error={errors[prefix]?.strada?.message} required>
        <Input
          placeholder="Str. Exemplu"
          {...register(`${prefix}.strada`)}
          error={errors[prefix]?.strada?.message}
        />
      </FormField>
      <FormField label={t("owner.numar")} error={errors[prefix]?.numar?.message} required>
        <Input
          placeholder="10A"
          {...register(`${prefix}.numar`)}
          error={errors[prefix]?.numar?.message}
        />
      </FormField>
      <FormField label={t("owner.bloc")}>
        <Input {...register(`${prefix}.bloc`)} />
      </FormField>
      <FormField label={t("owner.scara")}>
        <Input {...register(`${prefix}.scara`)} />
      </FormField>
      <FormField label={t("owner.etaj")}>
        <Input {...register(`${prefix}.etaj`)} />
      </FormField>
      <FormField label={t("owner.apartament")}>
        <Input {...register(`${prefix}.apartament`)} />
      </FormField>
      <FormField label={t("owner.cod_postal")} error={errors[prefix]?.cod_postal?.message} required>
        <Input
          placeholder="012345"
          {...register(`${prefix}.cod_postal`)}
          error={errors[prefix]?.cod_postal?.message}
        />
      </FormField>
    </div>
  )
}

export function OwnerStep() {
  const { state, setOwner, goNext, goPrev } = useWizard()
  const [personType, setPersonType] = useState<"pf" | "pj">(
    (state.owner?.tip_persoana as "pf" | "pj") ?? "pf",
  )

  const existingOwner = state.owner

  const schema = personType === "pf" ? personOwnerSchema : companyOwnerSchema

  type FormValues = typeof schema extends typeof personOwnerSchema
    ? PersonOwner
    : CompanyOwner

  const defaultValues = personType === "pf"
    ? (existingOwner?.tip_persoana === "pf"
        ? existingOwner
        : {
            tip_persoana: "pf" as const,
            nume: "",
            prenume: "",
            cnp: "",
            serie_ci: "",
            numar_ci: "",
            email: "",
            telefon: "",
            adresa: { judet: "", localitate: "", strada: "", numar: "", cod_postal: "" },
          })
    : (existingOwner?.tip_persoana === "pj"
        ? existingOwner
        : {
            tip_persoana: "pj" as const,
            cui: "",
            nume_companie: "",
            cod_caen: "",
            numar_inregistrare: "",
            tip_societate: "",
            email_companie: "",
            telefon: "",
            reprezentant_nume: "",
            reprezentant_prenume: "",
            reprezentant_calitate: "",
            adresa_sediu: { judet: "", localitate: "", strada: "", numar: "", cod_postal: "" },
          })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: defaultValues as FormValues,
  })

  const onSubmit = (data: FormValues) => {
    setOwner(data as PersonOwner | CompanyOwner)
    goNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent-soft">
          <User className="h-5 w-5 text-brand-accent" />
        </div>
        <h2 className="text-xl font-display font-semibold text-primary">
          {t("owner.title")}
        </h2>
      </div>

      {/* Person type toggle */}
      <div className="flex rounded-lg border border-neutral-200 bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setPersonType("pf")}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-150",
            personType === "pf"
              ? "bg-surface text-primary shadow-sm"
              : "text-neutral-500 hover:text-primary",
          )}
        >
          {t("owner.pf")}
        </button>
        <button
          type="button"
          onClick={() => setPersonType("pj")}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all duration-150",
            personType === "pj"
              ? "bg-surface text-primary shadow-sm"
              : "text-neutral-500 hover:text-primary",
          )}
        >
          {t("owner.pj")}
        </button>
      </div>

      {personType === "pf" ? (
        <PFStep register={register} errors={errors} />
      ) : (
        <PJStep register={register} errors={errors} />
      )}

      {/* Declaration */}
      <div className="pt-6 border-t border-neutral-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-electric"
            defaultChecked
          />
          <span className="text-sm text-neutral-500">
            {personType === "pf" ? t("owner.declaratie_pf") : t("owner.declaratie_pj")}
          </span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <Button type="button" variant="ghost" onClick={goPrev}>
          <ChevronLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <Button type="submit" variant="primary" disabled={!isValid}>
          {t("common.next")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PFStep({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("owner.nume")} error={errors.nume?.message} required>
          <Input placeholder="Popescu" {...register("nume")} error={errors.nume?.message} />
        </FormField>
        <FormField label={t("owner.prenume")} error={errors.prenume?.message} required>
          <Input placeholder="Ion" {...register("prenume")} error={errors.prenume?.message} />
        </FormField>
        <FormField label={t("owner.cnp")} error={errors.cnp?.message} required>
          <Input placeholder="1970101123456" {...register("cnp")} error={errors.cnp?.message} />
        </FormField>
        <FormField label={t("owner.serie_ci")} error={errors.serie_ci?.message} required>
          <Input placeholder="XX" {...register("serie_ci")} error={errors.serie_ci?.message} />
        </FormField>
        <FormField label={t("owner.numar_ci")} error={errors.numar_ci?.message} required>
          <Input placeholder="123456" {...register("numar_ci")} error={errors.numar_ci?.message} />
        </FormField>
        <FormField label={t("owner.email")} error={errors.email?.message} required>
          <Input type="email" placeholder="ion@exemplu.ro" {...register("email")} error={errors.email?.message} />
        </FormField>
        <FormField label={t("owner.telefon")} error={errors.telefon?.message} required>
          <Input placeholder="0712345678" {...register("telefon")} error={errors.telefon?.message} />
        </FormField>
      </div>

      <div className="pt-4">
        <h3 className="text-sm font-display font-semibold text-primary mb-4">{t("owner.adresa")}</h3>
        <AddressFields prefix="adresa" register={register} errors={errors} />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PJStep({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label={t("owner.cui")} error={errors.cui?.message} required>
          <Input placeholder="12345678" {...register("cui")} error={errors.cui?.message} />
        </FormField>
        <FormField label={t("owner.nume_companie")} error={errors.nume_companie?.message} required>
          <Input placeholder="SC Exemplu SRL" {...register("nume_companie")} error={errors.nume_companie?.message} />
        </FormField>
        <FormField label={t("owner.cod_caen")} error={errors.cod_caen?.message} required>
          <Input placeholder="6201" {...register("cod_caen")} error={errors.cod_caen?.message} />
        </FormField>
        <FormField label={t("owner.numar_inregistrare")} error={errors.numar_inregistrare?.message} required>
          <Input placeholder="J40/1234/2020" {...register("numar_inregistrare")} error={errors.numar_inregistrare?.message} />
        </FormField>
        <FormField label={t("owner.tip_societate")} error={errors.tip_societate?.message} required>
          <Input placeholder="SRL" {...register("tip_societate")} error={errors.tip_societate?.message} />
        </FormField>
        <FormField label={t("owner.email_companie")} error={errors.email_companie?.message} required>
          <Input type="email" placeholder="contact@exemplu.ro" {...register("email_companie")} error={errors.email_companie?.message} />
        </FormField>
        <FormField label={t("owner.telefon")} error={errors.telefon?.message} required>
          <Input placeholder="0712345678" {...register("telefon")} error={errors.telefon?.message} />
        </FormField>
      </div>

      {/* Representative */}
      <div className="pt-4">
        <h3 className="text-sm font-display font-semibold text-primary mb-4">{t("owner.pj")} — Reprezentant legal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label={t("owner.reprezentant_nume")} error={errors.reprezentant_nume?.message} required>
            <Input placeholder="Popescu" {...register("reprezentant_nume")} error={errors.reprezentant_nume?.message} />
          </FormField>
          <FormField label={t("owner.reprezentant_prenume")} error={errors.reprezentant_prenume?.message} required>
            <Input placeholder="Ion" {...register("reprezentant_prenume")} error={errors.reprezentant_prenume?.message} />
          </FormField>
          <FormField label={t("owner.reprezentant_calitate")} error={errors.reprezentant_calitate?.message} required>
            <Input placeholder="Administrator" {...register("reprezentant_calitate")} error={errors.reprezentant_calitate?.message} />
          </FormField>
        </div>
      </div>

      {/* Registered office */}
      <div className="pt-4">
        <h3 className="text-sm font-display font-semibold text-primary mb-4">{t("owner.adresa_sediu")}</h3>
        <AddressFields prefix="adresa_sediu" register={register} errors={errors} />
      </div>
    </div>
  )
}
