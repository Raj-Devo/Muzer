import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
  upvote: z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    console.log("Parsed data:", data);

    // ✅ Check if creatorId exists in User table
    const userExists = await prismaClient.user.findUnique({
      where: { id: data.creatorId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "Invalid creator ID. User does not exist." },
        { status: 400 }
      );
    }

    if (!data.url.match(YT_REGEX)) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const extractedId = data.url.match(YT_REGEX)?.[1];
    if (!extractedId) {
      return NextResponse.json(
        { message: "Failed to extract YouTube video ID" },
        { status: 400 }
      );
    }

    const res = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log("YouTube API Response:", res);

    const thumbnails = res.thumbnail.thumbnails || [];
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        upvote: data.upvote || 0,
        title: res.title ?? "Title not found",
        smallImg:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2]?.url
            : thumbnails[thumbnails.length - 1]?.url ?? "/placeholder.svg",
        bigImg:
          thumbnails[thumbnails.length - 1]?.url ?? "/placeholder.svg",
      },
    });

    return NextResponse.json({
            ...stream ,
            hasUpvoted : false ,
            upvotes : 0
    });
  } catch (error: any) {
    console.error("Error while adding stream:", error);
    return NextResponse.json(
      { message: `Error while adding stream: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    console.log("Fetching streams for creatorId:", creatorId);
  
    const streams = await prismaClient.stream.findMany({
      where: { userId: creatorId ?? "" },
    });
  
    console.log("Fetched streams:", streams); // ✅ Log fetched streams
  
    return NextResponse.json({ streams });
  }
  
