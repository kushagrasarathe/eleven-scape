import Link from 'next/link';

export default function Footer() {
  return (
    <div className="mx-auto space-y-1 py-5 text-center text-sm">
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
      </div>
      <div className="mx-auto max-w-lg">
        Developed as a proof-of-concept, showcasing my full-stack developement
        skills and my interest in joining the{' '}
        <span className="font-semibold">ElevenLabs</span> team
      </div>
    </div>
  );
}
