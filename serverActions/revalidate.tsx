'use server'
import { revalidateTag, revalidatePath } from 'next/cache'

/**
 * This function will revalidate any nextjs path in the app router.
 * It will also revalidate any array of tags that. These tags correspond to tags added to fetch requests
 * @param tags Array of fetch cache tags to revalidate
 * @param path Revalidate all fetch requests of path
 */
export async function revalidate({ tags, path }: { tags?: string[], path?: string }) {

   if (tags) {
      tags?.length > 0 && tags.forEach((tag: string) => {
         console.log('revalidating:', tag);
         revalidateTag(tag);
      });
   }

   if (path) {
      const url = process.env.NEXT_PUBLIC_LUMINARY_URL
      if (url && path.includes(url)) {
         revalidatePath(path)
      } else {
         path.startsWith('/') && path.replace('/', '')
         console.log("path", path)
         revalidatePath(`${url}/${path} `)
      }
   }
}
