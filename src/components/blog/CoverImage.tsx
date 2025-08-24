'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface CoverImageProps {
  src: string;
  alt: string;
}

export default function CoverImage({ src, alt }: CoverImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className='relative w-full h-48 max-h-96 overflow-hidden mb-8 rounded-xl bg-muted flex items-center justify-center'>
        <div className='text-center text-muted-foreground'>
          <svg
            className='w-12 h-12 mx-auto mb-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
          <p className='text-sm'>이미지를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative w-full h-48 max-h-96 overflow-hidden mb-8 rounded-xl'>
      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className='absolute inset-0 z-10'>
          <Skeleton className='w-full h-full' />
        </div>
      )}

      {/* 실제 이미지 */}
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={600}
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={true}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
