import NextLink from 'next/link';
import { Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CartList, OrderSummary } from '../../../components/cart';
import { AdminLayout, ShopLayout } from '../../../components/layouts';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
    order: IOrder
}

export const OrderPage: NextPage<Props> = ({ order }) => {


    const { shippingAddress } = order;

    return (
        <AdminLayout
            title='Resumen de la orden'
            subTitle={`OrdenId: ${order._id}`}
            icon={<AirplaneTicketOutlined />}
        >
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
                                            <Chip
                                                sx={{ my: 2 }}
                                                variant='outlined'
                                                label='Pendiente de pago'
                                                color='error'
                                                icon={<CreditCardOffOutlined />}
                                            />
                                        )
                                }

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = ' ' } = query;

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
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