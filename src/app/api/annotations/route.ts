import { db } from '@/lib/db';
import { annotations, TAnnotation } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.audio_version_id ||
      body.annotationTimeframe === undefined ||
      !body.text
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const annotationData: TAnnotation = {
      id: uuidv4(),
      audio_version_id: String(body.audio_version_id),
      annotationTimeframe: body.annotationTimeframe,
      text: body.text,
    };

    const result = await db
      .insert(annotations)
      .values(annotationData)
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Detailed error inserting annotation:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: 'Failed to insert annotation',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const audioVersionId = searchParams.get('audioVersionId');

    if (!audioVersionId) {
      return NextResponse.json(
        { error: 'audioVersionId is required' },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(annotations)
      .where(eq(annotations.audio_version_id, audioVersionId));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch annotations', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const audioVersionId = searchParams.get('audioVersionId');
    const annotationId = searchParams.get('annotationId');

    if (!audioVersionId || !annotationId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const decodedAudioVersionId = decodeURIComponent(audioVersionId);
    const decodedAnnotationId = decodeURIComponent(annotationId);

    const existingAnnotation = await db
      .select()
      .from(annotations)
      .where(
        and(
          eq(annotations.audio_version_id, decodedAudioVersionId),
          eq(annotations.id, decodedAnnotationId)
        )
      )
      .limit(1);

    if (existingAnnotation.length === 0) {
      return NextResponse.json(
        { error: 'Annotation not found' },
        { status: 404 }
      );
    }

    const result = await db
      .delete(annotations)
      .where(
        and(
          eq(annotations.audio_version_id, decodedAudioVersionId),
          eq(annotations.id, decodedAnnotationId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to delete annotation' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Annotation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE route:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: 'Failed to delete annotation',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
