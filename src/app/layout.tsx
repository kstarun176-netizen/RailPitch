import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"RailPitch — Where the next big idea finds its way",description:"A curated startup and investor rail expedition."};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
