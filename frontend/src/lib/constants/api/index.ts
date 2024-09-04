const apiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY as string;

export const elevenlabsRequestHeaders = {
  'xi-api-key': apiKey,
  'Content-Type': 'application/json',
};
