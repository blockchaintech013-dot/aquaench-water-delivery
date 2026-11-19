import { createFileRoute } from "@tanstack/react-router";
import AquaenchStorefront from "@/components/aquaench-storefront";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aquaench Water | Free Water Delivery in Kitale" },
      { name: "description", content: "Order fresh Aquaench 10L and 20L drinking water with always free doorstep delivery in Kitale." },
      { property: "og:title", content: "Aquaench Water | Free Water Delivery in Kitale" },
      { property: "og:description", content: "Pure. Refreshing. Essential. Order Aquaench drinking water for free doorstep delivery in Kitale." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AquaenchStorefront,
});
