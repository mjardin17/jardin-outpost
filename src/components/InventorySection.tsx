"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Static export site (see next.config.ts `output: "export"`) — no server API
// routes are available at runtime, so this fetches Supabase directly from
// the browser. The anon key is safe to expose client-side: RLS on
// `products` only grants public SELECT. See
// video-bot-pipeline/inventory-sync/supabase/migrations/0001_init_inventory.sql
// in the pipeline repo for the policy definition.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://irslzufsqjveyibkfjtz.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_HV03fWT-xFr4mB1x3AGlcg_a3JbBtwA";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // matches the 5-min edge cache upstream

type InventoryProduct = {
  id: string;
  sku: string;
  title: string;
  price: number | string;
  condition: string | null;
  image_url: string | null;
  status: string | null;
  quantity: number | null;
  ebay_listing_id: string | null;
};

async function fetchInventory(): Promise<InventoryProduct[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,sku,title,price,condition,image_url,status,quantity,ebay_listing_id&status=eq.active`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error(`Supabase request failed: ${res.status}`);
  return res.json();
}

function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : String(price);
}

export default function InventorySection() {
  const [products, setProducts] = useState<InventoryProduct[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchInventory();
        if (!cancelled) {
          setProducts(data);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="inventory" className="border-b border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Shop the inventory
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Synced live from eBay — updates automatically as items sell or
            new stock lists.
          </p>
        </div>

        {error && (
          <p className="text-sm text-muted">
            Inventory temporarily unavailable.
          </p>
        )}

        {!error && products === null && (
          <p className="text-sm text-muted">Loading inventory…</p>
        )}

        {!error && products !== null && products.length === 0 && (
          <p className="text-sm text-muted">
            No items listed right now — check back soon.
          </p>
        )}

        {!error && products !== null && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const soldOut =
                product.status === "out_of_stock" || product.quantity === 0;
              return (
                <article
                  key={product.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-background-raised p-6 transition-colors hover:border-accent/40"
                >
                  <div>
                    {product.image_url && (
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-border bg-grain">
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          unoptimized
                        />
                      </div>
                    )}
                    <h3 className="font-display text-xl">{product.title}</h3>
                    {product.condition && (
                      <p className="mt-2 text-sm text-muted">
                        {product.condition}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-display text-lg text-accent-soft">
                      {soldOut ? "Sold out" : formatPrice(product.price)}
                    </p>
                    {!soldOut && product.ebay_listing_id && (
                      <a
                        href={`https://www.ebay.com/itm/${product.ebay_listing_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-soft transition-colors hover:text-foreground"
                      >
                        Buy on eBay →
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
