import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/system';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import DCard from './DCard';
import DPersonCard from './DPersonCard';

const DSwiper = styled(Swiper)(() => ({
    padding: '20px',
    '--swiper-navigation-size': '10px',
    '& .swiper-button-prev': {
        top: '0px',
    },
    '& .swiper-button-next': {
        top: '0px',
    },
}));

const DSlider = ({ title, itemData, variant }: any) => {
    const navigationPrevRef = React.useRef(null);
    const navigationNextRef = React.useRef(null);
    return (
        <React.Fragment>
            {itemData && Object.keys(itemData).length !== 0 ? (
                <div style={{ padding: '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                            sx={{
                                padding: '0px 20px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            variant='h5'
                        >
                            {title || null}
                        </Typography>
                        <Box>
                            <IconButton ref={navigationPrevRef} sx={{ marginRight: '10px' }}>
                                <i className='ri-arrow-left-s-line'></i>
                            </IconButton>
                            <IconButton ref={navigationNextRef}>
                                <i className='ri-arrow-right-s-line'></i>
                            </IconButton>
                        </Box>
                    </Box>
                    <DSwiper
                        grabCursor={true}
                        watchSlidesProgress={true}
                        navigation={{
                            prevEl: navigationPrevRef.current,
                            nextEl: navigationNextRef.current,
                        }}
                        onBeforeInit={(swiper: any) => {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }}
                        breakpoints={{
                            '240': {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            '385': {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            '570': {
                                slidesPerView: 4,
                                spaceBetween: 10,
                            },
                            '760': {
                                slidesPerView: 5,
                                spaceBetween: 10,
                            },
                            '940': {
                                slidesPerView: 6,
                                spaceBetween: 20,
                            },
                            '1194': {
                                slidesPerView: 7,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {itemData.map((item: any) => (
                            <SwiperSlide key={item.id}>
                                {variant === 'item' ? <DCard item={item} /> : null}
                                {variant === 'person' ? <DPersonCard item={item} /> : null}
                            </SwiperSlide>
                        ))}
                    </DSwiper>
                </div>
            ) : null}
        </React.Fragment>
    );
};

export default DSlider;
