import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dust To Shine | Facility Management Services Chennai",
  description: "Professional deep cleaning, carpet shampoo, pest control, floor polishing, manpower and complete facility management in Chennai. One-time and AMC plans available.",
  keywords: ["facility management Chennai", "deep cleaning Chennai", "carpet cleaning Chennai", "pest control Chennai", "AMC cleaning services"],
  openGraph: { title: "Dust To Shine | Facility Management Services Chennai", description: "Professional cleaning, polishing, pest control, manpower and complete facility-management solutions for homes and businesses.", type: "website" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
const business={"@context":"https://schema.org","@type":"LocalBusiness",name:"Dust To Shine Facility Management Services",description:"Professional residential and commercial cleaning, pest control, polishing, manpower and facility management in Chennai.",telephone:"+91 90031 77051",email:"dusttoshinefacility@gmail.com",address:{"@type":"PostalAddress",streetAddress:"29/10, Bharathidasan Street, Kumaran Colony 2nd Street, Saidapet",addressLocality:"Chennai",postalCode:"600015",addressCountry:"IN"},areaServed:"Chennai",hasOfferCatalog:{"@type":"OfferCatalog",name:"Facility management services",itemListElement:["Carpet shampooing","House deep cleaning","Office and commercial cleaning","Pest control","Marble polishing","Mosaic polishing","Cleaning equipment and raw materials","Manpower supply","Complete facility management"].map(name=>({"@type":"Offer",itemOffered:{"@type":"Service",name}}))}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(business)}}/></body></html>}
