import NextLink from 'next/link'
import { Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ShopLayout } from '../../components/layouts'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'

export const EmptyPage = () => {
    return (
        <ShopLayout title='Empty Cart' pageDescription='Your Cart is empty'>
            <Box 
                display='flex' 
                style={{
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: 'calc(100vh - 200px)'
                }}
                sx={{flexDirection: {xs:'column', sm: 'row'}}}
            >

                <RemoveShoppingCartOutlined sx= {{fontSize:100}} />
                <Box
                    display='flex' 
                    style={{
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Typography marginLeft={2}>Your cart is empty</Typography>
                    <NextLink href='/' passHref>
                        <Link typography='h6' color='secondary'>
                            Go back
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage;