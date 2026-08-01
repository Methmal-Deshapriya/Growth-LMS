import type { ImageLoader } from "next/image";

/**
 * Project thumbnails are user-supplied external URLs. They bypass the Next.js
 * optimizer until the LMS owns an allowlisted image-storage domain.
 */
export const projectImageLoader: ImageLoader = ({ src }) => src;
