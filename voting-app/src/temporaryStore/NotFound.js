import { styled } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled('div')({
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(50%, -50%)',
    minWidth: '30vw',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const NotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate(-1);
        }, 3000);
    }, []);

    return <Wrapper>Not Found</Wrapper>;
};

export default NotFound;
