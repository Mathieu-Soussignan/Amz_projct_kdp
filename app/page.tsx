import ShowcaseExperience from "@/components/ShowcaseExperience";
import { BOOKS } from "@/data/books";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Collection Officielle de Livres de Coloriage — CaroTine",
    itemListElement: BOOKS.map((book, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Book",
        name: book.title,
        description: book.subtitle,
        author: [{ "@type": "Organization", name: "CaroTine" }],
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: book.amazonUrl,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShowcaseExperience />
    </>
  );
}
