import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'

const WomenPage: NextPage = () => {

    const {products, isError, isLoading} =  useProducts('/products?gender=women')

    return (
       <ShopLayout 
            title={'Women Products'}
            pageDescription={'Find Teslo products for women here!'}
        >
            <Typography variant='h1' component='h1'>Shop</Typography>´
            <Typography variant='h2' sx={{mb:1}}>All products</Typography>

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }

       </ShopLayout>
    )
}

export default WomenPage
