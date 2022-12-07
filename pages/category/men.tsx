import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks'

const MenPage: NextPage = () => {

    const {products, isError, isLoading} =  useProducts('/products?gender=men')

    return (
       <ShopLayout 
            title={'Men Products'}
            pageDescription={'Find Teslo products for men here!'}
        >
            <Typography variant='h1' component='h1'>Men</Typography>´
            <Typography variant='h2' sx={{mb:1}}>Products for men</Typography>

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }

       </ShopLayout>
    )
}

export default MenPage
