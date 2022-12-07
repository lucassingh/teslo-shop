import React, { useEffect, useState } from 'react'
import { PeopleAltOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AdminLayout } from '../../components/layouts'
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

const usersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users')

    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if(data) {
            setUsers(data)
        }        
    }, [data])


    if (!data && !error) {
        return (<></>)
    }

    const onRoleUpdated = async (userId: string, newRole: string) => {

        const previousUser = users.map(user => ({...user}))
        
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }))

        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole })
        } catch (error) {
            setUsers(previousUser);
            console.log(error)
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        {
            field: 'role',
            headerName: 'Role',
            width: 300,
            // @ts-ignore
            renderCell: ({ row }: GridValueGetterParams) => {
                return (
                    <Select
                        value={row.role}
                        label='Role'
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>

                    </Select>
                )
            }
        }
    ]

    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }))

    return (
        <AdminLayout
            title={'Usuarios'}
            subTitle={'Mantenimiento de usuarios'}
            icon={<PeopleAltOutlined />}
        >
            <Grid container sx={{ mt: 2 }} className='fadeIn'>
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

        </AdminLayout>
    )
}

export default usersPage