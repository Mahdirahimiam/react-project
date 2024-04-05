import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Box, Stack } from '@mui/material';
import './style.css'
import { Link, Navigate } from 'react-router-dom';
export default function RecipeReviewCard({ isOff = false, image, title, discountPrice, price, discount, is100, id }) {
    const [showIcon, setShowIcon] = React.useState(false);
    return (
        <Box border={'1px #dadada solid'} width={is100 ? '100%' : '20%'} height={is100 ? '100%' : '60vh'} sx={{ overflow: 'hidden', borderRadius: '20px', backgroundColor: '#fff', margin: '5px 0' }}>
            <Link
                to={'/product-details/' + id}
                style={{
                    height: '70%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
                onMouseEnter={() => setShowIcon(true)} onMouseLeave={() => setShowIcon(false)}>
                <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} position={'absolute'} top={0}>
                    <Box visibility={showIcon ? 'visible' : 'hidden'}>
                        <IconButton aria-label="settings">
                            <Avatar sx={{ bgcolor: '#efefef' }} aria-label="recipe">
                                <FavoriteBorderIcon style={{ color: 'red' }} />
                            </Avatar>
                        </IconButton>
                    </Box>
                    <Box visibility={isOff ? 'visible' : 'hidden'}>
                        <Avatar sx={{ bgcolor: '#dc3545', height: '1.3vw', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px' }} aria-label="recipe">
                            <Typography>حراج</Typography>
                        </Avatar>
                    </Box>
                </Box>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={process.env.REACT_APP_BASE_URL + image} alt="product image" />
            </Link>
            <Link
                to={'/product-details/' + id}
                style={{ display: 'flex', overflow: 'hidden', height: '30%', width: '100%', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center', gap: '0.5vw', padding: '1vw' }}>
                <Typography height={'40%'}>{title}</Typography>
                <Box height={'1px'} width={'90%'} sx={{ backgroundColor: 'var(--tr)' }}></Box>
                <Stack height={'40%'} direction={'column'} alignItems={'center'} justifyContent={'center'}>
                    <Box display={isOff ? 'block' : 'none'}>
                        <span style={{ fontSize: '14px', color: '#fff', backgroundColor: 'red', textDecoration: 'line-through !important', borderRadius: '5px', padding: '0 3px' }}>{discount}%</span>
                        <span className='discount' style={{ padding: '0 15px', fontSize: '13px', color: 'var(--fontColor)' }}>{discountPrice}</span>
                    </Box>
                    <Typography>
                        {price} تومان
                    </Typography>
                </Stack>
            </Link>
        </Box>
    );
}