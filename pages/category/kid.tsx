import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'

const KidPage: NextPage = () => {

    const {products, isError, isLoading} =  useProducts('/products?gender=kid')

    return (
       <ShopLayout 
            title={'Kids Products'}
            pageDescription={'Find Teslo products for kids here!'}
        >
            <Typography variant='h1' component='h1'>Kids</Typography>´
            <Typography variant='h2' sx={{mb:1}}>Kid Products</Typography>

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }

       </ShopLayout>
    )
}

export default KidPage
