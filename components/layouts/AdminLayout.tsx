import { FC, PropsWithChildren } from "react";
import { Sidemenu } from "../ui";
import { AdminNavbar } from "../admin";
import { Box, Typography } from "@mui/material";

interface Props {
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: FC<PropsWithChildren<Props>> = ({children, title, subTitle, icon}) => {
    return (
        <>
            <nav>
                <AdminNavbar />
            </nav>

            <Sidemenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1140px',
                padding: '0px 30px'

            }}>
                <Box display='flex' flexDirection='column'>
                    <Typography variant='h2' component='h2'>
                        {icon}
                        {title}
                    </Typography>
                    <Typography variant='h4' component='h4' sx={{mb:1, mt:2}}>
                        {subTitle}
                    </Typography>
                </Box>
                <Box className='fadeIn'>

                </Box>
                {children}
            </main>
        </>
    )
}
