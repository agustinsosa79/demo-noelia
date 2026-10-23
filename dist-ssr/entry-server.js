import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { createContext, useReducer, useState, useRef, useEffect, useCallback, useMemo, useContext, useLayoutEffect, useId, StrictMode } from "react";
import { prerender } from "react-dom/static";
import { Link, useLocation, useMatches, NavLink, Outlet, useParams, useSearchParams, createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
const CATEGORIES = [
  { slug: "proteinas", name: "Proteínas", h1: "Proteína en polvo", description: "Proteína de suero y vegetal en polvo." },
  { slug: "creatina", name: "Creatina", h1: "Creatina monohidrato", description: "Creatina monohidrato en polvo." },
  { slug: "pre-entreno", name: "Pre-entreno", h1: "Pre-entreno", description: "Fórmulas en polvo para tomar antes de entrenar." },
  { slug: "aminoacidos", name: "Aminoácidos", h1: "Aminoácidos BCAA", description: "Aminoácidos de cadena ramificada en polvo." },
  { slug: "vitaminas", name: "Vitaminas y minerales", h1: "Vitaminas y minerales", description: "Multivitamínicos y minerales en cápsulas." },
  { slug: "accesorios", name: "Accesorios", h1: "Accesorios para entrenar", description: "Botellas y accesorios para el gimnasio." }
];
const DEMO_DESCRIPTION = "Ficha de ejemplo: en el catálogo real acá va la descripción del fabricante, la tabla nutricional y el modo de uso.";
const PRODUCTS = [
  {
    slug: "proteina-de-suero-1kg",
    name: "Proteína de suero 1 kg",
    categorySlug: "proteinas",
    brand: null,
    isDemo: true,
    size: "1 kg",
    price: 38500,
    inStock: true,
    flavors: ["Chocolate", "Vainilla", "Frutilla"],
    image: { src: "/media/productos/proteina-suero.webp", alt: "Pote negro de proteína de suero de 1 kg." },
    shortDescription: "Proteína de suero en polvo.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Pote de 1 kg" },
      { label: "Porciones", value: "Según fabricante" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: true
  },
  {
    slug: "creatina-monohidrato-300g",
    name: "Creatina monohidrato 300 g",
    categorySlug: "creatina",
    brand: null,
    isDemo: true,
    size: "300 g",
    price: 27e3,
    inStock: true,
    flavors: [],
    image: { src: "/media/productos/creatina.webp", alt: "Pote negro de creatina monohidrato de 300 g." },
    shortDescription: "Creatina monohidrato sin sabor.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Pote de 300 g" },
      { label: "Sabor", value: "Sin sabor" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: true
  },
  {
    slug: "pre-entreno-300g",
    name: "Pre-entreno 300 g",
    categorySlug: "pre-entreno",
    brand: null,
    isDemo: true,
    size: "300 g",
    price: 29500,
    inStock: true,
    flavors: ["Limón", "Frutos rojos"],
    image: { src: "/media/productos/pre-entreno.webp", alt: "Pote negro de pre-entreno de 300 g." },
    shortDescription: "Fórmula pre-entreno en polvo.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Pote de 300 g" },
      { label: "Cafeína", value: "Según fabricante" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: true
  },
  {
    slug: "proteina-vegetal-900g",
    name: "Proteína vegetal 900 g",
    categorySlug: "proteinas",
    brand: null,
    isDemo: true,
    size: "900 g",
    price: 34e3,
    inStock: true,
    flavors: ["Cacao", "Neutro"],
    image: { src: "/media/productos/proteina-vegetal.webp", alt: "Dos potes negros de proteína vegetal." },
    shortDescription: "Proteína de origen vegetal en polvo.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Pote de 900 g" },
      { label: "Porciones", value: "Según fabricante" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: true
  },
  {
    slug: "bcaa-polvo-250g",
    name: "BCAA en polvo 250 g",
    categorySlug: "aminoacidos",
    brand: null,
    isDemo: true,
    size: "250 g",
    price: 21e3,
    inStock: false,
    flavors: ["Pomelo", "Mango"],
    image: { src: "/media/productos/bcaa.webp", alt: "Potes negros de aminoácidos BCAA." },
    shortDescription: "Aminoácidos de cadena ramificada en polvo.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Pote de 250 g" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: false
  },
  {
    slug: "multivitaminico-60-capsulas",
    name: "Multivitamínico 60 cápsulas",
    categorySlug: "vitaminas",
    brand: null,
    isDemo: true,
    size: "60 cápsulas",
    price: 16500,
    inStock: true,
    flavors: [],
    image: { src: "/media/productos/multivitaminico.webp", alt: "Frasco negro de multivitamínico con tapa dorada." },
    shortDescription: "Multivitamínico en cápsulas.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Frasco de 60 cápsulas" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: false
  },
  {
    slug: "magnesio-120-capsulas",
    name: "Magnesio 120 cápsulas",
    categorySlug: "vitaminas",
    brand: null,
    isDemo: true,
    size: "120 cápsulas",
    price: 14e3,
    inStock: true,
    flavors: [],
    image: { src: "/media/productos/magnesio.webp", alt: "Frascos de magnesio en cápsulas." },
    shortDescription: "Magnesio en cápsulas.",
    description: DEMO_DESCRIPTION,
    specs: [
      { label: "Presentación", value: "Frasco de 120 cápsulas" },
      { label: "Registro", value: "RNPA a completar" }
    ],
    featured: false
  },
  {
    slug: "botella-deportiva-600ml",
    name: "Botella deportiva 600 ml",
    categorySlug: "accesorios",
    brand: null,
    isDemo: true,
    size: "600 ml",
    price: 9e3,
    inStock: true,
    flavors: [],
    image: { src: "/media/productos/botella.webp", alt: "Botellas deportivas azul oscuro con tapa fucsia." },
    shortDescription: "Botella deportiva con pico.",
    description: "Ficha de ejemplo para un accesorio: acá va el material, la capacidad y las indicaciones de lavado.",
    specs: [
      { label: "Capacidad", value: "600 ml" },
      { label: "Material", value: "A confirmar" }
    ],
    featured: false
  }
];
const findProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);
const findCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
const normalize = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const PRODUCT_SORTS = ["destacados", "precio-asc", "precio-desc", "nombre"];
function queryProducts({ category, q, sort, featured }) {
  let result = PRODUCTS.filter((p) => !category || p.categorySlug === category);
  if (featured) result = result.filter((p) => p.featured);
  if (q?.trim()) {
    const terms = normalize(q.trim()).split(/\s+/);
    result = result.filter((p) => {
      const cat = findCategory(p.categorySlug)?.name ?? "";
      const hay = normalize([p.name, p.shortDescription, cat, ...p.flavors].join(" "));
      return terms.every((t) => hay.includes(t));
    });
  }
  switch (sort) {
    case "precio-asc":
      return [...result].sort((a, b) => a.price - b.price);
    case "precio-desc":
      return [...result].sort((a, b) => b.price - a.price);
    case "nombre":
      return [...result].sort((a, b) => a.name.localeCompare(b.name, "es"));
    default:
      return [...result].sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.inStock) - Number(a.inStock));
  }
}
const PLANS = [
  {
    slug: "asesoria-integral",
    number: "01",
    kind: "asesoria",
    status: "confirmado",
    source: "Flyer de servicios publicado en Instagram (07/08/2026)",
    name: "Asesoría integral",
    tagline: "Entrenamiento, plan nutricional y control semanal.",
    summary: "Empieza con una evaluación física. Con esa información Noelia arma tu plan de entrenamiento y tu plan nutricional, y cada semana revisa tu avance para ajustar lo que haga falta.",
    forWhom: [
      "Querés un plan armado para tu cuerpo y tu punto de partida.",
      "Necesitás ordenar entrenamiento y alimentación al mismo tiempo.",
      "Te sirve que alguien revise tu avance todas las semanas."
    ],
    notFor: ["Buscás solo una rutina, sin seguimiento."],
    includes: [
      { label: "Evaluación física", detail: "Punto de partida para armar el plan.", status: "confirmado" },
      { label: "Plan de entrenamiento", detail: "Según tu evaluación y tu objetivo.", status: "confirmado" },
      { label: "Plan nutricional personalizado", detail: "Acompaña al entrenamiento.", status: "confirmado" },
      { label: "Controles semanales", detail: "Revisión de avance y ajustes.", status: "confirmado" }
    ],
    modality: null,
    duration: null,
    checkIns: "Semanales",
    price: null,
    featured: true,
    image: { src: "/media/noelia-entrenando-espalda.webp", alt: "Noelia Perucci entrenando espalda en polea." },
    pending: ["Precio y forma de pago", "Modalidad: online, presencial o ambas", "Duración mínima", "Canal de los controles semanales"],
    seo: {
      h1: "Asesoría integral: entrenamiento y plan nutricional personalizado",
      title: "Asesoría integral: entrenamiento y plan nutricional personalizado",
      description: "Evaluación física, plan de entrenamiento, plan nutricional personalizado y controles semanales con Noelia Perucci, personal trainer certificada IFBB."
    }
  },
  {
    slug: "plan-de-entrenamiento",
    number: "02",
    kind: "entrenamiento",
    status: "propuesta",
    source: "Propuesta de diseño: versión solo entrenamiento de la asesoría",
    name: "Plan de entrenamiento",
    tagline: "Solo entrenamiento, a partir de una evaluación.",
    summary: "Para quien ya tiene resuelta su alimentación, sola o con su nutricionista, y necesita un plan de entrenamiento armado a partir de una evaluación física.",
    forWhom: [
      "Ya trabajás tu alimentación con otro profesional.",
      "Querés entrenar con un plan y dejar de improvisar en el gimnasio."
    ],
    notFor: ["Necesitás ayuda con la alimentación: te conviene la asesoría integral."],
    includes: [
      { label: "Evaluación física", detail: null, status: "propuesta" },
      { label: "Plan de entrenamiento", detail: null, status: "confirmado" },
      { label: "Seguimiento", detail: null, status: "propuesta" }
    ],
    modality: null,
    duration: null,
    checkIns: null,
    price: null,
    featured: false,
    image: { src: "/media/stock/barra-disco-oscuro-800.webp", alt: "Barra olímpica con discos en el piso de un gimnasio." },
    pending: ["Confirmar si se ofrece por separado", "Precio, modalidad y seguimiento"],
    seo: {
      h1: "Plan de entrenamiento personalizado",
      title: "Plan de entrenamiento personalizado",
      description: "Plan de entrenamiento armado a partir de una evaluación física, con Noelia Perucci, personal trainer certificada IFBB y Olympia."
    }
  },
  {
    slug: "preparacion-para-competir",
    number: "03",
    kind: "competencia",
    status: "propuesta",
    source: "Propuesta de diseño: Noelia compite en NPC (wellness) y tiene destacadas «Team BM»",
    name: "Preparación para competir",
    tagline: "Para tu primera competencia o la próxima.",
    summary: "Noelia compitió en NPC Córdoba en la categoría wellness. Esta opción está pensada para quien quiere preparar una competencia de físico con alguien que ya hizo ese proceso.",
    forWhom: ["Querés competir en una categoría de físico femenino y necesitás guía para la preparación."],
    notFor: ["Recién empezás a entrenar: conviene arrancar por la asesoría integral."],
    includes: [
      { label: "Plan de entrenamiento por etapas", detail: null, status: "propuesta" },
      { label: "Acompañamiento hasta la competencia", detail: null, status: "propuesta" }
    ],
    modality: null,
    duration: null,
    checkIns: null,
    price: null,
    featured: false,
    image: { src: "/media/noelia-tarima-npc-cordoba-cuadrada.webp", alt: "Noelia Perucci en la tarima de NPC Córdoba." },
    pending: ["Confirmar si ofrece preparación para competencia", "Qué incluye, categorías y duración"],
    seo: {
      h1: "Preparación para competencias de físico femenino",
      title: "Preparación para competencias de físico (wellness, bikini)",
      description: "Preparación para competencias de físico femenino con Noelia Perucci, atleta wellness NPC."
    }
  }
];
const findPlan = (slug) => PLANS.find((p) => p.slug === slug);
const MAX_QTY = 20;
const STORAGE_KEY = "np-cart-v2";
function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.key === action.line.key);
      if (!existing) return [...state, action.line];
      return state.map((l) => l.key === action.line.key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.line.quantity) } : l);
    }
    case "setQty":
      return state.map((l) => l.key === action.key ? { ...l, quantity: Math.max(1, Math.min(MAX_QTY, action.quantity)) } : l);
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "clear":
      return [];
  }
}
const CartContext = createContext(null);
function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const hydrated = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {
    }
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
    }
  }, [lines]);
  const add = useCallback((product, quantity, flavor) => {
    dispatch({
      type: "add",
      line: {
        key: `${product.slug}::${flavor ?? ""}`,
        slug: product.slug,
        name: product.name,
        flavor,
        size: product.size,
        image: product.image.src,
        unitPrice: product.price,
        quantity
      }
    });
    setBump((n) => n + 1);
  }, []);
  const value = useMemo(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
      isOpen,
      bump,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity: (key, quantity) => dispatch({ type: "setQty", key, quantity }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" })
    }),
    [lines, isOpen, bump, add]
  );
  return /* @__PURE__ */ jsx(CartContext.Provider, { value, children });
}
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
const site = {
  name: "Noelia Perucci",
  /** Dominio definitivo: pendiente. Se usa en canonical, Open Graph y sitemap. */
  url: "https://www.noeliaperucci.com.ar",
  locale: "es_AR",
  ogImage: "/og-image.jpg",
  contact: {
    /** Publicado en su flyer de servicios. Validar que siga vigente. */
    whatsappNumber: "5493412818319",
    whatsappDisplay: "+54 9 341 281-8319",
    instagram: "https://www.instagram.com/noelia_perucci/",
    instagramHandle: "@noelia_perucci",
    youtube: "https://www.youtube.com/@noelia_perucci",
    threads: "https://www.threads.com/@noelia_perucci"
  },
  /** Datos verificados públicamente (ART_DIRECTION.md §1). */
  credentials: [
    { title: "Personal Trainer IFBB Internacional", issuer: "IFBB", year: null },
    { title: "Bodybuilding & Fitness Trainer", issuer: "Academia Olympia Internacional", year: "2021" },
    { title: "Atleta wellness", issuer: "NPC Córdoba", year: null }
  ]
};
const nav = [
  { to: "/entrenamiento", label: "Planes" },
  { to: "/tienda", label: "Suplementos" },
  { to: "/sobre-noelia", label: "Sobre Noelia" },
  { to: "/contacto", label: "Contacto" }
];
const whatsappLink = (text) => `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
const absoluteUrl = (path) => new URL(path, site.url).toString();
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}
const prefersReducedMotion = () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
function magnetic(el, strength = 0.28) {
  if (!isFinePointer() || prefersReducedMotion()) return () => {
  };
  const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
  const move = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", leave);
    gsap.set(el, { x: 0, y: 0 });
  };
}
function flyToCart(source) {
  const target = document.querySelector("[data-cart-target]");
  if (!source || !target || prefersReducedMotion()) return;
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const ghost = source.cloneNode(true);
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    zIndex: "90",
    pointerEvents: "none",
    borderRadius: "12px",
    overflow: "hidden"
  });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap.timeline({ onComplete: () => ghost.remove() }).to(ghost, { x: dx, duration: 0.75, ease: "power2.inOut" }, 0).to(ghost, { y: dy, duration: 0.75, ease: "back.in(1.2)" }, 0).to(ghost, { scale: 0.08, opacity: 0.4, duration: 0.75, ease: "power3.in" }, 0);
}
const variants = {
  primary: { base: "bg-rose text-white", fill: "bg-ink", hoverText: "group-hover:text-white" },
  dark: { base: "bg-ink text-bone", fill: "bg-rose", hoverText: "group-hover:text-white" },
  light: { base: "bg-bone text-ink", fill: "bg-rose", hoverText: "group-hover:text-white" },
  outline: { base: "text-ink ring-1 ring-ink/25 ring-inset", fill: "bg-ink", hoverText: "group-hover:text-bone" },
  "outline-light": { base: "text-bone ring-1 ring-bone/35 ring-inset", fill: "bg-bone", hoverText: "group-hover:text-ink" },
  text: { base: "text-ink", fill: "", hoverText: "" }
};
const buttonClass = (variant = "primary", size = "md", extra = "") => variant === "text" ? `group inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-ink/25 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-rose ${extra}` : `group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 ${size === "lg" ? "h-14 pr-2 pl-7 text-[1rem]" : "h-12 pr-1.5 pl-6 text-[0.95rem]"} ${variants[variant].base} ${extra}`;
function Inner({ variant, children, arrow }) {
  if (variant === "text") {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      children,
      arrow && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "transition-transform duration-300 group-hover:translate-x-1", children: "→" })
    ] });
  }
  const v = variants[variant];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        className: `absolute inset-0 -z-10 translate-y-[101%] rounded-full transition-transform duration-[450ms] ease-(--ease-out-expo) group-hover:translate-y-0 ${v.fill}`
      }
    ),
    /* @__PURE__ */ jsx("span", { className: `transition-colors duration-300 ${v.hoverText} ${arrow ? "" : "pr-4.5"}`, children }),
    arrow && /* @__PURE__ */ jsxs(
      "span",
      {
        "aria-hidden": "true",
        className: `relative grid size-9 place-items-center overflow-hidden rounded-full ${variant === "primary" || variant === "dark" ? "bg-white/15" : "bg-ink/8"} ${v.hoverText}`,
        children: [
          /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: "size-3.5 transition-transform duration-[450ms] ease-(--ease-out-expo) group-hover:translate-x-[180%]", children: /* @__PURE__ */ jsx("path", { d: "M1 8h13M9 3l5 5-5 5", fill: "none", stroke: "currentColor", strokeWidth: "1.6" }) }),
          /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: "absolute size-3.5 -translate-x-[180%] transition-transform duration-[450ms] ease-(--ease-out-expo) group-hover:translate-x-0", children: /* @__PURE__ */ jsx("path", { d: "M1 8h13M9 3l5 5-5 5", fill: "none", stroke: "currentColor", strokeWidth: "1.6" }) })
        ]
      }
    )
  ] });
}
function useMagnetic(enabled) {
  const ref = useRef(null);
  useEffect(() => enabled && ref.current ? magnetic(ref.current, 0.18) : void 0, [enabled]);
  return ref;
}
function ButtonLink({ to, variant = "primary", size, arrow = true, magnetic: mag = false, className = "", children }) {
  const ref = useMagnetic(mag);
  return /* @__PURE__ */ jsx(Link, { ref, to, className: buttonClass(variant, size, className), children: /* @__PURE__ */ jsx(Inner, { variant, arrow, children }) });
}
function ButtonExternal({
  variant = "primary",
  size,
  arrow = true,
  magnetic: mag = false,
  className = "",
  children,
  ...rest
}) {
  const ref = useMagnetic(mag);
  return /* @__PURE__ */ jsx("a", { ref, target: "_blank", rel: "noopener noreferrer", className: buttonClass(variant, size, className), ...rest, children: /* @__PURE__ */ jsxs(Inner, { variant, arrow, children: [
    children,
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: " (se abre en otra pestaña)" })
  ] }) });
}
function Button({
  variant = "primary",
  size,
  arrow = false,
  magnetic: mag = false,
  className = "",
  children,
  ...rest
}) {
  const ref = useMagnetic(mag);
  return /* @__PURE__ */ jsx("button", { ref, className: buttonClass(variant, size, className), ...rest, children: /* @__PURE__ */ jsx(Inner, { variant, arrow, children }) });
}
const ars = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const formatPrice = (amount) => ars.format(amount);
const pluralize = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const ScrollContext = createContext({ lenis: null, scrollTo: () => {
} });
function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const raf = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    raf.current = (time) => instance.raf(time * 1e3);
    gsap.ticker.add(raf.current);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      if (raf.current) gsap.ticker.remove(raf.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);
  const api = {
    lenis,
    scrollTo: (target, opts = {}) => {
      if (lenis) {
        lenis.scrollTo(target, { offset: opts.offset ?? -80, immediate: opts.immediate, duration: 1.2 });
        return;
      }
      if (typeof target === "number") window.scrollTo({ top: target });
      else {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView();
      }
    }
  };
  return /* @__PURE__ */ jsx(ScrollContext.Provider, { value: api, children });
}
const useSmoothScroll = () => useContext(ScrollContext);
function QuantityStepper({ value, onChange, label, size = "md" }) {
  const h = size === "sm" ? "h-10" : "h-14";
  const btn = `grid ${size === "sm" ? "w-10" : "w-12"} place-items-center text-lg transition-colors hover:text-rose disabled:pointer-events-none disabled:opacity-30`;
  return /* @__PURE__ */ jsxs("div", { role: "group", "aria-label": label, className: `inline-flex ${h} items-stretch rounded-full border border-line bg-white`, children: [
    /* @__PURE__ */ jsx("button", { type: "button", className: btn, onClick: () => onChange(value - 1), disabled: value <= 1, "aria-label": "Restar una unidad", children: "−" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        inputMode: "numeric",
        min: 1,
        max: MAX_QTY,
        value,
        "aria-label": "Cantidad",
        onChange: (e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.max(1, Math.min(MAX_QTY, Math.round(n))));
        },
        className: "w-8 bg-transparent text-center font-mono [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      }
    ),
    /* @__PURE__ */ jsx("button", { type: "button", className: btn, onClick: () => onChange(value + 1), disabled: value >= MAX_QTY, "aria-label": "Sumar una unidad", children: "+" })
  ] });
}
function CartLines({ onNavigate }) {
  const { lines, setQuantity, remove } = useCart();
  return /* @__PURE__ */ jsx("ul", { className: "divide-y divide-line", children: lines.map((line) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4 py-5", children: [
    /* @__PURE__ */ jsx("img", { src: line.image, alt: "", width: 88, height: 88, className: "size-22 shrink-0 rounded-xl bg-shelf object-contain p-2 mix-blend-multiply" }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Link, { to: `/producto/${line.slug}`, onClick: onNavigate, className: "font-title leading-snug hover:text-rose", children: line.name }),
          line.flavor && /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted", children: [
            "Sabor: ",
            line.flavor
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[0.95rem] whitespace-nowrap", children: formatPrice(line.unitPrice * line.quantity) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx(QuantityStepper, { size: "sm", label: `Cantidad de ${line.name}`, value: line.quantity, onChange: (q) => setQuantity(line.key, q) }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => remove(line.key), className: "text-sm text-muted underline-offset-4 hover:text-danger hover:underline", children: [
          "Quitar",
          /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
            " ",
            line.name
          ] })
        ] })
      ] })
    ] })
  ] }, line.key)) });
}
function CartDrawer() {
  const { isOpen, close, lines, count, subtotal } = useCart();
  const ref = useRef(null);
  const { pathname } = useLocation();
  const { lenis } = useSmoothScroll();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) {
      d.showModal();
      lenis?.stop();
      if (!prefersReducedMotion()) {
        gsap.fromTo(d, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "expo.out" });
        gsap.from(d.querySelectorAll("li"), { autoAlpha: 0, x: 30, stagger: 0.05, delay: 0.2, duration: 0.6 });
      }
    } else if (!isOpen && d.open) {
      const done = () => {
        d.close();
        lenis?.start();
      };
      if (prefersReducedMotion()) done();
      else gsap.to(d, { xPercent: 100, duration: 0.45, ease: "expo.in", onComplete: done });
    }
  }, [isOpen]);
  useEffect(() => close(), [pathname]);
  return /* @__PURE__ */ jsxs(
    "dialog",
    {
      ref,
      "aria-labelledby": "cart-title",
      "data-lenis-prevent": true,
      onCancel: (e) => {
        e.preventDefault();
        close();
      },
      onClick: (e) => e.target === ref.current && close(),
      className: "m-0 ml-auto h-dvh max-h-dvh w-full max-w-[28rem] bg-bone p-0 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm open:flex open:flex-col",
      children: [
        /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-6 py-6", children: [
          /* @__PURE__ */ jsxs("h2", { id: "cart-title", className: "font-display text-3xl", children: [
            "Carrito ",
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm text-muted normal-case", children: [
              "(",
              pluralize(count, "producto", "productos"),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: close, className: "grid size-11 place-items-center rounded-full bg-ink/6 transition-colors hover:bg-ink hover:text-bone", "aria-label": "Cerrar carrito", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 14 14", className: "size-3.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M1 1l12 12M13 1L1 13", stroke: "currentColor", strokeWidth: "1.6" }) }) })
        ] }),
        lines.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col justify-center gap-4 px-6 pb-16", children: [
          /* @__PURE__ */ jsx("p", { className: "font-title text-2xl", children: "Tu carrito está vacío." }),
          /* @__PURE__ */ jsx("p", { className: "text-muted", children: "Los planes de entrenamiento no se compran acá: se piden directamente a Noelia." }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "dark", children: "Ver suplementos" }) })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-6", children: /* @__PURE__ */ jsx(CartLines, { onNavigate: close }) }),
          /* @__PURE__ */ jsxs("footer", { className: "space-y-4 border-t border-line px-6 py-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted", children: "Subtotal" }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xl", children: formatPrice(subtotal) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "El envío se coordina al confirmar el pedido." }),
            /* @__PURE__ */ jsx(ButtonLink, { to: "/checkout", variant: "primary", size: "lg", className: "w-full justify-between", children: "Finalizar compra" })
          ] })
        ] })
      ]
    }
  );
}
function Footer() {
  const cols = [
    { title: "Planes", links: [{ to: "/entrenamiento", label: "Todos los planes" }, ...PLANS.map((p) => ({ to: `/entrenamiento/${p.slug}`, label: p.name }))] },
    { title: "Suplementos", links: [{ to: "/tienda", label: "Toda la tienda" }, ...CATEGORIES.slice(0, 4).map((c) => ({ to: `/tienda/categoria/${c.slug}`, label: c.name }))] },
    { title: "Noelia", links: [{ to: "/sobre-noelia", label: "Sobre Noelia" }, { to: "/contacto", label: "Contacto" }, { to: "/carrito", label: "Carrito" }] }
  ];
  return /* @__PURE__ */ jsx("footer", { className: "bg-ink text-bone", children: /* @__PURE__ */ jsxs("div", { className: "container-site pt-24 pb-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-16 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-title", children: "¿Querés empezar a entrenar con Noelia?" }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-md text-fog", children: "Escribile por WhatsApp con tu objetivo y coordinan la evaluación física." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(ButtonExternal, { href: whatsappLink("Hola Noelia, quiero empezar a entrenar con vos."), variant: "primary", magnetic: true, children: "Escribir por WhatsApp" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7", children: [
        cols.map((col) => /* @__PURE__ */ jsxs("nav", { "aria-label": col.title, children: [
          /* @__PURE__ */ jsx("p", { className: "label text-fog", children: col.title }),
          /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3 text-[0.95rem]", children: col.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: l.to, className: "text-bone/80 transition-colors hover:text-bone", children: l.label }) }, l.to)) })
        ] }, col.title)),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "label text-fog", children: "Redes" }),
          /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3 text-[0.95rem]", children: [
            { href: site.contact.instagram, label: "Instagram" },
            { href: site.contact.youtube, label: "YouTube" },
            { href: site.contact.threads, label: "Threads" }
          ].map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: s.href, target: "_blank", rel: "noopener noreferrer", className: "text-bone/80 transition-colors hover:text-bone", children: s.label }) }, s.href)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-24 flex flex-col gap-4 border-t border-bone/15 pt-8 text-sm text-fog md:flex-row md:justify-between", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Noelia Perucci · Personal trainer IFBB · Argentina"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "max-w-xl md:text-right", children: "Los suplementos no reemplazan una alimentación variada ni la consulta con profesionales de la salud." })
    ] })
  ] }) });
}
function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > last;
      setState({ scrolled: y > 40, hidden: goingDown && y > 400 });
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}
function CartButton({ dark: dark2 }) {
  const { count, open, bump } = useCart();
  const badge = useRef(null);
  useEffect(() => {
    if (!bump || !badge.current || prefersReducedMotion()) return;
    gsap.fromTo(badge.current, { scale: 1.8 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.35)", delay: 0.6 });
  }, [bump]);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      "data-cart-target": true,
      onClick: open,
      "aria-label": `Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`,
      className: `relative grid size-12 place-items-center rounded-full transition-colors duration-300 ${dark2 ? "bg-bone/10 text-bone hover:bg-bone hover:text-ink" : "bg-ink/6 text-ink hover:bg-ink hover:text-bone"}`,
      children: [
        /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "size-5", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("path", { d: "M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z", fill: "none", stroke: "currentColor", strokeWidth: "1.6" }),
          /* @__PURE__ */ jsx("path", { d: "M9 10V7a3 3 0 0 1 6 0v3", fill: "none", stroke: "currentColor", strokeWidth: "1.6" })
        ] }),
        /* @__PURE__ */ jsx(
          "span",
          {
            ref: badge,
            "aria-hidden": "true",
            className: `absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 font-mono text-[0.68rem] text-white transition-opacity ${count ? "opacity-100" : "opacity-0"}`,
            children: count
          }
        )
      ]
    }
  );
}
function MobileMenu({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      if (!prefersReducedMotion()) {
        gsap.fromTo(d, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
        gsap.from(d.querySelectorAll("[data-menu-item]"), { yPercent: 110, duration: 0.9, stagger: 0.06, delay: 0.25 });
      }
    }
    if (!open && d.open) d.close();
  }, [open]);
  return /* @__PURE__ */ jsxs(
    "dialog",
    {
      ref,
      "aria-label": "Menú",
      onCancel: (e) => {
        e.preventDefault();
        onClose();
      },
      className: "m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-bone backdrop:bg-transparent open:flex open:flex-col",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "container-site flex h-20 items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "font-display text-xl", children: "Noelia Perucci" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "h-11 rounded-full bg-bone/10 px-5 text-sm font-medium", children: "Cerrar" })
        ] }),
        /* @__PURE__ */ jsxs("nav", { "aria-label": "Menú móvil", className: "container-site flex flex-1 flex-col justify-center gap-1 pb-10", children: [
          [{ to: "/", label: "Inicio" }, ...nav].map((item) => /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
            NavLink,
            {
              "data-menu-item": true,
              to: item.to,
              end: item.to === "/",
              className: "block py-1 text-[clamp(2.6rem,12vw,4rem)] leading-[0.95] font-display aria-[current=page]:text-rose",
              children: item.label
            }
          ) }, item.to)),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col gap-2 text-fog", children: [
            /* @__PURE__ */ jsxs("a", { href: whatsappLink("Hola Noelia, quiero consultar por tus planes."), target: "_blank", rel: "noopener noreferrer", className: "hover:text-bone", children: [
              "WhatsApp ",
              site.contact.whatsappDisplay
            ] }),
            /* @__PURE__ */ jsxs("a", { href: site.contact.instagram, target: "_blank", rel: "noopener noreferrer", className: "hover:text-bone", children: [
              "Instagram ",
              site.contact.instagramHandle
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Header() {
  const { scrolled, hidden } = useScrollState();
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const matches = useMatches();
  const darkHero = matches.some((m) => m.handle?.darkHero);
  const dark2 = darkHero && !scrolled;
  useEffect(() => setMenu(false), [location.pathname]);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-(--ease-out-expo) ${hidden && !menu ? "-translate-y-full" : "translate-y-0"} ${dark2 ? "bg-transparent" : "bg-bone/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: `container-site flex h-20 items-center justify-between gap-6 ${dark2 ? "text-bone" : "text-ink"}`, children: [
          /* @__PURE__ */ jsx(Link, { to: "/", "aria-label": "Noelia Perucci, inicio", className: "font-display text-[1.35rem] leading-none tracking-tight", children: "Noelia Perucci" }),
          /* @__PURE__ */ jsx("nav", { "aria-label": "Principal", className: "hidden lg:block", children: /* @__PURE__ */ jsx("ul", { className: "flex items-center gap-9", children: nav.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(NavLink, { to: item.to, className: "group relative py-2 text-[0.95rem]", children: ({ isActive }) => /* @__PURE__ */ jsxs(Fragment, { children: [
            item.label,
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": "true",
                className: `absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-(--ease-out-expo) ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`
              }
            )
          ] }) }) }, item.to)) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "hidden md:block", children: /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento", variant: dark2 ? "light" : "dark", arrow: false, className: "h-12", children: "Quiero entrenar" }) }),
            /* @__PURE__ */ jsx(CartButton, { dark: dark2 }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setMenu(true),
                "aria-expanded": menu,
                className: `grid size-12 place-items-center rounded-full lg:hidden ${dark2 ? "bg-bone/10" : "bg-ink/6"}`,
                "aria-label": "Abrir menú",
                children: /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", className: "flex w-5 flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "h-px w-full bg-current" }),
                  /* @__PURE__ */ jsx("span", { className: "h-px w-full bg-current" })
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(MobileMenu, { open: menu, onClose: () => setMenu(false) })
      ]
    }
  );
}
function RouteEffects({ main }) {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useSmoothScroll();
  const first = useRef(true);
  useEffect(() => {
    if (hash) {
      const id = window.setTimeout(() => scrollTo(hash, { offset: -90 }), 60);
      return () => window.clearTimeout(id);
    }
    scrollTo(0, { immediate: true });
    if (!first.current && main.current && !prefersReducedMotion()) {
      gsap.fromTo(main.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" });
    }
    first.current = false;
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);
  return null;
}
function Layout() {
  const main = useRef(null);
  return /* @__PURE__ */ jsxs(SmoothScroll, { children: [
    /* @__PURE__ */ jsx("a", { href: "#contenido", className: "sr-only z-[60] rounded-full bg-rose px-5 py-3 font-medium text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4", children: "Saltar al contenido" }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { id: "contenido", ref: main, tabIndex: -1, className: "focus:outline-none", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(CartDrawer, {}),
    /* @__PURE__ */ jsx(RouteEffects, { main })
  ] });
}
const stock = (name) => ({
  src: `/media/stock/${name}-1600.webp`,
  srcSet: `/media/stock/${name}-800.webp 800w, /media/stock/${name}-1600.webp 1600w`
});
const noelia = {
  stage: { src: "/media/noelia-tarima-npc-cordoba.webp", w: 320, h: 640, alt: "Noelia Perucci en la tarima de NPC Córdoba, con bikini de competencia azul y el dorsal 181." },
  stageSquare: { src: "/media/noelia-tarima-npc-cordoba-cuadrada.webp", alt: "Noelia Perucci compitiendo en la categoría wellness de NPC Córdoba." },
  training: { src: "/media/noelia-entrenando-espalda.webp", w: 360, h: 300, alt: "Noelia Perucci entrenando espalda en una polea del gimnasio." },
  certificate: {
    src: "/media/certificado-olympia.webp",
    w: 590,
    h: 395,
    alt: "Certificado Bodybuilding & Fitness Trainer de la Academia Olympia Internacional a nombre de Noelia Soledad Perucci, emitido en julio de 2021."
  }
};
const releaseIntro = () => document.documentElement.classList.add("motion-ready");
function PageHeader({
  title,
  lead,
  crumbs,
  image,
  children
}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    let split;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref.current);
      split = SplitText.create(q("h1")[0], { type: "lines", mask: "lines" });
      gsap.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.08, delay: 0.1 });
      gsap.from(q("[data-ph-in]"), { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08, delay: 0.45 });
      gsap.fromTo(q("[data-ph-bg]"), { scale: 1.15 }, { scale: 1, duration: 2, ease: "expo.out" });
    }, ref);
    releaseIntro();
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [title]);
  return /* @__PURE__ */ jsxs("section", { ref, className: "relative isolate overflow-hidden bg-ink text-bone", children: [
    image && /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsx("img", { "data-ph-bg": true, ...stock(image), sizes: "100vw", alt: "", fetchPriority: "high", className: "h-full w-full object-cover opacity-35" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container-site pt-36 pb-16 md:pt-44 md:pb-20", children: [
      crumbs && /* @__PURE__ */ jsx("nav", { "data-ph-in": true, "aria-label": "Ruta de navegación", className: "mb-8", children: /* @__PURE__ */ jsx("ol", { className: "flex flex-wrap items-center gap-2 label text-fog", children: crumbs.map((c, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
        i > 0 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        c.to ? /* @__PURE__ */ jsx(Link, { to: c.to, className: "hover:text-bone", children: c.name }) : /* @__PURE__ */ jsx("span", { "aria-current": "page", className: "text-bone", children: c.name })
      ] }, c.name)) }) }),
      /* @__PURE__ */ jsx("h1", { "data-intro": true, className: "max-w-5xl font-display text-display", children: title }, title),
      lead && /* @__PURE__ */ jsx("div", { "data-ph-in": true, className: "mt-8 max-w-2xl text-lead text-bone/75", children: lead }),
      children && /* @__PURE__ */ jsx("div", { "data-ph-in": true, className: "mt-10", children })
    ] })
  ] });
}
function Seo({ title, description, path, image = site.ogImage, noindex, jsonLd }) {
  const location = useLocation();
  const canonical = absoluteUrl(path ?? location.pathname);
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("title", { children: fullTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonical }),
    noindex && /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, follow" }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: site.locale }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: site.name }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: fullTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: absoluteUrl(image) }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    jsonLd && /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) } })
  ] });
}
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#noelia`,
  name: "Noelia Perucci",
  jobTitle: "Personal trainer",
  description: "Personal trainer certificada IFBB y Olympia. Atleta wellness NPC.",
  url: site.url,
  image: absoluteUrl("/media/noelia-tarima-npc-cordoba-cuadrada.webp"),
  sameAs: [site.contact.instagram, site.contact.youtube, site.contact.threads],
  hasCredential: site.credentials.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.title,
    recognizedBy: { "@type": "Organization", name: c.issuer }
  })),
  address: { "@type": "PostalAddress", addressCountry: "AR" }
};
const breadcrumbJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) }))
});
const faqJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.filter((f) => f.confirmed).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
});
function usePageMotion(scope, deps = []) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const splits = [];
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      q("[data-split]").forEach((el) => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line-inner",
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true }
          })
        });
        splits.push(split);
      });
      const fades = q("[data-fade]");
      if (fades.length) {
        gsap.set(fades, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(fades, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, overwrite: true })
        });
      }
      q("[data-img-reveal]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" });
        if (img) tl.from(img, { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0.1);
      });
      q("[data-parallax]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -7 },
          { yPercent: 7, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } }
        );
      });
      q("[data-scrub-words]").forEach((el) => {
        const split = SplitText.create(el, { type: "words" });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } }
        );
      });
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, deps);
}
function AboutPage() {
  const ref = useRef(null);
  usePageMotion(ref);
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Sobre Noelia Perucci: personal trainer IFBB y atleta wellness NPC",
        description: "Noelia Perucci es personal trainer con diplomas internacionales IFBB y Olympia, y atleta de la categoría wellness en NPC.",
        path: "/sobre-noelia",
        jsonLd: [personJsonLd, breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Sobre Noelia", path: "/sobre-noelia" }])]
      }
    ),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Noelia Perucci, personal trainer IFBB y atleta wellness",
        crumbs: [{ name: "Inicio", to: "/" }, { name: "Sobre Noelia" }],
        image: "columna-pesas",
        lead: "Personal trainer con dos diplomas internacionales, IFBB y Olympia, y competidora de la categoría wellness en NPC."
      }
    ),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "training-title", className: "container-site section-y", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-14 lg:grid-cols-12 lg:items-center", children: [
      /* @__PURE__ */ jsx("div", { "data-img-reveal": true, className: "aspect-[4/5] overflow-hidden rounded-3xl lg:col-span-5", children: /* @__PURE__ */ jsx("img", { src: noelia.stageSquare.src, alt: noelia.stageSquare.alt, width: 640, height: 640, className: "h-full w-full object-cover object-[50%_30%]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6 lg:col-start-7", children: [
        /* @__PURE__ */ jsx("h2", { id: "training-title", "data-split": true, className: "font-display text-title", children: "Formación y competencia" }),
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-6 text-lead text-muted", children: "«No soy una más. Me instruí. Estudié. Rendí… pagué por eso.» Así lo contó cuando publicó sus diplomas: se formó en dos instituciones internacionales y sigue estudiando." }),
        /* @__PURE__ */ jsx("ul", { "data-fade": true, className: "mt-10 divide-y divide-line border-y border-line", children: site.credentials.map((c) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col justify-between gap-1 py-5 sm:flex-row", children: [
          /* @__PURE__ */ jsx("span", { className: "font-title text-xl", children: c.title }),
          /* @__PURE__ */ jsxs("span", { className: "label text-muted", children: [
            c.issuer,
            c.year && ` · ${c.year}`
          ] })
        ] }, c.title)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "cert-title", className: "bg-ink text-bone section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-14 lg:grid-cols-12 lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
        /* @__PURE__ */ jsx("h2", { id: "cert-title", "data-split": true, className: "font-display text-title", children: "Certificación Olympia" }),
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-6 text-fog", children: "Bodybuilding & Fitness Trainer de la Academia Olympia Internacional, a nombre de Noelia Soledad Perucci. Capacitación online, emitida en julio de 2021." })
      ] }),
      /* @__PURE__ */ jsx("figure", { "data-img-reveal": true, className: "overflow-hidden rounded-3xl bg-bone p-3 lg:col-span-6 lg:col-start-7", children: /* @__PURE__ */ jsx("img", { src: noelia.certificate.src, alt: noelia.certificate.alt, width: noelia.certificate.w, height: noelia.certificate.h, loading: "lazy", className: "w-full rounded-2xl" }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "method-title", className: "container-site section-y", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-14 lg:grid-cols-12 lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-6", children: [
        /* @__PURE__ */ jsx("h2", { id: "method-title", "data-split": true, className: "font-display text-title", children: "Cómo trabaja con sus alumnas" }),
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-6 text-lead text-muted", children: "Evaluación física, plan de entrenamiento, plan nutricional personalizado y controles semanales. En sus palabras: «Yo te ofrezco mi conocimiento y vos ponés tus ganas»." }),
        /* @__PURE__ */ jsxs("div", { "data-fade": true, className: "mt-10 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento", variant: "primary", magnetic: true, children: "Ver planes de entrenamiento" }),
          /* @__PURE__ */ jsxs(ButtonExternal, { href: site.contact.instagram, variant: "outline", children: [
            "Instagram ",
            site.contact.instagramHandle
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-img-reveal": true, className: "aspect-[6/5] overflow-hidden rounded-3xl lg:col-span-5 lg:col-start-8", children: /* @__PURE__ */ jsx("img", { src: noelia.training.src, alt: noelia.training.alt, width: noelia.training.w, height: noelia.training.h, loading: "lazy", className: "h-full w-full object-cover" }) })
    ] }) })
  ] });
}
function CartPage() {
  const { lines, count, subtotal } = useCart();
  return /* @__PURE__ */ jsxs("div", { className: "container-site pt-32 pb-24 md:pt-40", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Carrito", description: "Tu carrito de compras.", noindex: true }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-display", children: "Carrito" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 label text-muted", children: pluralize(count, "producto", "productos") }),
    lines.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-12 max-w-xl rounded-3xl bg-white p-10", children: [
      /* @__PURE__ */ jsx("p", { className: "font-title text-2xl", children: "Tu carrito está vacío." }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted", children: "Los planes de entrenamiento no se compran acá: se piden directamente a Noelia." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "dark", children: "Ver suplementos" }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento", variant: "outline", children: "Ver planes" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-12 grid gap-12 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsx("div", { className: "border-t border-line lg:col-span-7", children: /* @__PURE__ */ jsx(CartLines, {}) }),
      /* @__PURE__ */ jsx("aside", { "aria-label": "Resumen", className: "lg:col-span-4 lg:col-start-9", children: /* @__PURE__ */ jsxs("div", { className: "space-y-5 rounded-3xl bg-white p-7 lg:sticky lg:top-28", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-2xl", children: formatPrice(subtotal) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "El envío se coordina al confirmar el pedido." }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/checkout", variant: "primary", size: "lg", className: "w-full justify-between", children: "Finalizar compra" }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "text", arrow: false, children: "Seguir comprando" })
      ] }) })
    ] })
  ] });
}
const control = "block w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink placeholder:text-fog transition-[border-color,box-shadow] duration-200 hover:border-fog focus:border-ink focus:ring-4 focus:ring-ink/8 focus:outline-none aria-invalid:border-danger";
function Shell({ id, label, hint, error, optional, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxs("label", { htmlFor: id, className: "flex items-baseline justify-between gap-3 text-sm font-medium", children: [
      label,
      optional && /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-muted", children: "Opcional" })
    ] }),
    children,
    hint && !error && /* @__PURE__ */ jsx("p", { id: `${id}-hint`, className: "text-sm text-muted", children: hint }),
    error && /* @__PURE__ */ jsx("p", { id: `${id}-error`, className: "text-sm text-danger", children: error })
  ] });
}
function TextField({ label, hint, error, optional, ...rest }) {
  const id = useId();
  return /* @__PURE__ */ jsx(Shell, { id, label, hint, error, optional, children: /* @__PURE__ */ jsx(
    "input",
    {
      id,
      className: control,
      "aria-invalid": !!error || void 0,
      "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : void 0,
      required: !optional,
      ...rest
    }
  ) });
}
function TextArea({ label, hint, error, optional, ...rest }) {
  const id = useId();
  return /* @__PURE__ */ jsx(Shell, { id, label, hint, error, optional, children: /* @__PURE__ */ jsx("textarea", { id, rows: 4, className: `${control} resize-y`, "aria-invalid": !!error || void 0, required: !optional, ...rest }) });
}
const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230b0b0c' stroke-width='1.6'/%3E%3C/svg%3E")`;
function SelectField({ label, hint, error, optional, children, ...rest }) {
  const id = useId();
  return /* @__PURE__ */ jsx(Shell, { id, label, hint, error, optional, children: /* @__PURE__ */ jsx("select", { id, className: `${control} appearance-none bg-[length:12px] bg-[right_1.1rem_center] bg-no-repeat pr-10`, style: { backgroundImage: chevron }, ...rest, children }) });
}
function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("fieldset", { children: [
    /* @__PURE__ */ jsx("legend", { className: "mb-3 text-sm font-medium", children: legend }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: options.map((o) => /* @__PURE__ */ jsxs("label", { className: "relative cursor-pointer", children: [
      /* @__PURE__ */ jsx("input", { type: "radio", name, value: o.value, checked: value === o.value, disabled: o.disabled, onChange: () => onChange(o.value), className: "peer sr-only" }),
      /* @__PURE__ */ jsx("span", { className: "inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-[0.95rem] transition-all duration-200 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose peer-disabled:opacity-40 hover:border-ink", children: o.label })
    ] }, o.value)) })
  ] });
}
function Checkbox({ label, ...rest }) {
  const id = useId();
  return /* @__PURE__ */ jsxs("label", { htmlFor: id, className: "flex cursor-pointer items-start gap-3 text-sm text-muted", children: [
    /* @__PURE__ */ jsx("input", { id, type: "checkbox", className: "mt-0.5 size-5 shrink-0 rounded accent-ink", ...rest }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function FormErrors({ messages }) {
  if (!messages.length) return null;
  return /* @__PURE__ */ jsx("div", { role: "alert", className: "rounded-xl bg-danger/8 px-5 py-4 text-sm text-danger", children: messages.length === 1 ? /* @__PURE__ */ jsx("p", { children: messages[0] }) : /* @__PURE__ */ jsx("ul", { className: "list-disc space-y-1 pl-4", children: messages.map((m) => /* @__PURE__ */ jsx("li", { children: m }, m)) }) });
}
const BASE = "/api";
class ApiError extends Error {
  constructor(status, messages) {
    super(messages.join(" "));
    this.status = status;
    this.messages = messages;
  }
  status;
  messages;
}
const OFFLINE_MESSAGE = "No pudimos enviar tus datos porque el servidor no responde. Podés escribirle a Noelia por WhatsApp.";
async function post(path, data) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch {
    throw new ApiError(0, [OFFLINE_MESSAGE]);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status >= 500 || !body?.messages) throw new ApiError(res.status, [OFFLINE_MESSAGE]);
    throw new ApiError(res.status, body.messages);
  }
  return body;
}
function Step({ n, title, children }) {
  return /* @__PURE__ */ jsxs("fieldset", { className: "rounded-3xl bg-white p-7 md:p-9", children: [
    /* @__PURE__ */ jsx("legend", { className: "sr-only", children: title }),
    /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "mb-7 flex items-baseline gap-4", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono text-sm text-rose", children: n }),
      /* @__PURE__ */ jsx("span", { className: "font-title text-2xl", children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6", children })
  ] });
}
function Confirmation({ result }) {
  const { order, payment } = result;
  return /* @__PURE__ */ jsxs("div", { className: "container-site pt-32 pb-24 md:pt-40", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Pedido registrado", description: "Confirmación de pedido.", noindex: true }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl", children: [
      /* @__PURE__ */ jsx("p", { role: "status", className: "label text-success", children: "Pedido registrado" }),
      /* @__PURE__ */ jsxs("h1", { className: "mt-4 font-display text-display", children: [
        "Pedido ",
        order.number
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-3xl bg-white p-7", children: [
        /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Estado: pendiente de pago" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted", children: payment.message }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted", children: "Noelia te va a contactar para coordinar el pago y la entrega." })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "mt-8 divide-y divide-line border-y border-line", children: order.lines.map((l) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between gap-4 py-4", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          l.quantity,
          " × ",
          l.name,
          l.flavor && /* @__PURE__ */ jsxs("span", { className: "text-muted", children: [
            " · ",
            l.flavor
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: formatPrice(l.lineTotal) })
      ] }, `${l.productSlug}-${l.flavor}`)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted", children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-xl", children: formatPrice(order.subtotal) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(ButtonExternal, { href: whatsappLink(`Hola Noelia, hice el pedido ${order.number} en tu tienda.`), variant: "primary", children: "Avisarle por WhatsApp" }),
        /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "outline", children: "Seguir comprando" })
      ] })
    ] })
  ] });
}
function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { scrollTo } = useSmoothScroll();
  const [method, setMethod] = useState("envio");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);
  if (result) return /* @__PURE__ */ jsx(Confirmation, { result });
  if (lines.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "container-site pt-32 pb-24 md:pt-40", children: [
      /* @__PURE__ */ jsx(Seo, { title: "Finalizar compra", description: "Finalizar compra.", noindex: true }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-display", children: "Finalizar compra" }),
      /* @__PURE__ */ jsx("p", { className: "mt-6 text-muted", children: "No hay productos en el carrito." }),
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "dark", children: "Ver suplementos" }) })
    ] });
  }
  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k) => String(f.get(k) ?? "").trim();
    setSending(true);
    setErrors([]);
    try {
      const res = await post("/orders", {
        items: lines.map((l) => ({ productSlug: l.slug, quantity: l.quantity, flavor: l.flavor ?? void 0 })),
        customer: { name: get("name"), email: get("email"), phone: get("phone") },
        delivery: method === "envio" ? { method, address: get("address"), city: get("city"), postalCode: get("postalCode") } : { method },
        notes: get("notes") || void 0,
        acceptTerms: f.get("acceptTerms") === "on"
      });
      setResult(res);
      clear();
      scrollTo(0, { immediate: true });
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ["No pudimos registrar el pedido."]);
    } finally {
      setSending(false);
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "container-site pt-32 pb-24 md:pt-40", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Finalizar compra", description: "Finalizar compra.", noindex: true }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-display", children: "Finalizar compra" }),
    /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-muted", children: "Completá tus datos. El pedido queda registrado y Noelia te contacta para coordinar el pago y la entrega." }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-12 grid gap-8 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-5 lg:col-span-7", children: [
        /* @__PURE__ */ jsxs(Step, { n: "01", title: "Tus datos", children: [
          /* @__PURE__ */ jsx(TextField, { label: "Nombre y apellido", name: "name", autoComplete: "name", minLength: 2, maxLength: 80 }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(TextField, { label: "Email", name: "email", type: "email", autoComplete: "email" }),
            /* @__PURE__ */ jsx(TextField, { label: "Celular", name: "phone", type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "341 555 1234" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Step, { n: "02", title: "Entrega", children: [
          /* @__PURE__ */ jsx(
            ChoiceGroup,
            {
              legend: "¿Cómo lo recibís?",
              name: "method",
              value: method,
              onChange: setMethod,
              options: [
                { value: "envio", label: "Envío a domicilio" },
                { value: "retiro", label: "Retiro" }
              ]
            }
          ),
          method === "envio" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(TextField, { label: "Dirección", name: "address", autoComplete: "street-address", placeholder: "Calle, número, piso y depto." }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-[2fr_1fr]", children: [
              /* @__PURE__ */ jsx(TextField, { label: "Localidad", name: "city", autoComplete: "address-level2" }),
              /* @__PURE__ */ jsx(TextField, { label: "Código postal", name: "postalCode", autoComplete: "postal-code", maxLength: 8 })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "El costo de envío se cotiza según tu zona y te lo confirman antes de pagar." })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "El punto y el horario de retiro te los confirma Noelia." }),
          /* @__PURE__ */ jsx(TextArea, { label: "Notas", name: "notes", optional: true, maxLength: 500, rows: 3 })
        ] }),
        /* @__PURE__ */ jsxs(Step, { n: "03", title: "Pago", children: [
          /* @__PURE__ */ jsxs("p", { className: "rounded-2xl bg-sand px-5 py-4 text-[0.95rem]", children: [
            /* @__PURE__ */ jsx("strong", { className: "font-medium", children: "No se cobra nada en este paso." }),
            " El pago online todavía no está habilitado: Noelia te contacta para coordinar cómo pagar."
          ] }),
          /* @__PURE__ */ jsx(Checkbox, { name: "acceptTerms", required: true, label: "Entiendo que el pedido queda pendiente hasta coordinar el pago y acepto que usen mis datos para gestionarlo." })
        ] }),
        /* @__PURE__ */ jsx(FormErrors, { messages: errors })
      ] }),
      /* @__PURE__ */ jsx("aside", { "aria-label": "Resumen del pedido", className: "lg:col-span-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-5 rounded-3xl bg-ink p-7 text-bone lg:sticky lg:top-28", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-title text-2xl", children: "Tu pedido" }),
        /* @__PURE__ */ jsx("ul", { className: "divide-y divide-bone/12 text-[0.95rem]", children: lines.map((l) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4 py-3", children: [
          /* @__PURE__ */ jsx("img", { src: l.image, alt: "", className: "size-14 rounded-lg bg-shelf object-contain p-1" }),
          /* @__PURE__ */ jsxs("span", { className: "flex-1", children: [
            l.quantity,
            " × ",
            l.name,
            l.flavor && /* @__PURE__ */ jsx("span", { className: "block text-fog", children: l.flavor })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-mono whitespace-nowrap", children: formatPrice(l.unitPrice * l.quantity) })
        ] }, l.key)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 border-t border-bone/15 pt-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-fog", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono text-xl", children: formatPrice(subtotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-fog", children: [
            /* @__PURE__ */ jsx("span", { children: "Envío" }),
            /* @__PURE__ */ jsx("span", { children: method === "retiro" ? "Sin cargo" : "A cotizar" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", size: "lg", arrow: true, className: "w-full justify-between", disabled: sending, children: sending ? "Registrando…" : "Confirmar pedido" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-fog", children: "El servidor recalcula los precios con el catálogo vigente." })
      ] }) })
    ] })
  ] });
}
function InquiryForm({ fixedPlan, tone = "light" }) {
  const [pref, setPref] = useState("whatsapp");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);
  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k) => String(f.get(k) ?? "").trim();
    setSending(true);
    setErrors([]);
    try {
      setResult(
        await post("/inquiries", {
          name: get("name"),
          contactPreference: pref,
          phone: pref === "whatsapp" ? get("phone") : void 0,
          email: pref === "email" ? get("email") : void 0,
          planSlug: fixedPlan?.slug ?? (get("planSlug") || void 0),
          goal: get("goal") || void 0,
          message: get("message") || void 0,
          consent: f.get("consent") === "on"
        })
      );
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ["No pudimos enviar la consulta."]);
    } finally {
      setSending(false);
    }
  }
  const fallbackWa = whatsappLink(`Hola Noelia, quiero consultar${fixedPlan ? ` por: ${fixedPlan.name}` : " por tus planes"}.`);
  if (result) {
    return /* @__PURE__ */ jsxs("div", { role: "status", className: `rounded-3xl p-8 md:p-10 ${tone === "dark" ? "bg-bone text-ink" : "bg-white"}`, children: [
      /* @__PURE__ */ jsx("p", { className: "label text-success", children: "Consulta enviada" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 font-display text-4xl", children: "Listo, ya la recibió." }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-prose text-muted", children: [
        "Tu consulta",
        result.planName ? ` por ${result.planName}` : "",
        " quedó registrada. Si querés una respuesta más rápida, mandala también por WhatsApp: el mensaje ya está escrito."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(ButtonExternal, { href: result.whatsappUrl ?? fallbackWa, variant: "primary", children: "Enviar por WhatsApp" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setResult(null), children: "Hacer otra consulta" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit, className: `space-y-6 rounded-3xl p-7 md:p-10 ${tone === "dark" ? "bg-bone text-ink" : "bg-white"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(TextField, { label: "Nombre", name: "name", autoComplete: "name", minLength: 2, maxLength: 80 }),
      pref === "whatsapp" ? /* @__PURE__ */ jsx(TextField, { label: "Celular", name: "phone", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "341 555 1234" }) : /* @__PURE__ */ jsx(TextField, { label: "Email", name: "email", type: "email", autoComplete: "email" })
    ] }),
    /* @__PURE__ */ jsx(
      ChoiceGroup,
      {
        legend: "¿Por dónde preferís que te responda?",
        name: "contactPreference",
        value: pref,
        onChange: setPref,
        options: [
          { value: "whatsapp", label: "WhatsApp" },
          { value: "email", label: "Email" }
        ]
      }
    ),
    !fixedPlan && /* @__PURE__ */ jsxs(SelectField, { label: "Plan que te interesa", name: "planSlug", optional: true, defaultValue: "", children: [
      /* @__PURE__ */ jsx("option", { value: "", children: "Todavía no sé" }),
      PLANS.map((p) => /* @__PURE__ */ jsx("option", { value: p.slug, children: p.name }, p.slug))
    ] }),
    /* @__PURE__ */ jsx(TextField, { label: "Tu objetivo", name: "goal", optional: true, maxLength: 120, placeholder: "Ej.: ganar fuerza, bajar de peso, competir" }),
    /* @__PURE__ */ jsx(TextArea, { label: "Mensaje", name: "message", optional: true, maxLength: 1e3, rows: 3 }),
    /* @__PURE__ */ jsx(Checkbox, { name: "consent", required: true, label: "Acepto que Noelia use estos datos solo para responder mi consulta." }),
    /* @__PURE__ */ jsx(FormErrors, { messages: errors }),
    errors.length > 0 && /* @__PURE__ */ jsx("a", { href: fallbackWa, target: "_blank", rel: "noopener noreferrer", className: "inline-block text-sm font-medium underline underline-offset-4", children: "Escribir por WhatsApp" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 pt-2", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", variant: "primary", size: "lg", arrow: true, disabled: sending, children: sending ? "Enviando…" : fixedPlan ? `Pedir ${fixedPlan.name.toLowerCase()}` : "Enviar consulta" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "Sin costo ni compromiso." })
    ] })
  ] });
}
function ContactPage() {
  const ref = useRef(null);
  usePageMotion(ref);
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Contacto: consultá por planes de entrenamiento",
        description: "Escribile a Noelia Perucci por WhatsApp o dejale una consulta sobre planes de entrenamiento o la tienda de suplementos.",
        path: "/contacto"
      }
    ),
    /* @__PURE__ */ jsx(PageHeader, { title: "Contacto", crumbs: [{ name: "Inicio", to: "/" }, { name: "Contacto" }], image: "disco-45", lead: "La forma más rápida es WhatsApp. Si preferís, dejale una consulta y te responde por el medio que elijas." }),
    /* @__PURE__ */ jsx("section", { className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-12 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 lg:col-span-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-fade": true, className: "rounded-3xl bg-ink p-8 text-bone", children: [
          /* @__PURE__ */ jsx("p", { className: "label text-fog", children: "WhatsApp" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 font-mono text-xl", children: site.contact.whatsappDisplay }),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(ButtonExternal, { href: whatsappLink("Hola Noelia, te escribo desde tu web."), variant: "primary", magnetic: true, children: "Abrir WhatsApp" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-fade": true, className: "rounded-3xl bg-white p-8", children: [
          /* @__PURE__ */ jsx("p", { className: "label text-muted", children: "Instagram" }),
          /* @__PURE__ */ jsx("a", { href: site.contact.instagram, target: "_blank", rel: "noopener noreferrer", className: "mt-3 block font-title text-2xl hover:text-rose", children: site.contact.instagramHandle })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-fade": true, className: "lg:col-span-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "sr-only", children: "Formulario de consulta" }),
        /* @__PURE__ */ jsx(InquiryForm, {})
      ] })
    ] }) })
  ] });
}
const steps$1 = [
  {
    title: "Evaluación física",
    text: "Es el primer paso: Noelia conoce tu punto de partida, tu historial y tu objetivo. Nada se arma antes de esto.",
    image: "columna-pesas",
    alt: "Columna de pesas numeradas de una máquina de gimnasio."
  },
  {
    title: "Plan de entrenamiento",
    text: "Con la evaluación arma tu plan: ejercicios, series y progresión según tu nivel y el tiempo que tenés para entrenar.",
    image: "barra-disco-oscuro",
    alt: "Barra con disco apoyada en el piso de un gimnasio."
  },
  {
    title: "Plan nutricional",
    text: "La alimentación acompaña al entrenamiento. Por eso la asesoría incluye un plan nutricional personalizado.",
    image: "kettlebell-gris",
    alt: "Kettlebell negra sobre el piso de goma de un gimnasio."
  },
  {
    title: "Controles semanales",
    text: "Cada semana revisan tu avance y ajustan el plan. Así el plan acompaña tu progreso en lugar de quedar fijo.",
    image: "rack-mancuernas",
    alt: "Rack de mancuernas en un gimnasio."
  }
];
function ProcessScroller() {
  const section = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  useLayoutEffect(() => {
    if (!section.current || !track.current || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const distance = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });
      gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
      track.current.querySelectorAll("img").forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      return () => ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, []);
  return /* @__PURE__ */ jsx("section", { ref: section, "aria-labelledby": "process-title", className: "relative overflow-hidden bg-ink text-bone", children: /* @__PURE__ */ jsxs("div", { className: "lg:flex lg:h-svh lg:flex-col lg:justify-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "container-site flex flex-col gap-6 pt-24 pb-12 lg:flex-row lg:items-end lg:justify-between lg:pt-28 lg:pb-14", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "label text-fog", children: "Proceso" }),
        /* @__PURE__ */ jsx("h2", { id: "process-title", className: "mt-4 font-display text-display", children: "Cómo funciona la asesoría integral" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "max-w-md text-fog", children: "Cuatro partes que se trabajan juntas, en este orden. Es el servicio tal como lo ofrece Noelia." })
    ] }),
    /* @__PURE__ */ jsxs("div", { ref: track, className: "flex flex-col gap-5 px-5 pb-24 md:px-10 lg:w-max lg:flex-row lg:gap-6 lg:pr-[8vw] lg:pb-0 lg:pl-14", children: [
      steps$1.map((s, i) => /* @__PURE__ */ jsxs("article", { className: "grid overflow-hidden rounded-3xl bg-carbon lg:h-[58vh] lg:w-[58vw] lg:grid-cols-2 xl:w-[52vw]", children: [
        /* @__PURE__ */ jsx("div", { className: "relative aspect-[4/3] overflow-hidden lg:aspect-auto", children: /* @__PURE__ */ jsx("img", { ...stock(s.image), sizes: "(min-width: 1024px) 30vw, 100vw", alt: s.alt, loading: "lazy", className: "absolute inset-0 h-full w-[116%] max-w-none -translate-x-[8%] object-cover lg:w-[116%]" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-10 p-8 md:p-10", children: [
          /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm text-fog", children: [
            "0",
            i + 1,
            " / 0",
            steps$1.length
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-[clamp(2rem,1.4rem+2vw,3.4rem)] leading-[0.92]", children: s.title }),
            /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-sm text-fog", children: s.text })
          ] })
        ] })
      ] }, s.title)),
      /* @__PURE__ */ jsx("div", { className: "flex items-center rounded-3xl bg-rose p-10 lg:h-[58vh] lg:w-[30vw]", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-[clamp(2rem,1.4rem+2vw,3.2rem)] leading-[0.92]", children: "Empezá por la evaluación" }),
        /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento/asesoria-integral", variant: "dark", magnetic: true, children: "Ver la asesoría" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "container-site hidden pt-10 lg:block", children: /* @__PURE__ */ jsx("div", { className: "h-px bg-bone/15", children: /* @__PURE__ */ jsx("div", { ref: bar, className: "h-px origin-left bg-rose" }) }) })
  ] }) });
}
function PlanPrice({ plan, tone = "light" }) {
  if (plan.price) {
    return /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono text-2xl", children: formatPrice(plan.price.amount) }),
      /* @__PURE__ */ jsxs("span", { className: tone === "dark" ? "text-fog" : "text-muted", children: [
        " / ",
        plan.price.period
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("p", { className: tone === "dark" ? "text-fog" : "text-muted", children: "Precio a consultar" });
}
const planCta = (plan) => plan.status === "confirmado" ? "Quiero este plan" : "Consultar disponibilidad";
function PlanCard({ plan }) {
  const dark2 = plan.featured;
  return /* @__PURE__ */ jsxs("article", { className: `group relative flex flex-col overflow-hidden rounded-3xl ${dark2 ? "bg-ink text-bone" : "bg-white text-ink"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-[16/11] overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: plan.image.src,
          alt: plan.image.alt,
          loading: "lazy",
          className: "h-full w-full object-cover transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-105"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "absolute top-5 left-5 rounded-full bg-ink/70 px-3 py-1.5 label text-bone backdrop-blur", children: [
        "Plan ",
        plan.number
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col p-7 md:p-8", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-display text-[2.1rem] leading-[0.95]", children: /* @__PURE__ */ jsx(Link, { to: `/entrenamiento/${plan.slug}`, className: "after:absolute after:inset-0", children: plan.name }) }),
      /* @__PURE__ */ jsx("p", { className: `mt-3 ${dark2 ? "text-fog" : "text-muted"}`, children: plan.tagline }),
      /* @__PURE__ */ jsx("ul", { className: `mt-6 space-y-2.5 border-t pt-6 text-[0.95rem] ${dark2 ? "border-bone/15" : "border-line"}`, children: plan.includes.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: "mt-1 size-4 shrink-0 text-rose", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8.5l3 3 7-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }) }),
        f.label
      ] }, f.label)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto flex flex-wrap items-center justify-between gap-4 pt-8", children: [
        /* @__PURE__ */ jsx(PlanPrice, { plan, tone: dark2 ? "dark" : "light" }),
        /* @__PURE__ */ jsx("span", { className: "relative z-10", children: /* @__PURE__ */ jsx(ButtonLink, { to: `/entrenamiento/${plan.slug}`, variant: dark2 ? "primary" : "outline", children: plan.status === "confirmado" ? "Ver el plan" : "Ver detalles" }) })
      ] })
    ] })
  ] });
}
function ProductCard({ product, priority = false }) {
  const { add } = useCart();
  const img = useRef(null);
  const [added, setAdded] = useState(false);
  const category = findCategory(product.categorySlug);
  const needsFlavor = product.flavors.length > 0;
  const quickAdd = () => {
    add(product, 1, null);
    flyToCart(img.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  return /* @__PURE__ */ jsxs("article", { className: "group relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative aspect-[4/5] overflow-hidden rounded-2xl bg-shelf", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          ref: img,
          src: product.image.src,
          alt: product.image.alt,
          width: 720,
          height: 720,
          loading: priority ? "eager" : "lazy",
          className: "absolute inset-0 h-full w-full object-contain p-[12%] mix-blend-multiply transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.06]"
        }
      ),
      !product.inStock && /* @__PURE__ */ jsx("span", { className: "absolute top-4 left-4 rounded-full bg-ink px-3 py-1 label text-bone", children: "Sin stock" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-x-4 bottom-4 flex justify-end transition-all duration-500 ease-(--ease-out-expo) [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100", children: product.inStock && (needsFlavor ? /* @__PURE__ */ jsx(Link, { to: `/producto/${product.slug}`, className: "relative z-10 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm text-bone hover:bg-rose", children: "Elegir sabor" }) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: quickAdd,
          className: "relative z-10 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm text-bone transition-colors hover:bg-rose",
          "aria-label": `Agregar ${product.name} al carrito`,
          children: added ? "Agregado ✓" : "Agregar +"
        }
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-title text-[1.05rem] leading-snug", children: /* @__PURE__ */ jsx(Link, { to: `/producto/${product.slug}`, className: "after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none", children: product.name }) }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted", children: [
          category?.name,
          needsFlavor && ` · ${product.flavors.length} sabores`
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-[0.95rem] whitespace-nowrap", children: formatPrice(product.price) })
    ] }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "pointer-events-none absolute -inset-2 rounded-3xl group-has-[a:focus-visible]:outline-2 group-has-[a:focus-visible]:outline-rose" })
  ] });
}
function Item({ item, tone }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const id = useId();
  const toggle = () => {
    const el = panel.current;
    const next = !open;
    setOpen(next);
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.height = next ? "auto" : "0px";
      return;
    }
    gsap.to(el, { height: next ? "auto" : 0, duration: 0.55, ease: "expo.out" });
  };
  return /* @__PURE__ */ jsxs("div", { className: `border-b ${tone === "dark" ? "border-bone/15" : "border-line"}`, children: [
    /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        "aria-expanded": open,
        "aria-controls": id,
        onClick: toggle,
        className: "group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium md:text-xl",
        children: [
          item.q,
          /* @__PURE__ */ jsxs(
            "span",
            {
              "aria-hidden": "true",
              className: `relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${tone === "dark" ? "bg-bone/10 group-hover:bg-bone group-hover:text-ink" : "bg-ink/6 group-hover:bg-ink group-hover:text-bone"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "absolute h-px w-3.5 bg-current" }),
                /* @__PURE__ */ jsx("span", { className: `absolute h-3.5 w-px bg-current transition-transform duration-500 ease-(--ease-out-expo) ${open ? "rotate-90 scale-0" : ""}` })
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { id, ref: panel, role: "region", className: "h-0 overflow-hidden", "aria-hidden": !open, children: /* @__PURE__ */ jsx("p", { className: `max-w-3xl pr-14 pb-7 ${tone === "dark" ? "text-fog" : "text-muted"}`, children: item.a }) })
  ] });
}
function Accordion({ items, tone = "light" }) {
  return /* @__PURE__ */ jsx("div", { className: `border-t ${tone === "dark" ? "border-bone/15" : "border-line"}`, children: items.map((item) => /* @__PURE__ */ jsx(Item, { item, tone }, item.q)) });
}
const trainingFaq = [
  {
    q: "¿Qué incluye la asesoría integral?",
    a: "Una evaluación física para conocer tu punto de partida, un plan de entrenamiento, un plan nutricional personalizado y controles semanales para ajustar el plan según tu avance.",
    confirmed: true
  },
  {
    q: "¿Cómo empiezo?",
    a: "Escribile a Noelia por WhatsApp o completá el formulario del plan que te interese. Te responde para coordinar la evaluación física, que es el primer paso.",
    confirmed: true
  },
  {
    q: "¿Cuánto cuesta un plan?",
    a: "El precio depende del plan y de la modalidad. Noelia te lo pasa cuando le escribís, junto con las formas de pago.",
    confirmed: false
  },
  {
    q: "¿El entrenamiento es online o presencial?",
    a: "Consultalo al escribirle: la modalidad se coordina según el plan.",
    confirmed: false
  },
  {
    q: "¿Tengo que comprar suplementos para entrenar con Noelia?",
    a: "No. Los planes y la tienda son independientes: podés contratar un plan sin comprar suplementos.",
    confirmed: true
  }
];
const storeFaq = [
  {
    q: "¿Los suplementos reemplazan la comida?",
    a: "No. Un suplemento complementa una alimentación variada. Si tenés una condición de salud, estás embarazada o tomás medicación, consultá con un profesional antes de usarlos.",
    confirmed: true
  },
  {
    q: "¿Cómo pago el pedido?",
    a: "Al confirmar, el pedido queda registrado y Noelia te contacta para coordinar el pago y la entrega.",
    confirmed: false
  },
  {
    q: "¿Hacen envíos?",
    a: "Las zonas y los costos de envío se confirman al coordinar el pedido.",
    confirmed: false
  }
];
const homeFaq = [...trainingFaq.slice(0, 4), storeFaq[0]];
function Hero() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    let split;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref.current);
      split = SplitText.create(q("h1")[0], { type: "lines", mask: "lines" });
      gsap.timeline({ defaults: { ease: "expo.out" } }).fromTo(q("[data-hero-bg]"), { scale: 1.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2 }, 0).from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09 }, 0.25).fromTo(q("[data-hero-photo]"), { clipPath: "inset(100% 0 0 0 round 24px)" }, { clipPath: "inset(0% 0 0 0 round 24px)", duration: 1.5, ease: "expo.inOut" }, 0.35).from(q("[data-hero-photo] img"), { scale: 1.3, duration: 2 }, 0.45).from(q("[data-hero-in]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.8);
      gsap.to(q("[data-hero-bg]"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    }, ref);
    releaseIntro();
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);
  return /* @__PURE__ */ jsxs("section", { ref, "aria-labelledby": "hero-title", className: "relative isolate overflow-hidden bg-ink text-bone", children: [
    /* @__PURE__ */ jsxs("div", { "aria-hidden": "true", className: "absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsx("img", { "data-hero-bg": true, ...stock("gym-barra-sombra"), sizes: "100vw", alt: "", fetchPriority: "high", className: "h-full w-full object-cover opacity-45" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "container-site grid min-h-svh gap-12 pt-32 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsx("p", { "data-hero-in": true, className: "label text-fog", children: "Noelia Perucci · Personal trainer certificada IFBB" }),
        /* @__PURE__ */ jsx("h1", { id: "hero-title", "data-intro": true, className: "mt-6 font-display text-[clamp(3rem,1.2rem+6vw,7.25rem)] leading-[0.88]", children: "Entrenamiento personalizado y plan nutricional" }),
        /* @__PURE__ */ jsx("p", { "data-hero-in": true, className: "mt-8 max-w-xl text-lead text-bone/80", children: "Noelia arma tu plan a partir de una evaluación física y lo ajusta en controles semanales. Entrenamiento y alimentación, en un mismo seguimiento." }),
        /* @__PURE__ */ jsxs("div", { "data-hero-in": true, className: "mt-10 flex flex-col gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento", variant: "primary", size: "lg", magnetic: true, children: "Ver planes de entrenamiento" }),
          /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "outline-light", size: "lg", children: "Comprar suplementos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("figure", { className: "mx-auto w-full max-w-[20rem] lg:col-span-4 lg:col-start-9 lg:mr-0 lg:max-w-[22rem]", children: [
        /* @__PURE__ */ jsx("div", { "data-hero-photo": true, className: "aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-[3/5]", children: /* @__PURE__ */ jsx("img", { src: noelia.stage.src, alt: noelia.stage.alt, width: noelia.stage.w, height: noelia.stage.h, className: "h-full w-full object-cover object-[50%_20%]" }) }),
        /* @__PURE__ */ jsxs("figcaption", { "data-hero-in": true, className: "mt-3 flex justify-between label text-fog", children: [
          /* @__PURE__ */ jsx("span", { children: "NPC Córdoba" }),
          /* @__PURE__ */ jsx("span", { children: "Categoría wellness" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-bone/12", children: /* @__PURE__ */ jsx("ul", { className: "container-site grid gap-x-10 gap-y-3 py-7 sm:grid-cols-3", children: site.credentials.map((c) => /* @__PURE__ */ jsxs("li", { "data-hero-in": true, className: "flex flex-col", children: [
      /* @__PURE__ */ jsx("span", { className: "label text-fog", children: c.issuer }),
      /* @__PURE__ */ jsxs("span", { className: "mt-1 text-[0.95rem]", children: [
        c.title,
        c.year && ` · ${c.year}`
      ] })
    ] }, c.title)) }) })
  ] });
}
function Paths() {
  const featured = queryProducts({ featured: true }).slice(0, 3);
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "paths-title", className: "container-site section-y", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-12 lg:items-end", children: [
      /* @__PURE__ */ jsx("h2", { id: "paths-title", "data-split": true, className: "font-display text-display lg:col-span-7", children: "Planes de entrenamiento y suplementos" }),
      /* @__PURE__ */ jsx("p", { "data-fade": true, className: "max-w-md text-muted lg:col-span-4 lg:col-start-9", children: "Dos cosas distintas en un mismo lugar: un servicio que se coordina con Noelia y una tienda donde comprás productos." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-14 grid gap-5 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/entrenamiento", className: "group relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink p-8 text-bone md:p-10", children: [
        /* @__PURE__ */ jsxs("div", { "data-img-reveal": true, className: "absolute inset-0 -z-10", children: [
          /* @__PURE__ */ jsx("img", { ...stock("kettlebell-tiza"), sizes: "(min-width: 1024px) 50vw, 100vw", alt: "", loading: "lazy", className: "h-full w-full object-cover opacity-70 transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-105" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "label text-fog", children: "Servicio · Se coordina con Noelia" }),
        /* @__PURE__ */ jsx("h3", { className: "mt-3 font-display text-[clamp(2.4rem,1.6rem+2.4vw,4rem)] leading-[0.9]", children: "Planes de entrenamiento" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-sm text-bone/75", children: "Evaluación física, plan de entrenamiento, plan nutricional y controles semanales." }),
        /* @__PURE__ */ jsxs("span", { className: "mt-8 inline-flex items-center gap-3 font-medium", children: [
          "Ver planes",
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "grid size-10 place-items-center rounded-full bg-rose transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2", children: "→" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/tienda", className: "group relative isolate flex min-h-[32rem] flex-col justify-between overflow-hidden rounded-3xl bg-shelf p-8 md:p-10", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: featured.map((p, i) => /* @__PURE__ */ jsx(
          "img",
          {
            src: p.image.src,
            alt: "",
            loading: "lazy",
            className: "aspect-[3/4] w-full object-contain mix-blend-multiply transition-transform duration-700 ease-(--ease-out-expo) group-hover:-translate-y-2",
            style: { transitionDelay: `${i * 60}ms` }
          },
          p.slug
        )) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "label text-muted", children: "Tienda · Comprás online" }),
          /* @__PURE__ */ jsx("h3", { className: "mt-3 font-display text-[clamp(2.4rem,1.6rem+2.4vw,4rem)] leading-[0.9]", children: "Suplementos deportivos" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-sm text-muted", children: "Proteínas, creatina, pre-entreno, vitaminas y accesorios." }),
          /* @__PURE__ */ jsxs("span", { className: "mt-8 inline-flex items-center gap-3 font-medium", children: [
            "Ir a la tienda",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "grid size-10 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2", children: "→" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Statement() {
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "method-title", className: "container-site pb-24 lg:pb-36", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-10 border-t border-line pt-10 lg:grid-cols-12", children: [
    /* @__PURE__ */ jsx("h2", { id: "method-title", className: "label text-muted lg:col-span-3", children: "Cómo trabaja Noelia" }),
    /* @__PURE__ */ jsx("p", { "data-scrub-words": true, className: "font-title text-statement lg:col-span-9", children: "Primero te evalúa. Con esa información arma tu plan de entrenamiento y tu plan nutricional. Después, cada semana, revisa tu avance y ajusta lo que haga falta." })
  ] }) });
}
function Plans() {
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "plans-title", className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-6 lg:flex-row lg:items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "label text-muted", children: "Entrenamiento" }),
        /* @__PURE__ */ jsx("h2", { id: "plans-title", "data-split": true, className: "mt-4 font-display text-display", children: "Planes de entrenamiento personalizado" })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, children: /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento#comparativa", variant: "text", children: "Comparar planes" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid gap-5 lg:grid-cols-3", children: PLANS.map((p) => /* @__PURE__ */ jsx("div", { "data-fade": true, className: "flex", children: /* @__PURE__ */ jsx(PlanCard, { plan: p }) }, p.slug)) })
  ] }) });
}
function Store() {
  const products = queryProducts({ featured: true }).slice(0, 4);
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "store-title", className: "container-site section-y", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-8 lg:flex-row lg:items-end", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "label text-muted", children: "Tienda" }),
        /* @__PURE__ */ jsx("h2", { id: "store-title", "data-split": true, className: "mt-4 font-display text-display", children: "Suplementos deportivos" })
      ] }),
      /* @__PURE__ */ jsx("nav", { "data-fade": true, "aria-label": "Categorías", className: "flex flex-wrap gap-2", children: CATEGORIES.map((c) => /* @__PURE__ */ jsx(Link, { to: `/tienda/categoria/${c.slug}`, className: "rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-bone", children: c.name }, c.slug)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4", children: products.map((p) => /* @__PURE__ */ jsx("div", { "data-fade": true, children: /* @__PURE__ */ jsx(ProductCard, { product: p }) }, p.slug)) }),
    /* @__PURE__ */ jsxs("div", { "data-fade": true, className: "mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "Catálogo de demostración: productos, fotos y precios ilustrativos." }),
      /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "dark", children: "Ver todos los suplementos" })
    ] })
  ] });
}
function About() {
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "about-title", className: "bg-ink text-bone section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-14 lg:grid-cols-12 lg:items-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative lg:col-span-5", children: [
      /* @__PURE__ */ jsx("div", { "data-img-reveal": true, className: "aspect-square overflow-hidden rounded-3xl", children: /* @__PURE__ */ jsx("img", { src: noelia.stageSquare.src, alt: noelia.stageSquare.alt, width: 640, height: 640, loading: "lazy", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxs("figure", { "data-fade": true, className: "absolute -right-3 -bottom-10 w-[58%] rounded-2xl bg-bone p-2 shadow-2xl md:-right-10", children: [
        /* @__PURE__ */ jsx("img", { src: noelia.certificate.src, alt: noelia.certificate.alt, width: noelia.certificate.w, height: noelia.certificate.h, loading: "lazy", className: "w-full rounded-xl" }),
        /* @__PURE__ */ jsx("figcaption", { className: "px-2 pt-2 pb-1 label text-muted", children: "Certificación Olympia · 2021" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-8 lg:col-span-6 lg:col-start-7 lg:pt-0", children: [
      /* @__PURE__ */ jsx("p", { "data-fade": true, className: "label text-fog", children: "Sobre Noelia" }),
      /* @__PURE__ */ jsx("h2", { id: "about-title", "data-split": true, className: "mt-4 font-display text-display", children: "Noelia Perucci, personal trainer IFBB" }),
      /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-8 max-w-lg text-lead text-bone/75", children: "Se formó en dos instituciones internacionales, IFBB y la Academia Olympia, y compite en la categoría wellness de NPC. Hoy acompaña a sus alumnas con evaluación física, plan de entrenamiento, plan nutricional y controles semanales." }),
      /* @__PURE__ */ jsx("ul", { "data-fade": true, className: "mt-10 divide-y divide-bone/12 border-y border-bone/12", children: site.credentials.map((c) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col justify-between gap-1 py-4 sm:flex-row", children: [
        /* @__PURE__ */ jsx("span", { children: c.title }),
        /* @__PURE__ */ jsxs("span", { className: "label text-fog", children: [
          c.issuer,
          c.year && ` · ${c.year}`
        ] })
      ] }, c.title)) }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, className: "mt-10", children: /* @__PURE__ */ jsx(ButtonLink, { to: "/sobre-noelia", variant: "outline-light", children: "Conocer a Noelia" }) })
    ] })
  ] }) });
}
function Faq() {
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "faq-title", className: "container-site section-y", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4", children: [
      /* @__PURE__ */ jsx("h2", { id: "faq-title", "data-split": true, className: "font-display text-title", children: "Preguntas frecuentes" }),
      /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-5 max-w-xs text-muted", children: "¿Otra duda? Escribile a Noelia por WhatsApp." })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-fade": true, className: "lg:col-span-8", children: /* @__PURE__ */ jsx(Accordion, { items: homeFaq }) })
  ] }) });
}
function FinalCta() {
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "cta-title", className: "container-site pb-24 lg:pb-32", children: /* @__PURE__ */ jsxs("div", { className: "relative isolate overflow-hidden rounded-[2rem] bg-ink px-8 py-20 text-bone md:px-16 md:py-28", children: [
    /* @__PURE__ */ jsx("img", { "data-parallax": true, ...stock("kettlebells-bn"), sizes: "100vw", alt: "", loading: "lazy", className: "absolute inset-0 -z-10 h-[115%] w-full object-cover opacity-35" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20" }),
    /* @__PURE__ */ jsx("p", { "data-fade": true, className: "label text-fog", children: "Empezá hoy" }),
    /* @__PURE__ */ jsx("h2", { id: "cta-title", "data-split": true, className: "mt-4 max-w-3xl font-display text-display", children: "Pedí tu plan de entrenamiento" }),
    /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-6 max-w-lg text-bone/75", children: "Contale a Noelia tu objetivo y desde dónde partís. Te responde para coordinar la evaluación física." }),
    /* @__PURE__ */ jsxs("div", { "data-fade": true, className: "mt-10 flex flex-col gap-3 sm:flex-row", children: [
      /* @__PURE__ */ jsx(ButtonExternal, { href: whatsappLink("Hola Noelia, quiero empezar a entrenar con vos."), variant: "primary", size: "lg", magnetic: true, children: "Escribir por WhatsApp" }),
      /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento#consulta", variant: "outline-light", size: "lg", children: "Dejar una consulta" })
    ] })
  ] }) });
}
function HomePage() {
  const ref = useRef(null);
  usePageMotion(ref);
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: "Noelia Perucci | Personal trainer IFBB: entrenamiento y plan nutricional",
        description: "Entrenamiento personalizado con evaluación física, plan nutricional y controles semanales con Noelia Perucci, personal trainer certificada IFBB. Tienda de suplementos deportivos.",
        path: "/",
        jsonLd: [{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url, inLanguage: "es-AR" }, personJsonLd, faqJsonLd(homeFaq)]
      }
    ),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Paths, {}),
    /* @__PURE__ */ jsx(Statement, {}),
    /* @__PURE__ */ jsx(ProcessScroller, {}),
    /* @__PURE__ */ jsx(Plans, {}),
    /* @__PURE__ */ jsx(Store, {}),
    /* @__PURE__ */ jsx(About, {}),
    /* @__PURE__ */ jsx(Faq, {}),
    /* @__PURE__ */ jsx(FinalCta, {})
  ] });
}
function NotFoundPage() {
  return /* @__PURE__ */ jsxs("div", { className: "container-site pt-36 pb-28 md:pt-44", children: [
    /* @__PURE__ */ jsx(Seo, { title: "Página no encontrada", description: "La página que buscás no existe.", noindex: true }),
    /* @__PURE__ */ jsx("p", { className: "font-mono text-sm text-rose", children: "Error 404" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-display", children: "Esta página no existe" }),
    /* @__PURE__ */ jsx("p", { className: "mt-6 max-w-md text-muted", children: "Puede que el enlace haya cambiado. Seguí desde acá:" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento", variant: "primary", children: "Ver planes" }),
      /* @__PURE__ */ jsx(ButtonLink, { to: "/tienda", variant: "dark", children: "Ver suplementos" }),
      /* @__PURE__ */ jsx(ButtonLink, { to: "/", variant: "outline", children: "Ir al inicio" })
    ] })
  ] });
}
function PlanDetailPage() {
  const { slug = "" } = useParams();
  const plan = findPlan(slug);
  const ref = useRef(null);
  usePageMotion(ref, [slug]);
  if (!plan) return /* @__PURE__ */ jsx(NotFoundPage, {});
  const others = PLANS.filter((p) => p.slug !== plan.slug);
  const facts = [
    { k: "Modalidad", v: plan.modality ?? "A consultar" },
    { k: "Duración", v: plan.duration ?? "A consultar" },
    { k: "Controles", v: plan.checkIns ?? "A consultar" }
  ];
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: plan.seo.title,
        description: plan.seo.description,
        path: `/entrenamiento/${plan.slug}`,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: plan.name,
            description: plan.summary,
            serviceType: "Entrenamiento personalizado",
            url: absoluteUrl(`/entrenamiento/${plan.slug}`),
            provider: { "@type": "Person", name: "Noelia Perucci" },
            areaServed: { "@type": "Country", name: "Argentina" },
            ...plan.price && { offers: { "@type": "Offer", price: plan.price.amount, priceCurrency: plan.price.currency } }
          },
          breadcrumbJsonLd([
            { name: "Planes", path: "/entrenamiento" },
            { name: plan.name, path: `/entrenamiento/${plan.slug}` }
          ])
        ]
      }
    ),
    /* @__PURE__ */ jsx(PageHeader, { title: plan.seo.h1, crumbs: [{ name: "Inicio", to: "/" }, { name: "Planes", to: "/entrenamiento" }, { name: plan.name }], image: "kettlebell-gris", lead: plan.summary, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [
      /* @__PURE__ */ jsx(ButtonLink, { to: "#solicitar", variant: "primary", size: "lg", magnetic: true, children: planCta(plan) }),
      /* @__PURE__ */ jsx(ButtonExternal, { href: whatsappLink(`Hola Noelia, quiero consultar por: ${plan.name}.`), variant: "outline-light", size: "lg", children: "Consultar por WhatsApp" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-14 section-y lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-24 lg:col-span-7", children: [
        /* @__PURE__ */ jsxs("section", { "aria-labelledby": "includes-title", children: [
          /* @__PURE__ */ jsx("h2", { id: "includes-title", "data-split": true, className: "font-display text-title", children: "Qué incluye" }),
          /* @__PURE__ */ jsx("ol", { className: "mt-10 border-t border-line", children: plan.includes.map((f, i) => /* @__PURE__ */ jsxs("li", { "data-fade": true, className: "grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-7", children: [
            /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm text-rose", children: [
              "0",
              i + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-title text-2xl", children: f.label }),
              f.detail && /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted", children: f.detail })
            ] })
          ] }, f.label)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { "aria-labelledby": "forwhom-title", className: "grid gap-10 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { "data-fade": true, children: [
            /* @__PURE__ */ jsx("h2", { id: "forwhom-title", className: "font-title text-2xl", children: "Para quién es" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3", children: plan.forWhom.map((t) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: "mt-1.5 size-4 shrink-0 text-rose", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8.5l3 3 7-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }) }),
              t
            ] }, t)) })
          ] }),
          plan.notFor.length > 0 && /* @__PURE__ */ jsxs("div", { "data-fade": true, children: [
            /* @__PURE__ */ jsx("h2", { className: "font-title text-2xl", children: "Cuándo conviene otro plan" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-5 space-y-3 text-muted", children: plan.notFor.map((t) => /* @__PURE__ */ jsx("li", { children: t }, t)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("aside", { "aria-label": "Resumen del plan", className: "lg:col-span-4 lg:col-start-9", children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-3xl bg-white lg:sticky lg:top-28", children: [
        /* @__PURE__ */ jsx("img", { src: plan.image.src, alt: plan.image.alt, loading: "lazy", className: "aspect-[16/10] w-full object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 p-7", children: [
          /* @__PURE__ */ jsx(PlanPrice, { plan }),
          /* @__PURE__ */ jsx("dl", { className: "divide-y divide-line border-y border-line text-[0.95rem]", children: facts.map((r) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4 py-3.5", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-muted", children: r.k }),
            /* @__PURE__ */ jsx("dd", { children: r.v })
          ] }, r.k)) }),
          /* @__PURE__ */ jsx(ButtonLink, { to: "#solicitar", variant: "primary", className: "w-full justify-between", children: planCta(plan) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "Es un servicio: no se compra en el carrito. Noelia te contacta para coordinar." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "solicitar", "aria-labelledby": "request-title", className: "bg-ink text-bone section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-12 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4", children: [
        /* @__PURE__ */ jsx("h2", { id: "request-title", "data-split": true, className: "font-display text-title", children: plan.status === "confirmado" ? `Pedí la ${plan.name.toLowerCase()}` : `Consultá por ${plan.name.toLowerCase()}` }),
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-5 max-w-sm text-fog", children: "Dejá tus datos y Noelia te contacta para coordinar la evaluación física." })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, className: "lg:col-span-8", children: /* @__PURE__ */ jsx(InquiryForm, { fixedPlan: plan, tone: "dark" }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "other-plans", className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site", children: [
      /* @__PURE__ */ jsx("h2", { id: "other-plans", "data-split": true, className: "font-display text-title", children: "Otros planes" }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-5 md:grid-cols-2", children: others.map((p) => /* @__PURE__ */ jsx("div", { "data-fade": true, className: "flex", children: /* @__PURE__ */ jsx(PlanCard, { plan: p }) }, p.slug)) })
    ] }) })
  ] }, slug);
}
function ProductPage() {
  const { slug = "" } = useParams();
  const product = findProduct(slug);
  const { add, open } = useCart();
  const [flavor, setFlavor] = useState(null);
  const [qty, setQty] = useState(1);
  const [flavorError, setFlavorError] = useState(false);
  const [added, setAdded] = useState(false);
  const img = useRef(null);
  const ref = useRef(null);
  usePageMotion(ref, [slug]);
  useEffect(() => {
    setFlavor(null);
    setQty(1);
    setFlavorError(false);
    setAdded(false);
    if (img.current && !prefersReducedMotion()) {
      gsap.fromTo(img.current, { y: 40, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: "expo.out" });
    }
  }, [slug]);
  if (!product) return /* @__PURE__ */ jsx(NotFoundPage, {});
  const category = findCategory(product.categorySlug);
  const needsFlavor = product.flavors.length > 0;
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.inStock).sort((a, b) => Number(b.categorySlug === product.categorySlug) - Number(a.categorySlug === product.categorySlug)).slice(0, 4);
  function onAdd() {
    if (!product) return;
    if (needsFlavor && !flavor) {
      setFlavorError(true);
      document.querySelector('input[name="flavor"]')?.focus();
      return;
    }
    add(product, qty, flavor);
    flyToCart(img.current);
    setAdded(true);
  }
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `${product.name}${category ? ` · ${category.name}` : ""}`,
        description: `${product.shortDescription} ${product.size}. Comprá online en la tienda de Noelia Perucci.`,
        path: `/producto/${product.slug}`,
        image: product.image.src,
        noindex: product.isDemo,
        jsonLd: breadcrumbJsonLd([
          { name: "Suplementos", path: "/tienda" },
          ...category ? [{ name: category.name, path: `/tienda/categoria/${category.slug}` }] : [],
          { name: product.name, path: `/producto/${product.slug}` }
        ])
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "container-site pt-28 pb-20 md:pt-32", children: [
      /* @__PURE__ */ jsx("nav", { "aria-label": "Ruta de navegación", className: "mb-8", children: /* @__PURE__ */ jsxs("ol", { className: "flex flex-wrap items-center gap-2 label text-muted", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/tienda", className: "hover:text-ink", children: "Suplementos" }) }),
        category && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("li", { "aria-hidden": "true", children: "/" }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: `/tienda/categoria/${category.slug}`, className: "hover:text-ink", children: category.name }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-12 lg:gap-16", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxs("div", { className: "relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-shelf lg:sticky lg:top-28", children: [
          /* @__PURE__ */ jsx("img", { ref: img, src: product.image.src, alt: product.image.alt, width: 720, height: 720, className: "w-[78%] object-contain mix-blend-multiply" }),
          product.isDemo && /* @__PURE__ */ jsx("span", { className: "absolute bottom-5 left-5 label text-fog", children: "Foto de ejemplo" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
          /* @__PURE__ */ jsx("p", { className: "label text-muted", children: category?.name }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-title", children: product.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-muted", children: product.shortDescription }),
          /* @__PURE__ */ jsxs("p", { className: "mt-8 flex items-baseline gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "font-mono text-3xl", children: formatPrice(product.price) }),
            product.isDemo && /* @__PURE__ */ jsx("span", { className: "text-sm text-muted", children: "Precio de ejemplo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 space-y-8 border-t border-line pt-8", children: [
            needsFlavor && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                ChoiceGroup,
                {
                  legend: "Sabor",
                  name: "flavor",
                  value: flavor,
                  onChange: (f) => {
                    setFlavor(f);
                    setFlavorError(false);
                  },
                  options: product.flavors.map((f) => ({ value: f, label: f }))
                }
              ),
              flavorError && /* @__PURE__ */ jsx("p", { role: "alert", className: "mt-3 text-sm text-danger", children: "Elegí un sabor para agregarlo al carrito." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
              /* @__PURE__ */ jsx(QuantityStepper, { label: "Cantidad", value: qty, onChange: setQty }),
              /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", className: "flex-1 justify-between", onClick: onAdd, disabled: !product.inStock, arrow: product.inStock, children: product.inStock ? `Agregar al carrito · ${formatPrice(product.price * qty)}` : "Sin stock" })
            ] }),
            added && /* @__PURE__ */ jsxs("div", { role: "status", className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[0.95rem]", children: "✓ Agregado al carrito." }),
              /* @__PURE__ */ jsxs("span", { className: "flex gap-4 text-[0.95rem]", children: [
                /* @__PURE__ */ jsx("button", { type: "button", onClick: open, className: "font-medium underline underline-offset-4", children: "Ver carrito" }),
                /* @__PURE__ */ jsx(Link, { to: "/checkout", className: "font-medium underline underline-offset-4", children: "Finalizar compra" })
              ] })
            ] }),
            !product.inStock && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted", children: "Este producto no tiene stock en este momento." })
          ] }),
          /* @__PURE__ */ jsx("dl", { className: "mt-12 divide-y divide-line border-y border-line text-[0.95rem]", children: product.specs.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-6 py-4", children: [
            /* @__PURE__ */ jsx("dt", { className: "text-muted", children: s.label }),
            /* @__PURE__ */ jsx("dd", { className: "text-right", children: s.value })
          ] }, s.label)) }),
          /* @__PURE__ */ jsx("p", { className: "mt-8 text-muted", children: product.description }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 rounded-2xl bg-sand px-5 py-4 text-sm text-muted", children: "Los suplementos dietarios no reemplazan una alimentación variada. Si tenés una condición de salud, estás embarazada o tomás medicación, consultá con un profesional antes de usarlos." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 rounded-3xl bg-ink p-7 text-bone", children: [
            /* @__PURE__ */ jsx("p", { className: "font-title text-xl", children: "¿Querés un plan que acompañe lo que tomás?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-fog", children: "La asesoría integral de Noelia incluye un plan nutricional personalizado." }),
            /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(ButtonLink, { to: "/entrenamiento/asesoria-integral", variant: "light", children: "Ver la asesoría" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "related-title", className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site", children: [
      /* @__PURE__ */ jsx("h2", { id: "related-title", "data-split": true, className: "font-display text-title", children: "También te puede servir" }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4", children: related.map((p) => /* @__PURE__ */ jsx("div", { "data-fade": true, children: /* @__PURE__ */ jsx(ProductCard, { product: p }) }, p.slug)) })
    ] }) })
  ] }, slug);
}
const SORT_LABELS = {
  destacados: "Destacados",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
  nombre: "Nombre (A-Z)"
};
function StorePage() {
  const { category: categorySlug } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sortParam = params.get("orden");
  const sort = sortParam && PRODUCT_SORTS.includes(sortParam) ? sortParam : "destacados";
  const [term, setTerm] = useState(q);
  const category = categorySlug ? findCategory(categorySlug) : void 0;
  const products = queryProducts({ category: categorySlug, q, sort });
  const grid = useRef(null);
  const ref = useRef(null);
  usePageMotion(ref, [categorySlug]);
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (term.trim() === q) return;
      const next = new URLSearchParams(params);
      if (term.trim()) next.set("q", term.trim());
      else next.delete("q");
      setParams(next, { replace: true, preventScrollReset: true });
    }, 250);
    return () => window.clearTimeout(id);
  }, [term, q, params, setParams]);
  const key = `${categorySlug}|${q}|${sort}`;
  useEffect(() => {
    if (!grid.current || prefersReducedMotion()) return;
    gsap.fromTo(grid.current.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05, overwrite: true });
  }, [key]);
  if (categorySlug && !category) return /* @__PURE__ */ jsx(NotFoundPage, {});
  const title = category ? category.h1 : "Suplementos deportivos";
  const chip = "inline-flex h-11 items-center rounded-full border border-line px-5 text-[0.95rem] whitespace-nowrap transition-colors hover:border-ink aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-bone";
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: category ? `${category.h1}: precios y presentaciones` : "Tienda de suplementos deportivos",
        description: category ? `${category.description} Comprá online en la tienda de Noelia Perucci, personal trainer IFBB.` : "Proteína en polvo, creatina, pre-entreno, vitaminas y accesorios. Comprá online en la tienda de Noelia Perucci, personal trainer IFBB.",
        path: category ? `/tienda/categoria/${category.slug}` : "/tienda",
        noindex: !!q,
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Suplementos", path: "/tienda" },
            ...category ? [{ name: category.name, path: `/tienda/categoria/${category.slug}` }] : []
          ]),
          faqJsonLd(storeFaq)
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title,
        crumbs: [{ name: "Inicio", to: "/" }, ...category ? [{ name: "Suplementos", to: "/tienda" }, { name: category.name }] : [{ name: "Suplementos" }]],
        image: "mancuerna-fondo-negro",
        lead: /* @__PURE__ */ jsxs(Fragment, { children: [
          category?.description ?? "Proteínas, creatina, pre-entreno, vitaminas y accesorios para acompañar tu entrenamiento.",
          /* @__PURE__ */ jsx("span", { className: "mt-3 block text-sm text-fog", children: "Catálogo de demostración: productos, fotos y precios ilustrativos." })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-30 border-b border-line bg-bone/90 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "container-site flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsx("nav", { "aria-label": "Categorías", "data-lenis-prevent": true, className: "-mx-5 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:mx-0 lg:px-0", children: /* @__PURE__ */ jsxs("ul", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(NavLink, { to: "/tienda", end: true, preventScrollReset: true, className: chip, children: "Todos" }) }),
        CATEGORIES.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(NavLink, { to: `/tienda/categoria/${c.slug}`, className: chip, children: c.name }) }, c.slug))
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "relative flex-1 lg:w-72 lg:flex-none", children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Buscar suplementos" }),
          /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", viewBox: "0 0 20 20", className: "absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted", children: [
            /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "6", fill: "none", stroke: "currentColor", strokeWidth: "1.6" }),
            /* @__PURE__ */ jsx("path", { d: "M13 13l5 5", stroke: "currentColor", strokeWidth: "1.6" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "search",
              value: term,
              onChange: (e) => setTerm(e.target.value),
              placeholder: "Buscar: creatina, vainilla…",
              className: "h-11 w-full rounded-full border border-line bg-white pr-4 pl-11 text-[0.95rem] focus:border-ink focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("label", { className: "sr-only", htmlFor: "sort", children: "Ordenar por" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            id: "sort",
            value: sort,
            onChange: (e) => {
              const next = new URLSearchParams(params);
              if (e.target.value === "destacados") next.delete("orden");
              else next.set("orden", e.target.value);
              setParams(next, { replace: true, preventScrollReset: true });
            },
            className: "h-11 rounded-full border border-line bg-white px-4 text-[0.95rem] focus:border-ink focus:outline-none",
            children: PRODUCT_SORTS.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: SORT_LABELS[s] }, s))
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "aria-labelledby": "results-title", className: "container-site py-14 md:py-20", children: [
      /* @__PURE__ */ jsx("h2", { id: "results-title", className: "sr-only", children: "Productos" }),
      /* @__PURE__ */ jsxs("p", { role: "status", className: "mb-8 label text-muted", children: [
        q ? `${pluralize(products.length, "resultado", "resultados")} para «${q}»` : pluralize(products.length, "producto", "productos"),
        !q && !category && ` de ${PRODUCTS.length}`
      ] }),
      products.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white px-8 py-16 text-center", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-title text-2xl", children: [
          "No encontramos productos",
          q && ` para «${q}»`,
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted", children: "Probá con otra palabra o mirá todas las categorías." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "dark",
            className: "mt-8",
            onClick: () => {
              setTerm("");
              setParams(new URLSearchParams(), { replace: true });
            },
            children: "Ver todos los productos"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { ref: grid, className: "grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4", children: products.map((p, i) => /* @__PURE__ */ jsx(ProductCard, { product: p, priority: i < 4 }, p.slug)) })
    ] }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "store-faq", className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-12 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsx("h2", { id: "store-faq", "data-split": true, className: "font-display text-title lg:col-span-4", children: "Preguntas sobre las compras" }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, className: "lg:col-span-8", children: /* @__PURE__ */ jsx(Accordion, { items: storeFaq }) })
    ] }) })
  ] }, categorySlug ?? "todas");
}
const FEATURES = ["Evaluación física", "Plan de entrenamiento", "Plan nutricional personalizado", "Controles semanales"];
function featureOf(plan, label) {
  return plan.includes.find((f) => f.label.startsWith(label)) ?? (label === "Controles semanales" ? plan.includes.find((f) => f.label === "Seguimiento") : void 0);
}
function Mark({ plan, label }) {
  const f = featureOf(plan, label);
  if (f) {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: "size-4 text-rose", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8.5l3 3 7-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }) }),
      /* @__PURE__ */ jsx("span", { children: f.label === label ? "Incluye" : f.label })
    ] });
  }
  return /* @__PURE__ */ jsx("span", { className: "text-muted", children: plan.status === "propuesta" ? "A definir" : "No incluye" });
}
function PlanComparison({ plans }) {
  const rows = [
    ...FEATURES.map((label) => ({ label, render: (p) => /* @__PURE__ */ jsx(Mark, { plan: p, label }) })),
    { label: "Modalidad", render: (p) => p.modality ?? /* @__PURE__ */ jsx("span", { className: "text-muted", children: "A consultar" }) },
    { label: "Precio", render: (p) => /* @__PURE__ */ jsx(PlanPrice, { plan: p }) }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "hidden overflow-hidden rounded-3xl bg-white md:block", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-[0.95rem]", children: [
      /* @__PURE__ */ jsx("caption", { className: "sr-only", children: "Comparación de los planes de entrenamiento" }),
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-line", children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "w-1/4 px-8 py-7 align-bottom label font-normal text-muted", children: "Qué incluye" }),
        plans.map((p) => /* @__PURE__ */ jsxs("th", { scope: "col", className: `px-6 py-7 align-bottom ${p.featured ? "bg-ink text-bone" : ""}`, children: [
          /* @__PURE__ */ jsxs("span", { className: `label ${p.featured ? "text-fog" : "text-muted"}`, children: [
            "Plan ",
            p.number
          ] }),
          /* @__PURE__ */ jsx(Link, { to: `/entrenamiento/${p.slug}`, className: "mt-2 block font-display text-2xl leading-none hover:text-rose", children: p.name })
        ] }, p.slug))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-line last:border-0", children: [
        /* @__PURE__ */ jsx("th", { scope: "row", className: "px-8 py-5 font-medium", children: row.label }),
        plans.map((p) => /* @__PURE__ */ jsx("td", { className: `px-6 py-5 ${p.featured ? "bg-ink text-bone [&_.text-muted]:text-fog" : ""}`, children: row.render(p) }, p.slug))
      ] }, row.label)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 md:hidden", children: plans.map((p) => /* @__PURE__ */ jsxs("section", { "aria-labelledby": `cmp-${p.slug}`, className: `rounded-3xl p-6 ${p.featured ? "bg-ink text-bone [&_.text-muted]:text-fog" : "bg-white"}`, children: [
      /* @__PURE__ */ jsxs("p", { className: "label text-muted", children: [
        "Plan ",
        p.number
      ] }),
      /* @__PURE__ */ jsx("h3", { id: `cmp-${p.slug}`, className: "mt-1 font-display text-2xl", children: /* @__PURE__ */ jsx(Link, { to: `/entrenamiento/${p.slug}`, children: p.name }) }),
      /* @__PURE__ */ jsx("dl", { className: `mt-4 divide-y text-[0.95rem] ${p.featured ? "divide-bone/15" : "divide-line"}`, children: rows.map((row) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 py-3", children: [
        /* @__PURE__ */ jsx("dt", { className: "font-medium", children: row.label }),
        /* @__PURE__ */ jsx("dd", { className: "text-right", children: row.render(p) })
      ] }, row.label)) })
    ] }, p.slug)) })
  ] });
}
const where = "";
const steps = [
  { title: "Le escribís", text: "Por WhatsApp o con el formulario de abajo, con tu objetivo." },
  { title: "Evaluación física", text: "Noelia conoce tu punto de partida y te cuenta las condiciones del plan." },
  { title: "Recibís tu plan", text: "Plan de entrenamiento y, en la asesoría integral, plan nutricional." },
  { title: "Controles semanales", text: "Revisan tu avance y ajustan el plan cada semana." }
];
function TrainingPage() {
  const ref = useRef(null);
  usePageMotion(ref);
  return /* @__PURE__ */ jsxs("div", { ref, children: [
    /* @__PURE__ */ jsx(
      Seo,
      {
        title: `Planes de entrenamiento personalizado${where}`,
        description: `Compará los planes de Noelia Perucci, personal trainer IFBB${where}: asesoría integral con evaluación física, plan de entrenamiento, plan nutricional y controles semanales.`,
        path: "/entrenamiento",
        jsonLd: [
          breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Planes de entrenamiento", path: "/entrenamiento" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Planes de entrenamiento de Noelia Perucci",
            itemListElement: PLANS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/entrenamiento/${p.slug}`), name: p.name }))
          },
          faqJsonLd(trainingFaq)
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Planes de entrenamiento personalizado",
        crumbs: [{ name: "Inicio", to: "/" }, { name: "Planes" }],
        image: "barra-disco-oscuro",
        lead: "Todos los planes empiezan con una evaluación física. Compará qué incluye cada uno y pedí el que necesitás: Noelia te responde para coordinar.",
        children: /* @__PURE__ */ jsx(ButtonExternal, { href: whatsappLink("Hola Noelia, quiero consultar qué plan me conviene."), variant: "outline-light", children: "Consultar qué plan me conviene" })
      }
    ),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "plans-list", className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site", children: [
      /* @__PURE__ */ jsx("h2", { id: "plans-list", "data-split": true, className: "font-display text-title", children: "Elegí tu plan" }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 grid gap-5 lg:grid-cols-3", children: PLANS.map((p) => /* @__PURE__ */ jsx("div", { "data-fade": true, className: "flex", children: /* @__PURE__ */ jsx(PlanCard, { plan: p }) }, p.slug)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { id: "comparativa", "aria-labelledby": "compare-title", className: "container-site section-y", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-12 lg:items-end", children: [
        /* @__PURE__ */ jsx("h2", { id: "compare-title", "data-split": true, className: "font-display text-title lg:col-span-7", children: "Comparación de planes" }),
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "text-muted lg:col-span-4 lg:col-start-9", children: "Lo que incluye cada plan, lado a lado. El precio y la modalidad se confirman al consultar." })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, className: "mt-12", children: /* @__PURE__ */ jsx(PlanComparison, { plans: PLANS }) })
    ] }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "steps-title", className: "bg-ink text-bone section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site", children: [
      /* @__PURE__ */ jsx("h2", { id: "steps-title", "data-split": true, className: "font-display text-title", children: "Cómo empezar a entrenar con Noelia" }),
      /* @__PURE__ */ jsx("ol", { className: "mt-14 grid gap-px overflow-hidden rounded-3xl bg-bone/12 md:grid-cols-2 lg:grid-cols-4", children: steps.map((s, i) => /* @__PURE__ */ jsxs("li", { "data-fade": true, className: "bg-ink p-8 md:p-10", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-sm text-rose", children: [
          "0",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-10 font-title text-2xl", children: s.title }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-fog", children: s.text })
      ] }, s.title)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "aria-labelledby": "training-faq", className: "container-site section-y", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsx("h2", { id: "training-faq", "data-split": true, className: "font-display text-title lg:col-span-4", children: "Preguntas frecuentes sobre los planes" }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, className: "lg:col-span-8", children: /* @__PURE__ */ jsx(Accordion, { items: trainingFaq }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "consulta", "aria-labelledby": "inquiry-title", className: "bg-sand section-y", children: /* @__PURE__ */ jsxs("div", { className: "container-site grid gap-12 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4", children: [
        /* @__PURE__ */ jsx("h2", { id: "inquiry-title", "data-split": true, className: "font-display text-title", children: "Consultá por un plan" }),
        /* @__PURE__ */ jsx("p", { "data-fade": true, className: "mt-5 max-w-sm text-muted", children: "Si no sabés cuál elegir, dejá el plan en blanco y contá tu objetivo: Noelia te orienta." })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-fade": true, className: "lg:col-span-8", children: /* @__PURE__ */ jsx(InquiryForm, {}) })
    ] }) })
  ] });
}
const dark = { darkHero: true };
const routes = [
  {
    element: /* @__PURE__ */ jsx(Layout, {}),
    children: [
      { path: "/", element: /* @__PURE__ */ jsx(HomePage, {}), handle: dark },
      { path: "/entrenamiento", element: /* @__PURE__ */ jsx(TrainingPage, {}), handle: dark },
      { path: "/entrenamiento/:slug", element: /* @__PURE__ */ jsx(PlanDetailPage, {}), handle: dark },
      { path: "/tienda", element: /* @__PURE__ */ jsx(StorePage, {}), handle: dark },
      { path: "/tienda/categoria/:category", element: /* @__PURE__ */ jsx(StorePage, {}), handle: dark },
      { path: "/producto/:slug", element: /* @__PURE__ */ jsx(ProductPage, {}) },
      { path: "/carrito", element: /* @__PURE__ */ jsx(CartPage, {}) },
      { path: "/checkout", element: /* @__PURE__ */ jsx(CheckoutPage, {}) },
      { path: "/sobre-noelia", element: /* @__PURE__ */ jsx(AboutPage, {}), handle: dark },
      { path: "/contacto", element: /* @__PURE__ */ jsx(ContactPage, {}), handle: dark },
      { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) }
    ]
  }
];
const prerenderRoutes = [
  { path: "/", index: true },
  { path: "/entrenamiento", index: true },
  ...PLANS.map((p) => ({ path: `/entrenamiento/${p.slug}`, index: true })),
  { path: "/tienda", index: true },
  ...CATEGORIES.map((c) => ({ path: `/tienda/categoria/${c.slug}`, index: true })),
  // Fichas de demostración: se generan pero no se indexan hasta tener el catálogo real.
  ...PRODUCTS.map((p) => ({ path: `/producto/${p.slug}`, index: !p.isDemo })),
  { path: "/sobre-noelia", index: true },
  { path: "/contacto", index: true },
  { path: "/carrito", index: false },
  { path: "/checkout", index: false }
];
const siteUrl = site.url;
async function render(url) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`http://localhost${url}`));
  if (context instanceof Response) throw new Error(`Respuesta inesperada al prerenderizar ${url}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  const { prelude } = await prerender(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(CartProvider, { children: /* @__PURE__ */ jsx(StaticRouterProvider, { router, context, hydrate: false }) }) })
  );
  return new Response(prelude).text();
}
export {
  prerenderRoutes,
  render,
  siteUrl
};
