import Image from "next/image";

type Product = {
  name: string;
  price: string;
  blurb: string;
  image: string;
  passesTester: boolean;
};

const products: Product[] = [
  {
    name: "Hello Kitty Silver Bangle Set",
    price: "$14",
    blurb: "Adjustable bangle pair, sterling silver finish, 2 pieces.",
    image: "/products/hello-kitty-bangles.jpeg",
    passesTester: false,
  },
  {
    name: "“Faith Moves Mountains” Ring",
    price: "$18",
    blurb: "Mountain-cut band with a keepsake message card, gift-boxed.",
    image: "/products/faith-moves-mountains-ring.jpeg",
    passesTester: false,
  },
  {
    name: "Moissanite Eternity Band — Style One",
    price: "$20",
    blurb: "S925 sterling silver eternity band, full moissanite wrap.",
    image: "/products/eternity-band-style-one.jpeg",
    passesTester: true,
  },
  {
    name: "Cushion Halo Jewelry Set",
    price: "$30",
    blurb: "Necklace, earrings, and ring — matching cushion-cut halo set.",
    image: "/products/cushion-halo-set.jpeg",
    passesTester: true,
  },
  {
    name: "Gold “X” Wrap Solitaire Ring",
    price: "$29",
    blurb: "Gold-tone band with a wrapped X setting and solitaire stone.",
    image: "/products/gold-x-wrap-ring.jpeg",
    passesTester: false,
  },
  {
    name: "Moissanite Eternity Band — Classic",
    price: "$20",
    blurb: "Clean pavé eternity band, S925 sterling silver.",
    image: "/products/eternity-band-classic.jpeg",
    passesTester: true,
  },
  {
    name: "Moissanite Eternity Band — Sterling Shine",
    price: "$29.99",
    blurb: "S925-stamped eternity band, full sparkle all the way around.",
    image: "/products/eternity-band-sterling-shine.jpeg",
    passesTester: true,
  },
  {
    name: "Halo Earrings, Ring & Necklace Set",
    price: "$32",
    blurb: "Matching S925 set — stud earrings, ring, and pendant necklace.",
    image: "/products/halo-set-earrings-ring-necklace.jpeg",
    passesTester: true,
  },
  {
    name: "Teardrop Halo Dangle Earrings",
    price: "$36",
    blurb: "Pear-cut moissanite drop earrings, 1 carat each, sterling silver.",
    image: "/products/teardrop-halo-earrings.jpeg",
    passesTester: true,
  },
  {
    name: "Moissanite Stud Earrings",
    price: "$24.99",
    blurb: "Classic round moissanite studs, S925 silver, gift box included.",
    image: "/products/moissanite-stud-earrings-giftbox.jpeg",
    passesTester: true,
  },
  {
    name: "Four-Piece Moissanite Set",
    price: "$36",
    blurb: "Tennis bracelet, necklace, ring, and earrings — full matching set.",
    image: "/products/four-piece-moissanite-set.jpeg",
    passesTester: true,
  },
  {
    name: "Moissanite Stud Earrings — 8mm",
    price: "$20",
    blurb: "Bold 8mm / 2ct round studs, statement size.",
    image: "/products/moissanite-stud-earrings-8mm.jpeg",
    passesTester: true,
  },
  {
    name: "Three-Stone Moissanite Ring",
    price: "$39",
    blurb: "Classic trilogy setting, S925 sterling silver band.",
    image: "/products/three-stone-moissanite-ring.jpeg",
    passesTester: true,
  },
  {
    name: "Moissanite Tennis Necklace",
    price: "$48",
    blurb: "Full tennis-chain necklace, S925 silver.",
    image: "/products/moissanite-tennis-necklace.jpeg",
    passesTester: true,
  },
  {
    name: "Moissanite Solitaire Necklace",
    price: "$37",
    blurb: "Single round solitaire pendant on a sterling silver chain.",
    image: "/products/moissanite-solitaire-necklace.jpeg",
    passesTester: true,
  },
];

export default function StoreSection() {
  return (
    <section id="store" className="border-b border-border bg-background-raised px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            From the store
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Real, affordable jewelry — sterling silver with moissanite stones.
            Moissanite isn&rsquo;t a diamond, but it&rsquo;s a genuine gemstone
            that passes standard diamond testers, so you get the sparkle and
            the silver without the diamond price tag.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.name}
              className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent/40"
            >
              <div>
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-border bg-grain">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {product.passesTester && (
                    <span className="absolute bottom-2 left-2 rounded-full border border-accent/40 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-wide text-accent-soft">
                      Passes diamond tester
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl">{product.name}</h3>
                <p className="mt-2 text-sm text-muted">{product.blurb}</p>
              </div>
              <p className="mt-4 font-display text-lg text-accent-soft">
                {product.price}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
