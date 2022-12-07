import NextLink from 'next/link';
import { Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { tesloApi } from '../../api';
import { useRouter } from 'next/router';

interface Props {
    order: IOrder
}

export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
};

export const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter()

    const { shippingAddress } = order;

    const onOrderCompleted = async(details:OrderResponseBody) => {

        if(details.status !== 'COMPLETED') {
            return alert('No hay pago en Paypal')
        }

        try {

            const { data } = await tesloApi.post(`orders/pays`, {
                transactionId: details.id,
                orderId: order._id
            })

            router.reload();
            
        } catch (error) {
            alert(error)
        }
    }

    return (
        <ShopLayout title='Summary Order 6546546465' pageDescription='Teslo - summary order'>

            <Box display='flex' flexDirection='row' alignItems='center'>
                <Typography variant='h2' component='h2' sx={{ fontWeight: 'bold' }}>Order: </Typography>
                <Typography component='p' sx={{ ml: 1 }}> {order._id} </Typography>
            </Box>

            {
                order.isPaid
                    ? (
                        <Chip
                            sx={{ my: 2 }}
                            variant='outlined'
                            label='Pagada'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    ) :
                    (
                        <Chip
                            sx={{ my: 2 }}
                            variant='outlined'
                            label='Pendiente de pago'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }

            <Grid container sx={{ mt: 3 }}>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h6'>Summary: {order.numberOfItems} - {order.numberOfItems > 1 ? 'products' : 'product'}   </Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Address</Typography>
                            </Box>

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName} </Typography>
                            <Typography>{shippingAddress.address} </Typography>
                            <Typography>{shippingAddress.address2} </Typography>
                            <Typography>{shippingAddress.country} </Typography>
                            <Typography>{shippingAddress.city} </Typography>
                            <Typography>{shippingAddress.phone} </Typography>
                            <Typography>{shippingAddress.zip} </Typography>
                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{
                                    numberOfItems: order.numberOfItems,
                                    subTotal: order.subTotal,
                                    total: order.total,
                                    tax: order.tax
                                }}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                {
                                    order.isPaid
                                        ? (
                                            <Chip
                                                sx={{ my: 2 }}
                                                variant='outlined'
                                                label='Pagada'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        )
                                        : (
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted(details);
                                                        /* console.log({details})
                                                        const name = details.payer.name.given_name;
                                                        alert(`Transaction completed by lucas`); */
                                                    });
                                                }}
                                            />
                                        )
                                }

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = ' ' } = query;

    const session: any = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}


export default OrderPage;