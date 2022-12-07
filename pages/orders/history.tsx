import { Chip, Grid, Typography, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts'
import NextLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width:100},
    {field: 'fullName', headerName: 'Name', width:300},
    {
        field:'paid',
        headerName: 'Pagada',
        description: 'Show if this order was paid',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No Pagada' variant='outlined' />
            )
        }
    },
    {
        field:'order',
        headerName: 'Ver Orden',
        description: 'Redirect to order',
        width: 200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline='always'>
                        Show Order
                    </Link>
                </NextLink>
            )
        }
    }
]

interface Props {
    orders: IOrder[]
}

const HistoryPage:NextPage<Props> = ({orders}) => {

    const rows = orders.map((order, idx)=> ({
        id: idx + 1,
        paid: order.isPaid,
        fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id 
    }))

    return (
        <ShopLayout title='Buy client history ' pageDescription=''>
            <Typography variant='h1' component='h1'>Orders history </Typography>

            <Grid container sx={{mt:2}} className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        autoHeight
                    />

                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
    const session: any = await getSession({req})

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id)    
    
    return {
        props: {
            orders,
        }
    }
}


export default HistoryPage