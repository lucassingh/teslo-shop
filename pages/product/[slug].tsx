import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database';
import { CartContext } from '../../context';

interface Props {
    product: IProduct
}

export const ProductPage: NextPage<Props> = ({ product }) => {

    const router = useRouter();

    const { addProductToCart } = useContext(CartContext)

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    })

    const selectedSize = (size:ISize) => {
        setTempCartProduct(currentProduct => ({
            ...currentProduct,
            size
        }))
    }

    const onUpdateQuantity = (quantity:number) => {
        setTempCartProduct(currentProduct => ({
            ...currentProduct,
            quantity
        }))
    }

    const onAddProduct = ( ) => {

        if(!tempCartProduct.size) { return }

        addProductToCart(tempCartProduct);

        router.push('/cart')
    }

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>
                        {/*  titulos*/}
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='subtitle1' component='h2' fontSize='22px'>{`$${product.price}`}</Typography>
                        <Typography >Available Stock: {product.inStock}</Typography>
                        {/*cantidad*/}
                        <Box sx={{ my: 2 }} >
                            <Typography variant='subtitle2'>Cuantity</Typography>
                            <ItemCounter 
                                currentValue={tempCartProduct.quantity}
                                updatedQuantity={onUpdateQuantity}
                                maxValue={product.inStock > 5 ? 5 : product.inStock}
                            />
                            <SizeSelector 
                                sizes={product.sizes} 
                                selectedSize={tempCartProduct.size}
                                onSelectedSize={selectedSize}
                            />
                        </Box>

                        {
                            (product.inStock > 0)
                                ? (
                                    <Button 
                                        color='secondary' 
                                        className='circular-btn'
                                        onClick={onAddProduct}
                                    >
                                        {
                                            tempCartProduct.size
                                            ? 'Add to cart'
                                            : 'Choose a size'
                                        }
                                    </Button>
                                )
                                : (
                                    <Chip label='No items available' color='error' variant='outlined' />
                                )
                        }
                        
                        <Box sx={{ my: 3 }}>
                            <Typography variant='subtitle2'>Description</Typography>
                            <Typography variant='subtitle2'>{product.description} </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

/* export const getServerSideProps: GetServerSideProps = async ({params}) => {

    const { slug } = params as { slug: string}

    const product = await dbProducts.getProdcutBySlug(slug)

    if(!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    
    return {
        props: {
            product,
        }
    }
} */   // No usar esto SSR usar getStaticspaths y get static props

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const productSlugs = await dbProducts.getAllProductsSlugs();


    return {
        paths: productSlugs.map(({ slug }) => ({
            params: {
                slug
            }
        })),
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug = '' } = params as { slug: string };
    const product = await dbProducts.getProductBySlug(slug);

    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24
    }
}




export default ProductPage;