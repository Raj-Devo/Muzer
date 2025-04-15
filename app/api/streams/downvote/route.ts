import { prismaClient } from "@/app/lib/db";
import { PrismaClient } from "@prisma/client/extension";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId : z.string() , 
})

export async function POST (req : NextResponse) {
    const session = await getServerSession();


    const user = await PrismaClient.user.findFirst({
        where : {
            email : session?.user?.email ?? ""
        }
    })
    if(!user) {
        return NextResponse.json ({
        message : "Unauthenticated user"
        } , {
            status : 403
        })
    }
        try { 
            const data =  UpvoteSchema.parse(await req.json());
            await prismaClient.upvote.delete ({
                where : {
                    userId_streamId : {
                        userId : user.id ,
                        streamId : data.streamId
                    }
                }
            }) ;
            return NextResponse.json({
                message : "Done"
            });
        }
         catch (e) {
            return NextResponse.json ({
                message : "Error while upvoting"
                } , {
                    status : 403
                })
         }
    
}