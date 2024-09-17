'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFetchUserGeneratedVoices } from '@/lib/api/hooks/useFetchUserGeneratedVoices';
import { formatDateToVerboseString } from '@/lib/utils';
import { useAppStore } from '@/redux/hooks';
import Link from 'next/link';

export default function ListUserGeneratedVoices() {
  const { userVoiceHistory } = useAppStore();

  const { data, isLoading, isFetching, isError } =
    useFetchUserGeneratedVoices();

  if (isFetching || isLoading) {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-10 bg-gray-200" />
              </TableHead>
              <TableHead className="max-w-md">
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24 bg-gray-200" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="ml-auto h-4 w-12 bg-gray-200" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, idx) => (
              <TableRow key={idx} className="">
                <TableCell className="w-2/5 py-5">
                  <Skeleton className="h-4 rounded-md bg-gray-200" />
                </TableCell>
                <TableCell className="w-1/5 py-5">
                  <Skeleton className="h-4 rounded-md bg-gray-200" />
                </TableCell>
                <TableCell className="w-1/5 py-5">
                  <Skeleton className="h-4 rounded-md bg-gray-200" />
                </TableCell>
                <TableCell className="w-1/5 py-5">
                  <Skeleton className="h-4 rounded-md bg-gray-200" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xl font-semibold">History</div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead className="max-w-md">Text</TableHead>
              <TableHead>Voice Name</TableHead>

              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userVoiceHistory.map((voice, idx) => (
              <TableRow key={idx} className="">
                <TableCell>{idx + 1}</TableCell>

                <TableCell className="font-normal">
                  <Link
                    href={`/history/${voice.history_item_id}`}
                    className="line-clamp-1 max-w-md"
                  >
                    {voice.text}
                  </Link>
                </TableCell>
                <TableCell>{voice.voice_name}</TableCell>
                <TableCell className="text-right">
                  {voice.date_unix
                    ? formatDateToVerboseString(
                        new Date(voice.date_unix * 1000)
                      )
                    : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
