import { Alert, Box, Button, Snackbar, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const GDrive = () => {
    const [searchParams] = useSearchParams();

    const tempAccessToken = localStorage.getItem('gdrive_accessToken') || '';
    const tempAuthCode = searchParams.get('code') || '';
    const tempClientId = localStorage.getItem('gdrive_clientId') || '';
    const tempClientSecret = localStorage.getItem('gdrive_clientSecret') || '';
    const tempRefreshToken = localStorage.getItem('gdrive_refreshToken') || '';

    const [accessToken, setAccessToken] = React.useState(tempAccessToken);
    const [authCode] = React.useState(tempAuthCode);
    const [clientId, setClientId] = React.useState(tempClientId);
    const [clientSecret, setClientSecret] = React.useState(tempClientSecret);
    const [refreshToken, setRefreshToken] = React.useState(tempRefreshToken);
    const [openSnackBar, setOpenSnackBar] = React.useState(
        !!new URLSearchParams(window.location.search).get('gdrive_accessToken'),
    );

    useEffect(() => {
        handleTokenFromQueryParams();
        window.history.pushState({}, document.title, '/gdrive');
    }, []);

    const handleTokenFromQueryParams = () => {
        if (authCode) {
            tradeAuthCode();
        }
    };

    const objToFormEncoded = (object: object) => {
        return Object.entries(object)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    };

    const tradeAuthCode = async () => {
        const body = {
            grant_type: 'authorization_code',
            redirect_uri: `${window.location.origin}/gdrive`,
            code: authCode,
        };
        await requestTokens(body);
    };

    const requestTokens = async (body: any) => {
        const response = await fetch('https://accounts.google.com/o/oauth2/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: objToFormEncoded(body),
        });
        if (!response.ok) {
            const responseText = await response.text();
            console.error(responseText);
        }
        try {
            const { access_token, refresh_token } = await response.json();
            handleChangeAccessToken({ target: { value: access_token } });
            handleChangeRefreshToken({ target: { value: refresh_token } });
        } catch (err) {
            const responseText = await response.text();
            console.error(responseText);
        }
    };

    const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const handleChangeClientId = (event: any) => {
        setClientId(event.target.value);
        localStorage.setItem('gdrive_clientId', event.target.value);
    };

    const handleChangeClientSecret = (event: any) => {
        setClientSecret(event.target.value);
        localStorage.setItem('gdrive_clientSecret', event.target.value);
    };

    const handleChangeAccessToken = (event: any) => {
        setAccessToken(event.target.value);
        localStorage.setItem('gdrive_accessToken', event.target.value);
    };

    const handleChangeRefreshToken = (event: any) => {
        setRefreshToken(event.target.value);
        localStorage.setItem('gdrive_refreshToken', event.target.value);
    };

    const textFieldStyles = {
        marginBottom: '20px',
    };

    return (
        <div>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={2000}
                onClose={handleCloseSnackBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackBar} severity='success' sx={{ width: '100%' }}>
                    All Tokens Generated Successfully!
                </Alert>
            </Snackbar>
            <Link
                style={{ textDecoration: 'none', width: '100%', color: '#ffffff' }}
                to='/gdrive/tokens'
            >
                <Button variant='contained' sx={{ marginBottom: '20px' }}>
                    Auto Generate Google Drive Tokens
                </Button>
            </Link>
            <Box>
                <TextField
                    sx={textFieldStyles}
                    fullWidth
                    label='Client ID'
                    value={clientId}
                    onChange={handleChangeClientId}
                />
                <TextField
                    sx={textFieldStyles}
                    fullWidth
                    label='Client Secret'
                    value={clientSecret}
                    onChange={handleChangeClientSecret}
                />
                <TextField
                    sx={textFieldStyles}
                    fullWidth
                    label='Access Token'
                    value={accessToken}
                    onChange={handleChangeAccessToken}
                />
                <TextField
                    sx={textFieldStyles}
                    fullWidth
                    label='Refresh token'
                    value={refreshToken}
                    onChange={handleChangeRefreshToken}
                />
            </Box>
        </div>
    );
};
export default GDrive;