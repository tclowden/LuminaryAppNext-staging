import { Analytics } from '@vercel/analytics/react';
import WebFooter from "./(partials)/footer"
import WebNavbar from "./(partials)/navbar"
import WebTryIt from "./(partials)/tryIt"
import WebModals from '@/common/components/webModals/modals';

const luminaryDesc = {
   title: 'Luminary Apps',
   description: ''
}

// Take some credit guys!
const authors: Array<string> = [
   'Carlos Amorós',
   'Joshua Mathews',
   'Mark Davenport',
   'Matt Rapp',
   'Matt Pickett',
   'Olvis Quintana',
   'Paul Regar',
   'Roberto Espinoza'
]

export const metadata = {
   title: {
      default: luminaryDesc.title,
      template: '%s | Luminary Apps'
   },
   description: luminaryDesc.title,
   keywords: [],
   applicationName: "Luminary Apps",
   authors: authors.sort().map(author => { return { name: author } }),
   referrer: "origin-when-cross-origin",
   // Open Graph
   openGraph: {
      title: luminaryDesc.title,
      description: luminaryDesc.description,
      url: 'https://luminaryapps.io/',
      siteName: 'Home | Luminary Apps',
      locale: 'en-US',
      type: 'website',
   },
};
export default function WebsiteLayout({ children }: {
   children: React.ReactNode
}) {
   return (
      <>
         <WebNavbar />
         {children}
         <WebTryIt />
         <WebFooter />
         <WebModals />
         <Analytics />
      </>
   )
}