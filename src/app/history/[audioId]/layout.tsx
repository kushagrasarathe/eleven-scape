'use client';

import AudioHistoryWrapper from './audio-history-wrapper';

interface Props {
  children: React.ReactNode;
}

export default function AudioHistoryLayout({ children }: Props) {
  return <AudioHistoryWrapper>{children}</AudioHistoryWrapper>;
}
