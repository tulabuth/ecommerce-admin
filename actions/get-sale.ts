import prismadb from "@/lib/prismadb"

export const getSales = async (storeId: string)=>{
    const salesCount = await prismadb.order.count({
        where: {
            storeId,
            isPaid: false,
        }
    })

    
    
    return salesCount;
}