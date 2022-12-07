
import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CartContext } from '../../context';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export const SummaryPage = () => {

    const router = useRouter()

    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);

    const [isPosting, setIsPosting] = useState(false); 

    const [errorMessage, setErrorMessage] = useState('');    

    useEffect(() => {
        if(!Cookies.get('firstName')) {
            router.push('/checkout/address')
        }

    }, [router])

    const onCreateOrder = async() => {
        setIsPosting(true) // sirve para validar el boton
        const {hasError, message} =  await createOrder()

        if(hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`) //replace te impide regresar cuando haces back en el navegador
    }

    //console.log(shippingAddress);
    
    if (!shippingAddress) {
        return <></>;
    }

    const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

    return (
        <ShopLayout title='Summary' pageDescription='Teslo - summary detail'>
            <Typography variant='h1' component='h1'>Summary</Typography>

            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h6'>Summary ({numberOfItems} {numberOfItems === 1 ? 'product' : 'products'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Address</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always' sx={{ fontSize: 13 }}>
                                        Edit address
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{firstName} {lastName}</Typography>
                            <Typography>{address}{address2 ? `, ${address2}` : ''} </Typography>
                            <Typography>{city}, {zip}</Typography>
                            {/* <Typography>{countries.find(c => c.code === country)?.name}</Typography> */}
                            <Typography>{country}</Typography>
                            <Typography>{phone}</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between' sx={{ mb: 1 }}>
                                <Typography variant='subtitle1'>Detail</Typography>
                                <NextLink href='/cart' passHref>
                                    <Link underline='always' sx={{ fontSize: 13 }}>
                                        Edit products
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button 
                                    color='secondary' 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirm Order
                                </Button>

                                <Chip
                                    color='error'
                                    label={errorMessage}
                                    variant='outlined'
                                    sx={{display: errorMessage ? 'flex': 'none', mt: 2}}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage;