// utils/imageUrl.ts
import pack_01 from '../assets/images/pack_01.svg';

export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return pack_01;
  
  // If it's a full URL to localhost:5000, convert to relative path
  if (url.includes('localhost:5000')) {
    // Extract just the path part
    const match = url.match(/(\/api\/uploads\/[^?]+)/);
    if (match) {
      return match[1]; // Return relative path like /api/uploads/filename.png
    }
  }
  
  // If it's already a relative path
  if (url.startsWith('/')) {
    return url;
  }
  
  // If it's just a filename
  if (!url.includes('/') && !url.includes('http')) {
    return `/api/uploads/${url}`;
  }
  
  return url;
};

export const getImageUrlFromObject = <T extends { imageUrl?: string | null; imageUrls?: string[] | null }>(
  item: T,
  fallback: string = pack_01
): string => {
  if (item.imageUrl) {
    return getImageUrl(item.imageUrl);
  }
  if (item.imageUrls && item.imageUrls.length > 0) {
    return getImageUrl(item.imageUrls[0]);
  }
  return fallback;
};