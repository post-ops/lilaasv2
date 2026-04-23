export type Product = {
  slug: string;
  model: string;
  family: "L" | "LF" | "LE";
  tagline: string;
  description: string;
  highlight: string;
  accent: string;
  image: string;
  detailImage?: string;
  applications: string[];
  specs: { label: string; value: string }[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "l01",
    model: "L01",
    family: "L",
    tagline: "The flagship. A control lever with an integrated TFT display and synchronised electric feedback.",
    description:
      "The L01 brings an integrated TFT LCD directly into the lever body — readouts sit in the operator's line of sight, not tucked into a side panel. Synchronised electric motors across bridge stations ensure the captain can hand off or resume control without surprise. Type-approved for maritime installation.",
    highlight: "Integrated TFT display · Synchronised across bridges · DNV GL type-approved",
    accent: "#FF6B35",
    image: "/images/lilaas/l01.webp",
    detailImage: "/images/lilaas/l01-detail.webp",
    applications: ["Supply vessels", "Cruise ships", "Ferries", "Tankers", "Yachts", "Naval auxiliaries"],
    specs: [
      { label: "Display", value: "Integrated TFT LCD" },
      { label: "Feedback", value: "Electric haptic, synchronised" },
      { label: "Travel", value: "±45° (configurable)" },
      { label: "Detent options", value: "0 / 1 / 3 / variable" },
      { label: "Protection rating", value: "IP65 (front panel)" },
      { label: "Supply voltage", value: "24 VDC" },
      { label: "Interface", value: "CAN, Modbus, NMEA 2000" },
      { label: "Temp. range", value: "−25 °C to +70 °C" },
      { label: "Certification", value: "DNV GL type-approved" },
    ],
  },
  {
    slug: "lf180",
    model: "LF180",
    family: "LF",
    tagline: "Azimuth and thruster control for dynamic positioning.",
    description:
      "A purpose-built lever for azimuth thrusters and dynamic positioning. Compact, responsive, highly repeatable — the lever of choice across DP-class supply vessels and tugs.",
    highlight: "Azimuth · Thruster · DP class",
    accent: "#FF6B35",
    image: "/images/lilaas/lf180.webp",
    applications: ["Offshore support", "DP-class vessels", "Tugs"],
    specs: [
      { label: "Travel", value: "±45°" },
      { label: "Detent options", value: "0 / 1 / configurable" },
      { label: "Protection rating", value: "IP65" },
      { label: "Supply voltage", value: "24 VDC" },
      { label: "Interface", value: "CAN, Modbus" },
      { label: "Certification", value: "DNV GL type-approved" },
    ],
  },
  {
    slug: "lf120",
    model: "LF120",
    family: "LF",
    tagline: "Mid-class lever for ferries, yachts and commercial vessels.",
    description:
      "The workhorse. Proven across thousands of installations — supply vessels, ferries, cruise tenders. Pistol, T-handle or knob grip options.",
    highlight: "Proven · Flexible · Easy to integrate",
    accent: "#C97E4F",
    image: "/images/lilaas/lf120.webp",
    detailImage: "/images/lilaas/lf120-detail.webp",
    applications: ["Ferries", "Commercial yachts", "Fishing vessels"],
    specs: [
      { label: "Travel", value: "±45°" },
      { label: "Grip options", value: "Pistol, T-handle, knob" },
      { label: "Supply voltage", value: "24 VDC" },
      { label: "Interface", value: "Analogue / CAN" },
      { label: "Certification", value: "DNV GL type-approved" },
    ],
  },
  {
    slug: "lf90",
    model: "LF90",
    family: "LF",
    tagline: "Compact lever for tight bridges and workboats.",
    description:
      "All the feel of the LF line in a smaller footprint. Ideal where bridge space is at a premium — pilot boats, small ferries, workboats.",
    highlight: "Compact footprint · Standard interfaces",
    accent: "#C97E4F",
    image: "/images/lilaas/lf90.webp",
    detailImage: "/images/lilaas/lf90-detail.webp",
    applications: ["Workboats", "Pilot boats", "Small ferries"],
    specs: [
      { label: "Travel", value: "±45°" },
      { label: "Supply voltage", value: "24 VDC" },
      { label: "Interface", value: "Analogue / CAN" },
      { label: "Protection rating", value: "IP65" },
    ],
  },
  {
    slug: "le90",
    model: "LE90",
    family: "LE",
    tagline: "Electric lever engineered for system integrators.",
    description:
      "Designed for OEMs building their own control systems on top of our motion hardware. Full CAN/Modbus interface, configurable detents and travel.",
    highlight: "OEM-friendly · Fully electric · Configurable",
    accent: "#2BD4B4",
    image: "/images/lilaas/le90.webp",
    detailImage: "/images/lilaas/le90-detail.webp",
    applications: ["Integrators", "OEM bridge suppliers"],
    specs: [
      { label: "Travel", value: "Configurable" },
      { label: "Detents", value: "Software-defined" },
      { label: "Interface", value: "CAN, Modbus, analogue" },
      { label: "Supply voltage", value: "24 VDC" },
    ],
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
