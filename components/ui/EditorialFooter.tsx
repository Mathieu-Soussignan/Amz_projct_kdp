"use client";

import { ArrowUpRight, Heart } from "lucide-react";
import { BOOKS } from "@/data/books";

export default function EditorialFooter() {
  return (
    <footer className="bg-espresso-900 text-linen-100 pt-20 pb-28 md:pb-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          {/* Brand Signature */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-300/80">
              Collection Officielle • Amazon KDP
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-linen-50 tracking-tight inline-flex items-center">
              <span>CaroT</span>
              <span className="relative inline-flex flex-col items-center">
                <Heart className="w-3.5 h-3.5 text-[#E06D8C] fill-[#E06D8C] -mb-1.5" />
                <span>ı</span>
              </span>
              <span>ne</span>
            </h3>
            <p className="text-xs sm:text-sm text-linen-200/70 max-w-md leading-relaxed">
              Huit albums de coloriage imaginés par CaroTine pour offrir des
              moments de calme, de douceur et de créativité aux feutres ou aux
              crayons, expédiés directement par Amazon.
            </p>
          </div>

          {/* Direct Links to All 8 Official Books on Amazon */}
          <div className="lg:col-span-7">
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-linen-200/60 mb-4">
              Accès Direct aux 8 Éditions sur Amazon
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BOOKS.map((book) => (
                <a
                  key={book.id}
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      style={{ backgroundColor: book.accentColor }}
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-serif font-bold text-linen-50 truncate">
                      {book.title}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal & KDP Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-linen-200/55">
          <p className="max-w-2xl leading-relaxed">
            © {new Date().getFullYear()} CaroTine. Tous nos ouvrages sont
            publiés et expédiés via Amazon Kindle Direct Publishing (KDP) avec
            éligibilité Amazon Prime.
          </p>
          <p className="flex items-center gap-1.5 text-linen-200/75">
            <span>Conçu avec</span>
            <Heart className="w-3.5 h-3.5 fill-autumn-saffron text-autumn-saffron" />
            <span>pour notre communauté TikTok (530K+)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
