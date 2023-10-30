import React, {CSSProperties} from 'react';
import {CircularProgress} from '@chakra-ui/react';
interface CustomButtonProps {
    isTransparent?: boolean
    onClick: (event: React.MouseEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    buttonLabel: string;
    height: string;
    width: string;
    transform?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       isTransparent = false,
                                                       onClick,
                                                       disabled = false,
                                                       loading = false,
                                                       buttonLabel,
                                                       height,
                                                       width,
                                                       transform,
                                                   }) => {
    const similarButtonStyles: CSSProperties = {
        borderRadius: '78px',
        border: isTransparent ? "1px solid rgba(255, 255, 255, 0.5)" : 'none',
        width: width,
        height: height,
        padding: '1rem 1.5rem',
        background: isTransparent ? 'transparent' : disabled ? 'gray' : '#6ACA70',
        color: 'white',
        fontWeight: 'bold',
        transform: transform,
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: '0.2s all',
        opacity: disabled ? 0.8 : 1,
        alignSelf: 'center',
        textTransform: 'capitalize',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',



    };
    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        onClick(event);
    }

    return (
        <button
            style={similarButtonStyles}
            onClick={handleClick}
            disabled={disabled}
        >
            {loading ? (
                <CircularProgress isIndeterminate size="24px" color="white"/>
            ) : (
                buttonLabel
            )}
        </button>
    );
};

export default CustomButton;
