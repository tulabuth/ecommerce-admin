import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name, value} = body;
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        
        if(!name){
            return new NextResponse("Name is required",{status: 400});
        }

        if(!value){
            return new NextResponse("Value is required",{status: 400});
        }

        if(!params.storeId){
            return new NextResponse("Store id is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }

        const size = await prismadb.size.create({
            data:{
                 name,
                 value,
                 storeId:params.storeId  
            }
        });

        return  NextResponse.json(size);
    
    } catch (e) {
        console.log('[BILLBOARDS_POST]',e);
        return new NextResponse("Internal error",{status: 500});
    }
}

export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
){
    try {
      
        if(!params.storeId){
            return new NextResponse("Store id is required", {status: 400});
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId,
            }
        })
        return  NextResponse.json(sizes);
    
    } catch (e) {
        console.log('[SIZES_GET]',e);
        return new NextResponse("Internal error",{status: 500});
    }
}