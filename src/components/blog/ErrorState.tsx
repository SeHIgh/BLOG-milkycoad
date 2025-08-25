import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  errorMessage?: string;
  iconColor: 'red' | 'yellow';
}

export default function ErrorState({ title, message, errorMessage, iconColor }: ErrorStateProps) {
  const iconClasses = {
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
  };

  const bgClasses = {
    red: 'bg-red-100 dark:bg-red-900/20',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/20',
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full ${bgClasses[iconColor]} flex items-center justify-center`}
          >
            <svg
              className={`w-8 h-8 ${iconClasses[iconColor]}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className={`text-xl font-semibold mb-3 ${iconClasses[iconColor]}`}>{title}</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">{errorMessage || message}</p>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            블로그로 돌아가기
          </Link>
        </div>
      </div>
    </article>
  );
}
