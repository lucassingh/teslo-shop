import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupAddOutlined, ProductionQuantityLimits } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layouts'
import { SummaryTile } from '../../components/admin'
import useSWR from 'swr'
import { IDashboardData } from '../../interfaces'

const DashboardPage = () => {

    const { data, error } = useSWR<IDashboardData>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000
    })

    const [refreshIn, setRefreshIn] = useState(30)

    useEffect(() => {
        const interval = setInterval(() =>{
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 )
        }, 1000);

        return () => clearInterval(interval) // se limpia el interval para que no se ejecute cuando nos vamos a otra pagina
       
    }, [])

    if (!error && !data) {
        return <></>
    }

    if (error) {
        console.log(error);
        <Typography>Error al cargar la informacion</Typography>
    }

    return (
        <AdminLayout
            title='Dashboard'
            subTitle='General Metrics'
            icon={<DashboardOutlined />}
        >

            <Grid container spacing={2}>
                <SummaryTile
                    icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
                    title={data!.numberOfOrders}
                    subTitle='Ordenes Totales'
                />

                <SummaryTile
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
                    title={data!.paidOrders}
                    subTitle='Ordenes Pagadas'
                />

                <SummaryTile
                    icon={<CreditCardOffOutlined color='warning' sx={{ fontSize: 40 }} />}
                    title={data!.notPaidOrders}
                    subTitle='Ordenes Pendientes'
                />

                <SummaryTile
                    icon={<GroupAddOutlined color='primary' sx={{ fontSize: 40 }} />}
                    title={data!.numberOfClients}
                    subTitle='Clientes'
                />

                <SummaryTile
                    icon={<CategoryOutlined color='primary' sx={{ fontSize: 40 }} />}
                    title={data!.numberOfProducts}
                    subTitle='Productos'
                />

                <SummaryTile
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
                    title={data!.productsWithNoInventory}
                    subTitle='Productos sin stock'
                />

                <SummaryTile
                    icon={<ProductionQuantityLimits color='warning' sx={{ fontSize: 40 }} />}
                    title={data!.lowInventory}
                    subTitle='Bajo inventario'
                />

                <SummaryTile
                    icon={<AccessTimeOutlined color='success' sx={{ fontSize: 40 }} />}
                    title={refreshIn}
                    subTitle='Actulizacion inventario'
                />
            </Grid>

        </AdminLayout>
    )
}

export default DashboardPage