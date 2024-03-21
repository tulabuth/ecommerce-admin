"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { SizeColumn, columns } from "./columns";



interface SizeClientProps {
    data:SizeColumn[]
}
export const SizeClient: React.FC<SizeClientProps> =({
    data
})=>{
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                title={`Sizes (${data.length})`}
                description="Manage size for your store"/>
                <Button onClick={()=>router.push(`/${params.storeId}/sizes/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey="label" columns={columns} data={data}/>
            <Heading title="API" description="API calls for Sizes"/>
            <ApiList entityName="sizes" entityIdName="sizesId"/>
        </>
    )
}

