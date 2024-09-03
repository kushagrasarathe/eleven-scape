import { NextRequest, NextResponse } from 'next/server';
import { TVoices } from '@/types/server';
import axios from 'axios';

const apiKey = process.env.ELEVEN_LABS_API_KEY as string;

export async function GET(req: NextRequest) {
  try {
    const { data } = await axios.get<TVoices>(
      'https://api.elevenlabs.io/v1/shared-voices',
      {
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error: ', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unexpected error: ', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
