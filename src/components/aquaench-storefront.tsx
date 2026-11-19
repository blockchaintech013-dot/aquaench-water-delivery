import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Droplet,
  Heart,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Moon,
  PackageCheck,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sun,
  Truck,
  UserRound,
  X,
  Waves,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  AQUAENCH_PRODUCTS,
  calculateOrderTotal,
  calculateWaterSubtotal,
  DELIVERY_FEE,
  type CartLine,
  type ProductId,
} from "@/lib/aquaench-store";
import bottle10 from "@/assets/aquaench-10l.png.asset.json";
import bottle20 from "@/assets/aquaench-20l.png.asset.json";
import brandLabel from "@/assets/aquaench-label.png.asset.json";

const storageKeys = {
  cart: "aquaench-cart",
  theme: "aquaench-theme",
  session: "aquaench-demo-session",
  customer: "aquaench-customer",
  orders: "aquaench-orders",
  lastOrder: "aquaench-last-order",
} as const;

const productImages: Record<ProductId, string> = {
  "20L": bottle20.url,
  "10L": bottle10.url,
};

const money = (amount: number) => `Ksh ${amount.toLocaleString("en-KE")}`;

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The storefront remains usable when browser storage is unavailable.
  }
}

interface CustomerDetails {
  fullName: string;
  phone: string;
  alternativePhone: string;
  area: string;
  location: string;
  instructions: string;
}

const emptyCustomer: CustomerDetails = {
  fullName: "",
  phone: "",
  alternativePhone: "",
  area: "",
  location: "",
  instructions: "",
};

interface DemoOrder {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartLine[];
  needsBottle: boolean;
  bottleQuantity: number;
  waterSubtotal: number;
  total: number;
}

