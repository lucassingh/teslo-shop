import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { signIn, getSession, getProviders } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../components/layouts'
import { useForm, SubmitHandler } from "react-hook-form";
import { validations } from '../../utils';
import { tesloApi } from '../../axiosApi';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context';
import { useRouter } from 'next/router';

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});

    const { loginUser } = useContext(AuthContext)

    const router = useRouter();

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov)
        })
    }, [])

    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError(false);


        //sistema de autenticacion personalizada

        /* const isValidLogin = await loginUser(email, password);

        if(!isValidLogin) {
            setShowError(true)
            setTimeout(() => setShowError(false), 4000);
            return;
        }

        const destination = router.query.p?.toString() || '/'; //permite volver a la pagina desde donde se intento acceder al login con el parametro P= (page)

        router.replace(destination) */

        // con nextAuth

        await signIn('credentials', { email, password })

    } // ya esta enb el contexto

    return (
        <AuthLayout title='Login'>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Login</Typography>
                            <Chip
                                sx={{ mt: 2, padding: '10px 20px', display: showError ? 'flex' : 'none' }}
                                label='Invalid user or password'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
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
                                label='Password'
                                type='password'
                                variant='filled'
                                fullWidth
                                {
                                ...register('password', {
                                    required: 'this field is required',
                                    minLength: { value: 6, message: 'At list 6 characters' }
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
                                Login
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}
                                passHref
                            >
                                <Link sx={{ fontSize: '12px' }}>
                                    Do not have account?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='center' flexDirection='column'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            <p>Or sign in with: </p>
                            {
                                Object.values(providers).map((provider: any) => {

                                    if(provider.id === 'credentials') return (<div key='credentials'></div>)

                                    return (
                                        <Button
                                            key={provider.id}
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{mb:1}}
                                            onClick={() => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    )

                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });

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

export default LoginPage