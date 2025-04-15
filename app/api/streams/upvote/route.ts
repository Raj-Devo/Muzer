import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating the request body
const UpvoteSchema = z.object({
    streamId: z.string(),
});

// POST endpoint to handle upvotes
export async function POST(req: NextRequest) {
    const session = await getServerSession();

    // Fetch the user based on the session email
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    // If the user is not authenticated, return a 403 error
    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated user"
        }, {
            status: 403
        });
    }

    try {
        // Parse and validate the request body
        const data = UpvoteSchema.parse(await req.json());

        // Check if the user has already upvoted the stream
        const existingUpvote = await prismaClient.upvote.findFirst({
            where: {
                userId: user.id,
                streamId: data.streamId
            }
        });

        // If the user has already upvoted, return a 400 error
        if (existingUpvote) {
            return NextResponse.json({
                message: "You have already upvoted this stream"
            }, {
                status: 400
            });
        }

        // Create a new upvote record
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId,
            }
        });

        // Increment the upvote count in the stream record
        await prismaClient.stream.update({
            where: {
                id: data.streamId
            },
            data: {
                upvote: {
                    increment: 1
                }
            }
        });

        // Return success response
        return NextResponse.json({
            message: "Upvoted successfully"
        });

    } catch (e) {
        console.error("Error while upvoting:", e);
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 500
        });
    }
}

// GET endpoint to fetch streams by creatorId
export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    // Fetch streams created by the specified creatorId
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        },
        include: {
            user: true, // Include the user details in the response
            upvotes: true // Include the upvotes details in the response
        }
    });

    // Return the streams in the response
    return NextResponse.json({
        streams
    });
}