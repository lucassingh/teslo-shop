import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { AuthContext } from '../../context';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form';
import { tesloApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

type FormData = {
    name: string;
    email: string,
    password: string,
};

const RegisterPage = () => {

    const router = useRouter();

    const {registerUser} = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [errorMessage, setErrorMessage] = useState('')

    const [showError, setShowError] = useState(false)

    const onRegisterUser = async({name, email, password}: FormData) => {

        setShowError(false)

        const { hasError, message } = await registerUser(name, email, password);

        if (hasError) {
            setShowError(true)
            setErrorMessage(message || '')
            setTimeout(() => setShowError(false), 4000);
            return
        }

        /* const destination = router.query.p?.toString() || '/'; //permite volver a la pagina desde donde se intento acceder al login con el parametro P= (page)

        router.replace(destination) */

        await signIn('credentials', { email, password })
    }

    return (
        <AuthLayout title='Register'>
            <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
                <Box sx={{width: 350, padding: '10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Register</Typography>
                            <Chip
                                sx={{ mt: 2, padding: '10px 20px', display: showError ? 'flex': 'none' }}
                                label='Invalid user register'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='text'
                                label='Name' 
                                variant='filled' 
                                fullWidth
                                {
                                    ...register('name', {
                                        required: 'this field is required',
                                        minLength: {value: 2, message: 'At list 2 characters'}
                                    })
                                }
                                error={!!errors.name}
                                helperText={errors.name?.message}                                
                            /> 
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label='Email' 
                                variant='filled' 
                                fullWidth
                                {
                                    ...register('email', {
                                        required: 'this field is required',
                                        validate: validations.isEmail

                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            /> 
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='password'
                                label='Password'
                                variant='filled' 
                                fullWidth
                                {
                                    ...register('password', {
                                        required: 'this field is required',
                                        minLength: {value: 6, message: 'At list 6 characters'}
                                    })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            /> 
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                            >
                                Create Account
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink 
                                href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
                                passHref
                            >
                                <Link sx={{fontSize:'12px'}}>
                                    Sign In
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });
    // console.log({session});

    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toLocaleString(),
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage