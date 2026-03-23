"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

const merchItems = [
  {
    name: "Toast Logo Hoodie",
    price: "$54.99",
    colors: ["Black", "Yellow"],
  },
  {
    name: "Minecraft Toast Tee",
    price: "$29.99",
    colors: ["Black", "White", "Yellow"],
  },
  {
    name: "Toast Gaming Cap",
    price: "$24.99",
    colors: ["Black"],
  },
  {
    name: "Toast Mug",
    price: "$19.99",
    colors: ["Black", "Yellow"],
  },
];

export function Merch() {
  return (
    <section id="merch" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
            Official Store
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Toast <span className="text-primary">Merch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rep the Toast brand with official merchandise. High quality, comfortable, and designed for gamers.
          </p>
        </div>

        {/* Merch Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchItems.map((item, index) => (
            <div
              key={index}
              className="group bg-background rounded-xl border border-border hover:border-primary/50 transition-all overflow-hidden"
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-muted to-secondary/30 flex items-center justify-center relative">
                <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="font-display font-bold text-3xl text-primary-foreground">T</span>
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-primary font-display font-bold text-lg">{item.price}</p>
                <div className="flex gap-2">
                  {item.colors.map((color) => (
                    <span
                      key={color}
                      className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Visit Official Store
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
