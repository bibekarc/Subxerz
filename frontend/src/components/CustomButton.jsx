import { Button } from '@chakra-ui/react';

const CustomButton = ({ onClick, title, isLoading, following, mt }) => {
  return (
    <Button
      onClick={onClick}
      isLoading={isLoading}
      sx={{
        display: 'inline-block',
        color: following ? 'black' : 'white',
        backgroundColor: following ? 'white' : '#0cf',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        transition: 'all 0.3s',
        mt: mt, // margin-top from props

        // Pseudo-elements for the button styling
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: following ? 'white' : '#0cf',
          zIndex: -2,
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '0%',
          height: '100%',
          backgroundColor: following ? '#e0e0e0' : '#09b',
          transition: 'all 0.3s',
          zIndex: -1,
        },
        '&:hover': {
          color: following ? 'black' : 'white',
          '&:before': {
            width: '100%',
          },
        },
      }}
    >
      {title}
    </Button>
  );
};

export default CustomButton;
