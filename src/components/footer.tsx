import Link from 'next/link';

export default function Footer() {
  return (
    <div className="mx-auto space-y-1 pb-5 pt-10 text-center text-sm">
      <div className="flex items-center justify-center">
        <div>Built by&nbsp;</div>
        <Link
          href={'https://x.com/kushagrasarathe'}
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          @kushagrasarathe
        </Link>
        <div>&nbsp;👨🏻‍💻</div>
      </div>
    </div>
  );
}
