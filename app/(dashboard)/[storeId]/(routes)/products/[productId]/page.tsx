import prismadb from "@/lib/prismadb";
import BillboardsForm from "./components/products-form";
import ProductsForm from "./components/products-form";

const ProductsPage = async ({
  params,
}: {
  params: { productId: string,storeId: string };
}) => {

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include:{
         images: true
        }
    });
    const categorys = await prismadb.category.findMany({
      where: {
          storeId: params.storeId
      }
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    }
  });

  const colors = await prismadb.color.findMany({
    where:{
      storeId: params.storeId
    }
  })
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductsForm categorys = {categorys} colors={colors} sizes={sizes} initialData={product}/>
        </div>
    </div>
  )
};

export default ProductsPage;
