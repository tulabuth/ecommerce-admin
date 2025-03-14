"use client";

import { Billboard, Category, Color, Image, Product, Size, Store } from "@prisma/client";
import { Trash } from "lucide-react";
import  * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/api-alert";
import { useOrgin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface ProductsFormProps {
  initialData: Product & 
  {
    images: Image[]
  }
  | null;
  categorys: Category[];
  colors: Color[];
  sizes: Size[];
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductsFormValues = z.infer<typeof formSchema>;


const ProductsForm: React.FC<ProductsFormProps> = ({ initialData,categorys,colors, sizes }) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrgin();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const title = initialData ? "Edit Prodcuts" : "Create Products";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created";
    const action = initialData ? "Save changes" : "Create";


    const form = useForm<ProductsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false
        }
    });

    const onSubmit = async (data: ProductsFormValues) =>{
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
            }else{
                await axios.post(`/api/${params.storeId}/products`,data);
            }
            router.push(`/${params.storeId}/products`);
            router.refresh();
            toast.success(toastMessage);
        } catch (e) {
            toast.error("Something went wrong.");
        }finally{
            setLoading(false);
        }
    }

    const onDelete = async()=>{
        try {
            setLoading(true);
            console.log(params.storeId);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.push(`/${params.storeId}/products`);
            router.refresh();
            toast.success("Products deleted.");
        } catch (error) {
            toast.error("Make sure you removed all products using this product first.");
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }

  return (
    <>
    <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} loading={loading}/>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
       {initialData && (
         <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
         <Trash className="h-4 w-4" />
       </Button>
       )}
      </div>
     
      <Separator/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField control={form.control} name="images" render={({field}) =>(
                    <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                           <ImageUpload  value={field.value.map((image)=>image.url)}
                           disabled={loading}
                           onChange={(url)=>field.onChange([...field.value,{url}])}
                           onRemove={(url)=>field.onChange([...field.value.filter((current)=>current.url !== url)])}
                           />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>

            <div className="grid grid-cols-3 gap-8">
                <FormField control={form.control} name="name" render={({field}) =>(
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Product name" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>
                <FormField control={form.control} name="price" render={({field}) =>(
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>

                <FormField control={form.control} name="categoryId" render={({field}) =>(
                    <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue  defaultValue={field.value} placeholder="Select a category"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categorys.map((category)=>(
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>

                <FormField control={form.control} name="sizeId" render={({field}) =>(
                    <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue  defaultValue={field.value} placeholder="Select a size"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {sizes.map((size)=>(
                                    <SelectItem key={size.id} value={size.id}>
                                        {size.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>

                <FormField control={form.control} name="colorId" render={({field}) =>(
                    <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue  defaultValue={field.value} placeholder="Select a Color"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {colors.map((color)=>(
                                    <SelectItem key={color.id} value={color.id}>
                                        {color.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>
               
                <FormField control={form.control} name="isFeatured" render={({field}) =>(
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormLabel>Featured</FormLabel>
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                                Featured
                            </FormLabel>
                            <FormDescription>
                                This product will appear on the home page
                            </FormDescription>
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>

                <FormField control={form.control} name="isArchived" render={({field}) =>(
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormLabel>Archived</FormLabel>
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                                Archived
                            </FormLabel>
                            <FormDescription>
                                This product will appear anywhere in the store.
                            </FormDescription>
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}>
                </FormField>

            </div>
            <Button disabled={loading} className="ml-auto" type="submit">
                {action}
            </Button>
        </form>
      </Form>
      <Separator/>
      
    </>
  );
};

export default ProductsForm;