function useAquaenchState() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [lastOrder, setLastOrder] = useState<DemoOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStored(storageKeys.cart, []));
    setTheme(readStored(storageKeys.theme, "light"));
    setSessionEmail(readStored(storageKeys.session, null));
    setCustomer(readStored(storageKeys.customer, emptyCustomer));
    setOrders(readStored(storageKeys.orders, []));
    setLastOrder(readStored(storageKeys.lastOrder, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!hydrated) return;
    writeStored(storageKeys.cart, cart);
    writeStored(storageKeys.theme, theme);
    writeStored(storageKeys.session, sessionEmail);
    writeStored(storageKeys.customer, customer);
    writeStored(storageKeys.orders, orders);
    writeStored(storageKeys.lastOrder, lastOrder);
  }, [cart, theme, sessionEmail, customer, orders, lastOrder, hydrated]);

  return {
    cart,
    setCart,
    theme,
    setTheme,
    sessionEmail,
    setSessionEmail,
    customer,
    setCustomer,
    orders,
    setOrders,
    lastOrder,
    setLastOrder,
  };
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <a href="#home" aria-label="Aquaench home" className="group inline-flex items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
        <Droplet className="size-6 fill-current" strokeWidth={1.6} />
      </span>
      <span className="min-w-0">
        <span className={`block font-display text-xl font-extrabold leading-none ${inverse ? "text-footer-foreground" : "text-foreground"}`}>
          Aquaench
        </span>
        <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] ${inverse ? "text-footer-foreground/75" : "text-muted-foreground"}`}>
          Pure. Refreshing. Essential.
        </span>
      </span>
    </a>
  );
}

function Navbar({
  cartCount,
  theme,
  onThemeToggle,
  onCartOpen,
  onAccountOpen,
}: {
  cartCount: number;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  onCartOpen: () => void;
  onAccountOpen: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Home", "#home"],
    ["Products", "#products"],
    ["About Us", "#about"],
    ["Contact", "#contact"],
  ];

  const navLinks = (mobile = false) =>
    links.map(([label, href]) => (
      <a
        key={label}
        href={href}
        onClick={() => setMenuOpen(false)}
        className={`text-sm font-semibold text-muted-foreground transition-colors hover:text-primary ${mobile ? "rounded-md px-3 py-2.5 hover:bg-accent" : "py-2"}`}
      >
        {label}
      </a>
    ));

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-9 max-w-7xl items-center justify-center gap-2 px-4 text-xs font-semibold sm:text-sm">
          <Truck className="size-4" aria-hidden="true" />
          <span>Always free delivery</span>
          <span aria-hidden="true" className="opacity-65">·</span>
          <span className="hidden sm:inline">Across Kitale</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="relative mx-auto grid min-h-[4.5rem] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-6 lg:px-8">
          <BrandMark />
          <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
            {navLinks()}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              title={theme === "light" ? "Dark theme" : "Light theme"}
              onClick={onThemeToggle}
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
            <Button variant="ghost" size="icon" aria-label={`Shopping cart, ${cartCount} items`} title="Shopping cart" className="relative" onClick={onCartOpen}>
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-aqua text-[10px] font-bold text-navy">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Your account" title="Your account" onClick={onAccountOpen}>
              <UserRound />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              title="Navigation menu"
              className="lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
          {menuOpen && (
            <nav aria-label="Mobile navigation" className="absolute inset-x-0 top-full z-50 grid gap-1 border-b border-border bg-background px-4 py-3 shadow-lg lg:hidden">
              {navLinks(true)}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

function HeroSection() {
  return (
    <section id="home" className="scroll-mt-24 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-8 lg:py-20">
        <div className="relative z-10 order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold text-primary shadow-sm">
            <Waves className="size-4 text-aqua" />
            Kitale’s refreshing choice
          </span>
          <h1 className="mt-5 max-w-xl font-display text-[2.6rem] font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-[3.65rem]">
            Welcome to <span className="text-primary">Aquaench Water</span>
          </h1>
          <p className="mt-4 font-display text-xl font-bold text-aqua sm:text-2xl">Pure. Refreshing. Essential.</p>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            Fresh, clean drinking water delivered straight to your doorstep in Kitale.
          </p>
          <p className="mt-4 font-display text-xl font-extrabold text-navy sm:text-2xl dark:text-aqua">
            Usipanic maji inakam!
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-md px-6 font-bold shadow-md shadow-primary/15">
              <a href="#products">Shop Now <ArrowRight className="size-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-md px-6 font-bold">
              <a href="#about">Learn More <ArrowDown className="size-4" /></a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="grid size-7 place-items-center rounded-full bg-accent text-primary"><Check className="size-4" /></span>
            Delivery is always on us
          </div>
        </div>

        <div className="relative order-1 min-w-0 lg:order-2">
          <div className="relative overflow-hidden rounded-lg border border-border bg-secondary px-4 py-8 sm:px-8 sm:py-10">
            <img
              src={brandLabel.url}
              alt="Aquaench’s cheerful water-drop mascot and signature Usipanic maji inakam! label"
              className="mx-auto aspect-[2.1/1] w-full max-w-2xl rounded-md object-contain"
            />
            <div className="absolute bottom-3 right-3 grid size-20 place-items-center rounded-full border-4 border-background bg-background p-1 shadow-lg sm:bottom-5 sm:right-5 sm:size-28">
              <img src={bottle20.url} alt="Aquaench 20-litre water bottle" className="h-full w-full object-contain" />
            </div>
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-bold text-primary shadow-sm sm:left-5 sm:top-5">
              <Droplet className="size-3.5 fill-current" /> 100% refreshing
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-sm sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-primary"><Truck className="size-5" /></span>
              <span className="min-w-0"><span className="block truncate text-sm font-bold text-foreground">Free doorstep delivery</span><span className="mt-0.5 block text-xs text-muted-foreground">Serving Kitale, Kenya</span></span>
            </div>
            <span className="shrink-0 font-display text-sm font-extrabold text-primary">Ksh 0</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ productId, onAdd }: { productId: ProductId; onAdd: (productId: ProductId) => void }) {
  const product = AQUAENCH_PRODUCTS[productId];
  return (
    <article className="group grid overflow-hidden rounded-lg border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 sm:grid-cols-[0.95fr_1.05fr]">
      <div className="relative grid min-h-64 place-items-center overflow-hidden bg-secondary px-5 py-6 sm:min-h-80">
        <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1.5 text-xs font-bold text-primary shadow-sm">Free delivery</span>
        <img
          src={productImages[productId]}
          alt={`${product.volume} water bottle`}
          className="h-60 w-full object-contain transition-transform duration-500 group-hover:scale-[1.04] sm:h-72"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Aquaench drinking water</span>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h3 className="font-display text-3xl font-extrabold text-foreground">{product.name}</h3>
          <span className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-primary">{product.volume}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Clean, refreshing water for every day.</p>
        <div className="mt-6 flex items-end justify-between gap-3 border-t border-border pt-5">
          <p className="font-display text-2xl font-extrabold text-primary">{money(product.price)}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Truck className="size-4 text-aqua" /> Free delivery</span>
        </div>
        <Button className="mt-5 h-11 w-full font-bold" onClick={() => onAdd(productId)}>
          <ShoppingBag className="size-4" /> Tap to Select
        </Button>
      </div>
    </article>
  );
}

function ProductsSection({ onAdd }: { onAdd: (productId: ProductId) => void }) {
  return (
    <section id="products" className="scroll-mt-24 border-y border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Good water, your way</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">Choose Your Water</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">Quality drinking water in convenient sizes, delivered free to your doorstep.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-7">
          <ProductCard productId="20L" onAdd={onAdd} />
          <ProductCard productId="10L" onAdd={onAdd} />
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
          <ShieldCheck className="size-4 text-aqua" /> No delivery fees. Just fresh water.
        </p>
      </div>
    </section>
  );
}

function AboutSection() {
  const [expanded, setExpanded] = useState(false);
  const values = [
    { icon: Droplet, title: "Pure Water", text: "Quality drinking water for your everyday needs." },
    { icon: Truck, title: "Convenient Delivery", text: "Water brought right to your doorstep in Kitale." },
    { icon: Heart, title: "Essential Refreshment", text: "Making it easier to stay refreshed, every day." },
  ];
  return (
    <section id="about" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary"><Droplet className="size-4" /> Our promise</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">About Aquaench</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>Aquaench is committed to making access to clean, refreshing drinking water simple and convenient. We bring quality drinking water closer to homes and businesses through reliable doorstep delivery.</p>
              <p>Our goal is to make staying hydrated easier by providing convenient water sizes, dependable service, and free delivery.</p>
              {expanded && <p>From a quick refill at home to keeping a workplace supplied, we make ordering simple and delivery dependable. Welcome to Aquaench — pure, refreshing, essential.</p>}
            </div>
            <Button variant="outline" className="mt-6 gap-2 font-bold" onClick={() => setExpanded((value) => !value)}>
              {expanded ? "Read Less" : "Read More"}<ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:items-center">
            {values.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className={`rounded-lg border border-border bg-background p-5 ${index === 1 ? "sm:translate-y-5" : ""}`}>
                <span className="grid size-11 place-items-center rounded-md bg-accent text-primary"><Icon className="size-5" /></span>
                <h3 className="mt-4 font-display text-base font-extrabold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const message = encodeURIComponent("Hello Aquaench, I would like to order drinking water.");
  return (
    <section id="contact" className="scroll-mt-24 bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">We’re nearby</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">Contact Us</h2>
          <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">Need water delivered? Get in touch with Aquaench.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-11 font-bold"><a href={`https://wa.me/254762206950?text=${message}`} target="_blank" rel="noreferrer"><Phone className="size-4" /> WhatsApp Us</a></Button>
            <Button asChild variant="outline" className="h-11 font-bold"><a href="tel:+254762206950"><Phone className="size-4" /> Call Us</a></Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-5 sm:col-span-2">
            <span className="grid size-10 place-items-center rounded-md bg-accent text-primary"><MapPin className="size-5" /></span>
            <h3 className="mt-4 font-display text-lg font-extrabold text-foreground">Welcome, Kitale</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Gatua, Kitale<br />Kenya</p>
          </div>
          <a href="tel:+254762206950" className="group rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary/35">
            <span className="grid size-10 place-items-center rounded-md bg-accent text-primary"><Phone className="size-5" /></span>
            <span className="mt-4 block text-xs font-semibold text-muted-foreground">Call us</span>
            <span className="mt-1 block break-all font-display text-lg font-extrabold text-foreground group-hover:text-primary">+254 762 206 950</span>
          </a>
          <a href={`https://wa.me/254762206950?text=${message}`} target="_blank" rel="noreferrer" className="group rounded-lg border border-border bg-background p-5 transition-colors hover:border-primary/35">
            <span className="grid size-10 place-items-center rounded-md bg-accent text-primary"><Phone className="size-5" /></span>
            <span className="mt-4 block text-xs font-semibold text-muted-foreground">WhatsApp</span>
            <span className="mt-1 block break-all font-display text-lg font-extrabold text-foreground group-hover:text-primary">+254 762 206 950</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = [["Home", "#home"], ["Products", "#products"], ["About Us", "#about"], ["Contact Us", "#contact"]];
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr_1fr] lg:px-8">
        <div>
          <BrandMark inverse />
          <p className="mt-4 max-w-xs text-sm leading-6 text-footer-foreground/75">Pure. Refreshing. Essential.</p>
          <p className="mt-2 text-sm font-bold text-footer-foreground">Usipanic maji inakam!</p>
        </div>
        <div>
          <h2 className="text-sm font-bold">Quick links</h2>
          <nav aria-label="Footer navigation" className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {footerLinks.map(([label, href]) => <a key={label} href={href} className="text-sm text-footer-foreground/75 transition-colors hover:text-footer-foreground">{label}</a>)}
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-bold">Come say hello</h2>
          <p className="mt-3 text-sm leading-6 text-footer-foreground/75">Gatua, Kitale, Kenya</p>
          <a href="tel:+254762206950" className="mt-1 block text-sm text-footer-foreground/75 hover:text-footer-foreground">+254 762 206 950</a>
          <a href={`https://wa.me/254762206950?text=${encodeURIComponent("Hello Aquaench, I would like to order drinking water.")}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-footer-foreground hover:underline"><Phone className="size-4" /> WhatsApp</a>
        </div>
      </div>
      <div className="border-t border-footer-foreground/15 px-4 py-4 text-center text-xs text-footer-foreground/70">
        © 2026 Aquaench Water. All rights reserved.
      </div>
    </footer>
  );
}

function OrderTotals({ cart, needsBottle = false, bottleQuantity = 1 }: { cart: CartLine[]; needsBottle?: boolean; bottleQuantity?: number }) {
  const subtotal = calculateWaterSubtotal(cart);
  const total = calculateOrderTotal(cart, needsBottle, bottleQuantity);
  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span className="font-semibold text-foreground">{money(subtotal)}</span></div>
      {needsBottle && <div className="flex justify-between gap-3 text-sm text-muted-foreground"><span className="min-w-0">Aquaench bottle · {bottleQuantity} <span className="text-xs">(price to be confirmed)</span></span><span className="shrink-0 text-xs font-semibold">Not included</span></div>}
      <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery</span><span className="font-semibold text-primary">FREE</span></div>
      <div className="flex items-center justify-between border-t border-border pt-3"><span className="font-display text-base font-extrabold text-foreground">Total payable</span><span className="font-display text-xl font-extrabold text-primary">{money(total)}</span></div>
      {needsBottle && <p className="text-xs leading-5 text-muted-foreground">The bottle price is configurable and isn’t added to your total until confirmed.</p>}
    </div>
  );
}

function QuantityStepper({ value, onDecrease, onIncrease, label }: { value: number; onDecrease: () => void; onIncrease: () => void; label: string }) {
  return (
    <div className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background p-0.5">
      <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`Decrease ${label}`} title={`Decrease ${label}`} onClick={onDecrease}><Minus className="size-3.5" /></Button>
      <span className="w-7 text-center text-sm font-bold tabular-nums" aria-live="polite">{value}</span>
      <Button type="button" size="icon" variant="ghost" className="size-8" aria-label={`Increase ${label}`} title={`Increase ${label}`} onClick={onIncrease}><Plus className="size-3.5" /></Button>
    </div>
  );
}

function CheckoutProgress({ step }: { step: number }) {
  const labels = ["Order", "Bottle", "Details", "Review"];
  return (
    <ol aria-label="Checkout progress" className="grid grid-cols-4 gap-2 px-5 pt-4 sm:px-7">
      {labels.map((label, index) => {
        const number = index + 1;
        const isCurrent = step === number;
        const isComplete = step > number;
        return (
          <li key={label} className={`min-w-0 border-t-2 pt-2 text-center text-[11px] font-semibold ${isCurrent || isComplete ? "border-primary text-primary" : "border-border text-muted-foreground"}`} aria-current={isCurrent ? "step" : undefined}>
            <span className="truncate">{isComplete ? <Check className="mx-auto size-3.5" /> : label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function CartContents({
  cart,
  onQuantityChange,
  onStartCheckout,
}: {
  cart: CartLine[];
  onQuantityChange: (productId: ProductId, adjustment: number) => void;
  onStartCheckout: () => void;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
        {cart.length === 0 ? (
          <div className="grid min-h-72 place-items-center text-center">
            <div className="max-w-xs">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-primary"><ShoppingBag className="size-7" /></span>
              <h3 className="mt-4 font-display text-lg font-extrabold text-foreground">Your cart is ready for a refill</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a water size and we’ll bring it to your doorstep.</p>
              <Button asChild variant="outline" className="mt-5 font-bold"><a href="#products">Explore water sizes</a></Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">Fresh water, on its way to you.</p>
            {cart.map((line) => {
              const product = AQUAENCH_PRODUCTS[line.productId];
              return (
                <div key={line.productId} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-b border-border pb-5">
                  <div className="grid size-[4.5rem] place-items-center rounded-md bg-secondary p-1"><img src={productImages[line.productId]} alt="" className="h-full w-full object-contain" /></div>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate font-display font-bold text-foreground">{product.name} water</h3><p className="mt-0.5 text-xs text-muted-foreground">{product.volume}</p></div><span className="shrink-0 text-sm font-bold text-foreground">{money(product.price * line.quantity)}</span></div>
                    <div className="mt-3 flex items-center justify-between gap-2"><QuantityStepper value={line.quantity} label={`${product.name} water`} onDecrease={() => onQuantityChange(line.productId, -1)} onIncrease={() => onQuantityChange(line.productId, 1)} /><span className="text-xs text-muted-foreground">{money(product.price)} each</span></div>
                  </div>
                </div>
              );
            })}
            <OrderTotals cart={cart} />
          </div>
        )}
      </div>
      {cart.length > 0 && <div className="border-t border-border bg-background p-5 sm:p-7"><Button className="h-12 w-full font-bold" onClick={onStartCheckout}>Continue to checkout <ArrowRight className="size-4" /></Button><p className="mt-3 text-center text-xs text-muted-foreground">Free delivery · No payment collected here</p></div>}
    </>
  );
}

function CheckoutContents({
  step,
  cart,
  customer,
  onCustomerChange,
  needsBottle,
  onBottleChange,
  bottleQuantity,
  onBottleQuantityChange,
  onBack,
  onContinue,
  onPlaceOrder,
  confirmedOrder,
  onReturnHome,
}: {
  step: number;
  cart: CartLine[];
  customer: CustomerDetails;
  onCustomerChange: (field: keyof CustomerDetails, value: string) => void;
  needsBottle: boolean;
  onBottleChange: (value: boolean) => void;
  bottleQuantity: number;
  onBottleQuantityChange: (adjustment: number) => void;
  onBack: () => void;
  onContinue: () => void;
  onPlaceOrder: () => void;
  confirmedOrder: DemoOrder | null;
  onReturnHome: () => void;
}) {
  const [customerError, setCustomerError] = useState("");

  const continueFromDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.area.trim() || !customer.location.trim()) {
      setCustomerError("Please fill in your name, phone, area and delivery location.");
      return;
    }
    setCustomerError("");
    onContinue();
  };

  if (step === 5 && confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} onReturnHome={onReturnHome} />;
  }

  if (step === 1) {
    return (
      <>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div className="space-y-4">
            {cart.map((line) => {
              const product = AQUAENCH_PRODUCTS[line.productId];
              return <div key={line.productId} className="flex items-center justify-between gap-3 border-b border-border pb-3"><div className="flex min-w-0 items-center gap-3"><img src={productImages[line.productId]} alt="" className="size-14 shrink-0 rounded-md bg-secondary object-contain" /><p className="min-w-0 text-sm font-semibold text-foreground"><span className="block truncate">{line.quantity} × {product.name} water</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{money(product.price)} each</span></p></div><span className="shrink-0 text-sm font-bold text-foreground">{money(product.price * line.quantity)}</span></div>;
            })}
          </div>
          <div className="mt-5"><OrderTotals cart={cart} /></div>
        </div>
        <CheckoutActions onBack={onBack} onContinue={onContinue} continueLabel="Choose bottle options" />
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <p className="text-sm leading-6 text-muted-foreground">A bottle is optional — choose what works for you.</p>
          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">Do you need a water bottle?</legend>
            {[
              { value: false, label: "No, I already have a bottle", icon: Check },
              { value: true, label: "Yes, add a bottle", icon: Plus },
            ].map(({ value, label, icon: Icon }) => (
              <button key={label} type="button" aria-pressed={needsBottle === value} onClick={() => onBottleChange(value)} className={`grid w-full grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border p-4 text-left transition-colors ${needsBottle === value ? "border-primary bg-accent" : "border-border bg-background hover:border-primary/35"}`}>
                <span className={`grid size-10 place-items-center rounded-md ${needsBottle === value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}><Icon className="size-4" /></span>
                <span className="min-w-0 text-sm font-bold text-foreground">{label}</span>
                <span className={`grid size-5 place-items-center rounded-full border ${needsBottle === value ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{needsBottle === value && <Check className="size-3" />}</span>
              </button>
            ))}
          </fieldset>
          {needsBottle && (
            <div className="mt-5 rounded-md border border-border bg-secondary/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0"><p className="font-display font-bold text-foreground">Aquaench refill bottle</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Bottle option · placeholder product</p><p className="mt-2 text-xs font-semibold text-primary">Price to be confirmed — not included in total</p></div>
                <QuantityStepper value={bottleQuantity} label="bottles" onDecrease={() => onBottleQuantityChange(-1)} onIncrease={() => onBottleQuantityChange(1)} />
              </div>
            </div>
          )}
          <div className="mt-6"><OrderTotals cart={cart} needsBottle={needsBottle} bottleQuantity={bottleQuantity} /></div>
        </div>
        <CheckoutActions onBack={onBack} onContinue={onContinue} continueLabel="Add delivery details" />
      </>
    );
  }

  if (step === 3) {
    const fields: { key: keyof CustomerDetails; label: string; placeholder: string; type?: string; required?: boolean }[] = [
      { key: "fullName", label: "Full name", placeholder: "Your name", required: true },
      { key: "phone", label: "Phone number", placeholder: "+254 7…", type: "tel", required: true },
      { key: "alternativePhone", label: "Alternative phone (optional)", placeholder: "Another contact number", type: "tel" },
      { key: "area", label: "Estate / Area", placeholder: "e.g. Gatua", required: true },
      { key: "location", label: "Specific delivery location", placeholder: "Building, landmark or directions", required: true },
    ];
    return (
      <form onSubmit={continueFromDetails} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <p className="mb-5 text-sm leading-6 text-muted-foreground">Tell us where to bring your order in Kitale.</p>
          <div className="space-y-4">
            {fields.map(({ key, label, placeholder, type = "text", required }) => (
              <label key={key} className="block text-sm font-semibold text-foreground">{label}<Input type={type} required={required} autoComplete={key === "fullName" ? "name" : key === "phone" ? "tel" : "off"} placeholder={placeholder} value={customer[key]} onChange={(event) => onCustomerChange(key, event.target.value)} className="mt-1.5 h-11" /></label>
            ))}
            <label className="block text-sm font-semibold text-foreground">Additional delivery instructions (optional)<Textarea rows={3} placeholder="Anything that will help us find you" value={customer.instructions} onChange={(event) => onCustomerChange("instructions", event.target.value)} className="mt-1.5 resize-y" /></label>
          </div>
          {customerError && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{customerError}</p>}
        </div>
        <div className="border-t border-border bg-background p-5 sm:p-7"><div className="flex gap-3"><Button type="button" variant="outline" size="icon" aria-label="Back to bottle selection" onClick={onBack}><ArrowLeft /></Button><Button type="submit" className="h-11 flex-1 font-bold">Review order <ArrowRight className="size-4" /></Button></div></div>
      </form>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
        <div className="rounded-md border border-border bg-secondary/50 p-4">
          <div className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><div className="min-w-0"><p className="break-words text-sm font-bold text-foreground">{customer.fullName}</p><p className="mt-1 text-sm text-muted-foreground">{customer.phone}{customer.alternativePhone ? ` · ${customer.alternativePhone}` : ""}</p><p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{customer.area} · {customer.location}</p>{customer.instructions && <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{customer.instructions}</p>}</div></div>
        </div>
        <h3 className="mb-3 mt-6 font-display font-bold text-foreground">Your water</h3>
        <div className="space-y-3">
          {cart.map((line) => {
            const product = AQUAENCH_PRODUCTS[line.productId];
            return <div key={line.productId} className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{line.quantity} × {product.name} · {product.volume}</span><span className="shrink-0 font-semibold text-foreground">{money(product.price * line.quantity)}</span></div>;
          })}
          {needsBottle && <div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{bottleQuantity} × Aquaench refill bottle</span><span className="shrink-0 text-right text-xs font-semibold text-muted-foreground">Price to be confirmed</span></div>}
        </div>
        <div className="mt-5"><OrderTotals cart={cart} needsBottle={needsBottle} bottleQuantity={bottleQuantity} /></div>
        <p className="mt-5 rounded-md bg-accent px-4 py-3 text-xs leading-5 text-accent-foreground">Demo order only. No payment will be collected or marked as received.</p>
      </div>
      <div className="border-t border-border bg-background p-5 sm:p-7"><div className="flex gap-3"><Button type="button" variant="outline" size="icon" aria-label="Back to delivery details" onClick={onBack}><ArrowLeft /></Button><Button type="button" className="h-11 flex-1 font-bold" onClick={onPlaceOrder}>Place Order <Check className="size-4" /></Button></div></div>
    </>
  );
}

function CheckoutActions({ onBack, onContinue, continueLabel }: { onBack: () => void; onContinue: () => void; continueLabel: string }) {
  return <div className="border-t border-border bg-background p-5 sm:p-7"><div className="flex gap-3"><Button type="button" variant="outline" size="icon" aria-label="Go back" onClick={onBack}><ArrowLeft /></Button><Button type="button" className="h-11 flex-1 font-bold" onClick={onContinue}>{continueLabel} <ArrowRight className="size-4" /></Button></div></div>;
}

function OrderConfirmation({ order, onReturnHome }: { order: DemoOrder; onReturnHome: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-7">
      <div className="mx-auto max-w-sm text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-primary"><PackageCheck className="size-8" /></span>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-primary">Order received</p>
        <h3 className="mt-2 font-display text-2xl font-extrabold text-foreground">Asante, {order.customer.fullName.split(" ")[0]}!</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Your demo order is saved on this device.</p>
        <p className="mt-4 rounded-md bg-accent px-4 py-3 font-display text-lg font-extrabold text-primary">Order {order.id}</p>
      </div>
      <div className="mx-auto mt-6 max-w-sm rounded-md border border-border p-4">
        <h4 className="font-display font-bold text-foreground">Order details</h4>
        <p className="mt-2 break-words text-sm text-muted-foreground">{order.customer.phone} · {order.customer.area}, {order.customer.location}</p>
        <div className="mt-4 space-y-3">
          {order.items.map((line) => {
            const product = AQUAENCH_PRODUCTS[line.productId];
            return <div key={line.productId} className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{line.quantity} × {product.name} water</span><span className="shrink-0 font-semibold text-foreground">{money(product.price * line.quantity)}</span></div>;
          })}
          {order.needsBottle && <div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{order.bottleQuantity} × refill bottle</span><span className="shrink-0 text-right text-xs font-semibold text-muted-foreground">Price to be confirmed</span></div>}
        </div>
        <div className="mt-4 border-t border-border pt-3"><div className="flex justify-between text-sm text-muted-foreground"><span>Delivery</span><span className="font-semibold text-primary">FREE</span></div><div className="mt-2 flex justify-between text-sm font-bold text-foreground"><span>Total payable</span><span className="text-primary">{money(order.total)}</span></div></div>
      </div>
      <p className="mx-auto mt-4 max-w-sm text-center text-xs leading-5 text-muted-foreground">No payment was taken or recorded. This is a frontend demo confirmation.</p>
      <Button className="mx-auto mt-5 flex h-11 w-full max-w-sm font-bold" onClick={onReturnHome}>Return to homepage <ArrowRight className="size-4" /></Button>
    </div>
  );
}

function CartDrawer({
  open,
  onOpenChange,
  cart,
  onQuantityChange,
  step,
  onStepChange,
  customer,
  onCustomerChange,
  needsBottle,
  onBottleChange,
  bottleQuantity,
  onBottleQuantityChange,
  onPlaceOrder,
  confirmedOrder,
  onReturnHome,
  onStartCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartLine[];
  onQuantityChange: (productId: ProductId, adjustment: number) => void;
  step: number;
  onStepChange: (step: number) => void;
  customer: CustomerDetails;
  onCustomerChange: (field: keyof CustomerDetails, value: string) => void;
  needsBottle: boolean;
  onBottleChange: (value: boolean) => void;
  bottleQuantity: number;
  onBottleQuantityChange: (adjustment: number) => void;
  onPlaceOrder: () => void;
  confirmedOrder: DemoOrder | null;
  onReturnHome: () => void;
  onStartCheckout: () => void;
}) {
  const titles = ["Your cart", "Order summary", "Bottle selection", "Delivery details", "Review your order", "Order confirmed"];
  const title = titles[step] ?? "Your cart";
  const description = step === 0 ? "Your Aquaench water, ready when you are." : step === 5 ? "Your order details are saved on this device." : `Step ${step} of 4 · Free delivery in Kitale`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-l border-border p-0 sm:max-w-lg" aria-describedby="cart-sheet-description">
        <SheetHeader className="shrink-0 border-b border-border px-5 py-5 pr-14 text-left sm:px-7">
          <SheetTitle className="font-display text-xl font-extrabold">{title}</SheetTitle>
          <SheetDescription id="cart-sheet-description">{description}</SheetDescription>
        </SheetHeader>
        {step > 0 && step < 5 && <CheckoutProgress step={step} />}
        {step === 0 ? (
          <CartContents cart={cart} onQuantityChange={onQuantityChange} onStartCheckout={onStartCheckout} />
        ) : (
          <CheckoutContents
            step={step}
            cart={cart}
            customer={customer}
            onCustomerChange={onCustomerChange}
            needsBottle={needsBottle}
            onBottleChange={onBottleChange}
            bottleQuantity={bottleQuantity}
            onBottleQuantityChange={onBottleQuantityChange}
            onBack={() => onStepChange(Math.max(1, step - 1))}
            onContinue={() => onStepChange(Math.min(4, step + 1))}
            onPlaceOrder={onPlaceOrder}
            confirmedOrder={confirmedOrder}
            onReturnHome={onReturnHome}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function AccountModal({
  open,
  onOpenChange,
  sessionEmail,
  orders,
  onSignIn,
  onSignOut,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionEmail: string | null;
  orders: DemoOrder[];
  onSignIn: (email: string) => void;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<"signin" | "create">("signin");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!email || password.length < 6) {
      setError("Enter an email and a password with at least 6 characters.");
      return;
    }
    setError("");
    onSignIn(email);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">{sessionEmail ? "Your Aquaench account" : "Welcome to Aquaench"}</DialogTitle>
          <DialogDescription>{sessionEmail ? "Your local demo account and saved orders." : "Sign in or create a demo account on this device."}</DialogDescription>
        </DialogHeader>
        {sessionEmail ? (
          <div className="mt-2">
            <div className="flex items-center gap-3 rounded-md bg-secondary p-4"><span className="grid size-10 place-items-center rounded-full bg-accent text-primary"><UserRound className="size-5" /></span><div className="min-w-0"><p className="text-xs font-semibold text-muted-foreground">Signed in as</p><p className="break-all text-sm font-bold text-foreground">{sessionEmail}</p></div></div>
            <div className="mt-5"><div className="flex items-center justify-between gap-3"><h3 className="font-display font-bold text-foreground">Demo orders</h3><span className="text-xs text-muted-foreground">Saved on this device</span></div>
              {orders.length === 0 ? <p className="mt-3 rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">Your demo orders will appear here.</p> : <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">{orders.map((order) => <div key={order.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{order.id}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-KE")} · {order.items.reduce((sum, line) => sum + line.quantity, 0)} water</p></div><span className="shrink-0 text-sm font-bold text-primary">{money(order.total)}</span></div>)}</div>}
            </div>
            <Button variant="outline" className="mt-5 w-full font-bold" onClick={onSignOut}>Sign Out</Button>
            <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Demo sign-in only. Passwords and profile details are not stored.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 rounded-md bg-secondary p-1" role="tablist" aria-label="Account options">
              <Button type="button" variant={tab === "signin" ? "default" : "ghost"} role="tab" aria-selected={tab === "signin"} onClick={() => { setTab("signin"); setError(""); }}>Sign In</Button>
              <Button type="button" variant={tab === "create" ? "default" : "ghost"} role="tab" aria-selected={tab === "create"} onClick={() => { setTab("create"); setError(""); }}>Create Account</Button>
            </div>
            <form key={tab} onSubmit={submit} className="mt-4 space-y-3">
              {tab === "create" && <><label className="block text-sm font-semibold text-foreground">Full name<Input name="fullName" autoComplete="name" required placeholder="Your name" className="mt-1.5 h-11" /></label><label className="block text-sm font-semibold text-foreground">Phone number<Input name="phone" type="tel" autoComplete="tel" required placeholder="+254 7…" className="mt-1.5 h-11" /></label></>}
              <label className="block text-sm font-semibold text-foreground">Email<Input name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="mt-1.5 h-11" /></label>
              <label className="block text-sm font-semibold text-foreground">Password<Input name="password" type="password" autoComplete={tab === "create" ? "new-password" : "current-password"} required minLength={6} placeholder="At least 6 characters" className="mt-1.5 h-11" /></label>
              {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="h-11 w-full font-bold">{tab === "create" ? "Create demo account" : "Sign in"} <ArrowRight className="size-4" /></Button>
            </form>
            <p className="mt-1 text-center text-xs leading-5 text-muted-foreground">Frontend demo only. Your sign-in email stays on this device; passwords and profile details are not stored.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AquaenchStorefront() {
  const store = useAquaenchState();
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [needsBottle, setNeedsBottle] = useState(false);
  const [bottleQuantity, setBottleQuantity] = useState(1);

  const cartCount = useMemo(() => store.cart.reduce((count, line) => count + line.quantity, 0), [store.cart]);

  const addToCart = (productId: ProductId) => {
    store.setCart((current) => {
      const match = current.find((line) => line.productId === productId);
      if (match) return current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { productId, quantity: 1 }];
    });
    toast.success(`${AQUAENCH_PRODUCTS[productId].name} water added to your cart`);
  };

  const adjustQuantity = (productId: ProductId, adjustment: number) => {
    store.setCart((current) => current.flatMap((line) => {
      if (line.productId !== productId) return [line];
      const quantity = line.quantity + adjustment;
      return quantity > 0 ? [{ ...line, quantity }] : [];
    }));
  };

  const placeOrder = () => {
    const order: DemoOrder = {
      id: `AQ-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: store.customer,
      items: [...store.cart],
      needsBottle,
      bottleQuantity,
      waterSubtotal: calculateWaterSubtotal(store.cart),
      total: calculateOrderTotal(store.cart, needsBottle, bottleQuantity),
    };
    store.setOrders((current) => [order, ...current].slice(0, 30));
    store.setLastOrder(order);
    store.setCart([]);
    setCheckoutStep(5);
    toast.success("Your demo order is confirmed");
  };

  const signIn = (email: string) => {
    store.setSessionEmail(email);
    toast.success("You’re signed in to your demo account");
  };

  const returnHome = () => {
    setCheckoutStep(0);
    setCartOpen(false);
    store.setLastOrder(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar
        cartCount={cartCount}
        theme={store.theme}
        onThemeToggle={() => store.setTheme((value) => value === "light" ? "dark" : "light")}
        onCartOpen={() => { setCheckoutStep(0); setCartOpen(true); }}
        onAccountOpen={() => setAccountOpen(true)}
      />
      <main>
        <HeroSection />
        <ProductsSection onAdd={addToCart} />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={store.cart}
        onQuantityChange={adjustQuantity}
        step={checkoutStep}
        onStepChange={setCheckoutStep}
        customer={store.customer}
        onCustomerChange={(field, value) => store.setCustomer((current) => ({ ...current, [field]: value }))}
        needsBottle={needsBottle}
        onBottleChange={setNeedsBottle}
        bottleQuantity={bottleQuantity}
        onBottleQuantityChange={(adjustment) => setBottleQuantity((quantity) => Math.max(1, quantity + adjustment))}
        onPlaceOrder={placeOrder}
        confirmedOrder={store.lastOrder}
        onReturnHome={returnHome}
        onStartCheckout={() => { setNeedsBottle(false); setBottleQuantity(1); setCheckoutStep(1); }}
      />
      <AccountModal
        open={accountOpen}
        onOpenChange={setAccountOpen}
        sessionEmail={store.sessionEmail}
        orders={store.orders}
        onSignIn={signIn}
        onSignOut={() => { store.setSessionEmail(null); toast("You’ve signed out of your demo account"); }}
      />
    </div>
  );
}