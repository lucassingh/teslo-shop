import type { GetServerSideProps, NextPage } from 'next'
import { Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
    products: IProduct[],
    foundProducts: boolean,
    query: string
}

const SearchPage: NextPage<Props> = ({products, query, foundProducts}) => {

    return (
       <ShopLayout 
            title={'Teslo shop'}
            pageDescription={'Find Teslo products here!'}
        >
            <Typography variant='h1' component='h1'>Search results</Typography>

            {
                foundProducts
                ? <Typography variant='h2' sx={{mb:1}} textTransform='capitalize'>{query}</Typography>
                : <Typography variant='h2' sx={{mb:1}}>No items found with {`"${query} "`} </Typography>
            }            

            <ProductList products={products} />

       </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    
    const { query = '' } = params as { query: string };

    if ( query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    // y no hay productos
    let products = await dbProducts.getProductsByTerm( query ); //validar si no hay ningun product

    const foundProducts = products.length > 0

    // TODO: retornar otros productos
    if ( !foundProducts ) {
        // products = await dbProducts.getAllProducts(); 
        products = await dbProducts.getProductsByTerm('shirt');
    }
    
    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage;

