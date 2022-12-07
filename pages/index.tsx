import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { FullScreenLoading } from '../components/ui'
import { useProducts } from '../hooks'

const Home: NextPage = () => {

    const {products, isError, isLoading} =  useProducts('/products')

    return (
       <ShopLayout 
            title={'Teslo shop'}
            pageDescription={'Find Teslo products here!'}
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

export default Home
