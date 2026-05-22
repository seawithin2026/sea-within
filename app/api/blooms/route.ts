import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { bloomVideoId, stillDataUrl, level } = body as {
      bloomVideoId?: string;
      stillDataUrl?: string | null;
      level?: number;
    };

    if (!bloomVideoId || typeof level !== "number") {
      return NextResponse.json(
        { error: "Missing bloomVideoId or level" },
        { status: 400 }
      );
    }

    // TODO: replace with real DB insert (Supabase, Prisma, etc.)
    // Example shape:
    // const { data, error } = await supabase
    //   .from("blooms")
    //   .insert({
    //     user_id: userIdFromSession,
    //     bloom_video_id: bloomVideoId,
    //     level,
    //     still_frame: stillDataUrl, // base64 or uploaded URL
    //   })
    //   .select()
    //   .single();

    console.log("Saving bloom:", { bloomVideoId, level, hasStill: !!stillDataUrl });

    return NextResponse.json(
      {
        success: true,
        bloom: {
          id: "mock-id-" + bloomVideoId,
          bloomVideoId,
          level,
          stillDataUrl,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal error saving bloom" },
      { status: 500 }
    );
  }
}
