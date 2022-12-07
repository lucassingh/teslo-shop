import {FC} from 'react'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'

interface Props {
    currentValue: number;
    maxValue: number;
    updatedQuantity: (newValue: number) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {

    const addOrRemove = (value:number) => {
        if(value === -1){
            if(currentValue === 1) return;
            return updatedQuantity(currentValue -1);
        }

        if(currentValue >= maxValue) return;

        updatedQuantity(currentValue + 1)
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <IconButton onClick={ () => addOrRemove(-1)}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{width: 'flex', textAlign: 'center'}}>{currentValue}</Typography>
            <IconButton onClick={ () => addOrRemove(+1)}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
