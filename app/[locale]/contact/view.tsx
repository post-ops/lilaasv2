"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const TEAM = [
  { name: "Petter Akerholt Kjær", title: "Director, Sales & Marketing", email: "petter@lilaas.no", phone: "+47 412 53 859" },
  { name: "Øyvind", title: "Business Development", email: "oyvind@lilaas.no", phone: "+47 901 08 658" },
  { name: "Novy", title: "Sales & Marketing Coordinator", email: "sales@lilaas.no", phone: "" },
  { name: "Dan Gunnar", title: "KAM · Control Levers", email: "sales@lilaas.no", phone: "" },
  { name: "Lars Erik", title: "KAM · Precision Mechanics", email: "sales@lilaas.no", phone: "" },
  { name: "Kirsti", title: "Key Account Manager", email: "sales@lilaas.no", phone: "" },
];

export function ContactView() {
  const t = useTranslations("contact");

  const schema = z.object({
    name: z.string().min(2, t("form.errorName")),
    email: z.string().email(t("form.errorEmail")),
    company: z.string().optional(),
    topic: z.enum(["levers", "precision", "support", "press", "other"]),
    message: z.string().min(10, t("form.errorMessage")),
  });

  type FormData = z.infer<typeof schema>;

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { topic: "levers" },
  });

  async function onSubmit(data: FormData) {
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error("send-failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section className="pt-40 lg:pt-52 pb-20">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-6">{t("eyebrow")}</p>
          </Reveal>
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-14 items-end">
            <SplitReveal
              text={t("title")}
              as="h1"
              className="font-display text-display-xl text-fog text-balance"
              stagger={0.02}
            />
            <Reveal variant="up" delay={200}>
              <p className="text-lg text-mist leading-relaxed text-pretty">{t("sub")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid lg:grid-cols-[1.2fr_1fr] gap-16">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              <Reveal variant="up" delay={0}>
                <Field label={t("form.name")} error={errors.name?.message}>
                  <input
                    {...register("name")}
                    className="w-full bg-transparent border-b border-white/15 focus:border-signal outline-none py-3 text-fog placeholder:text-mist/50"
                    placeholder="Nora Hansen"
                    autoComplete="name"
                  />
                </Field>
              </Reveal>
              <Reveal variant="up" delay={80}>
                <Field label={t("form.email")} error={errors.email?.message}>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full bg-transparent border-b border-white/15 focus:border-signal outline-none py-3 text-fog placeholder:text-mist/50"
                    placeholder="nora@shipyard.no"
                    autoComplete="email"
                  />
                </Field>
              </Reveal>
            </div>

            <Reveal variant="up" delay={160}>
              <Field label={t("form.company")}>
                <input
                  {...register("company")}
                  className="w-full bg-transparent border-b border-white/15 focus:border-signal outline-none py-3 text-fog placeholder:text-mist/50"
                  placeholder="Nordic Shipyards"
                  autoComplete="organization"
                />
              </Field>
            </Reveal>

            <Reveal variant="up" delay={240}>
              <Field label={t("form.topic")}>
                <select
                  {...register("topic")}
                  className="w-full bg-ink border-b border-white/15 focus:border-signal outline-none py-3 text-fog"
                >
                  <option value="levers">{t("form.topicOptions.levers")}</option>
                  <option value="precision">{t("form.topicOptions.precision")}</option>
                  <option value="support">{t("form.topicOptions.support")}</option>
                  <option value="press">{t("form.topicOptions.press")}</option>
                  <option value="other">{t("form.topicOptions.other")}</option>
                </select>
              </Field>
            </Reveal>

            <Reveal variant="up" delay={320}>
              <Field label={t("form.message")} error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full bg-transparent border-b border-white/15 focus:border-signal outline-none py-3 text-fog placeholder:text-mist/50 resize-none"
                  placeholder="Tell us about your vessel, timeline, and the interfaces you need…"
                />
              </Field>
            </Reveal>

            <Reveal variant="up" delay={400}>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  arrow
                  disabled={status === "sending"}
                >
                  {status === "sending" ? t("form.sending") : t("form.submit")}
                </Button>
                {status === "success" && (
                  <p className="text-chart text-sm font-mono">{t("form.success")}</p>
                )}
                {status === "error" && (
                  <p className="text-signal text-sm font-mono">{t("form.errorGeneric")}</p>
                )}
              </div>
            </Reveal>
          </form>

          <aside className="space-y-10 lg:pl-10 lg:border-l lg:border-white/8">
            {[
              { icon: MapPin, label: t("address.label"), value: t("address.value") },
              { icon: Phone, label: t("phone.label"), value: t("phone.value"), secondary: t("phone.hours") },
              { icon: Mail, label: "Email", value: t("emails.general"), secondary: t("emails.sales") },
              { icon: Clock, label: "Hours", value: "Mon–Fri 08:00 – 16:00 CET" },
            ].map((item, i) => (
              <Reveal key={item.label} variant="right" delay={i * 120}>
                <Info icon={item.icon} label={item.label} value={item.value} secondary={item.secondary} />
              </Reveal>
            ))}

            <Reveal variant="up" delay={520}>
              <div className="pt-8 border-t border-white/5">
                <p className="eyebrow mb-4">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="signal">ISO 9001:2015</Badge>
                  <Badge tone="signal">DNV GL type-approved</Badge>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="container-x">
          <Reveal variant="fade">
            <p className="eyebrow mb-4">{t("teamTitle")}</p>
          </Reveal>
          <Reveal variant="up" delay={120}>
            <h2 className="font-display text-display-sm text-fog mb-12 max-w-2xl">
              Speak directly to someone in Horten.
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} variant="up" delay={i * 80}>
                <div className="p-6 rounded-xl border border-white/8 bg-deep/40 transition-all duration-500 hover:border-signal/30 hover:bg-deep/60 hover:-translate-y-1">
                  <p className="font-display text-lg text-fog">{m.name}</p>
                  <p className="text-xs text-mist mb-4">{m.title}</p>
                  <div className="space-y-1.5">
                    <a href={`mailto:${m.email}`} className="block text-sm text-mist hover:text-signal transition-colors">{m.email}</a>
                    {m.phone && (
                      <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="block text-sm text-mist hover:text-signal transition-colors font-mono">{m.phone}</a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-xs uppercase tracking-widest text-mist mb-2">
        {label}
      </span>
      {children}
      {error && <span className="block text-signal text-xs mt-2">{error}</span>}
    </label>
  );
}

function Info({
  icon: Icon,
  label,
  value,
  secondary,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-signal bg-signal/5 shrink-0">
        <Icon size={16} strokeWidth={1.5} />
      </div>
      <div>
        <p className="eyebrow mb-1.5">{label}</p>
        <p className="text-fog leading-relaxed">{value}</p>
        {secondary && <p className="text-mist text-sm mt-1">{secondary}</p>}
      </div>
    </div>
  );
}
