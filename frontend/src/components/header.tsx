import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

export default function Header() {
  return (
    <div className="py-5 flex items-center justify-between">
      <Link href={'/'}>
        <Image
          src="/logo.svg"
          alt="Vercel Logo"
          className="dark:invert"
          width={160}
          height={160}
          priority
        />
      </Link>
      <Link
        href={'/dashboard'}
        className={cn(buttonVariants({ variant: 'default' }))}
      >
        Dashboard
      </Link>
    </div>
  );
}
