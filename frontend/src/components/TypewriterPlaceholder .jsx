import { Box } from '@chakra-ui/react';

const TypewriterPlaceholder = ({ onOpen, placeholderText, borderColor, backgroundColor, textColor, caretColor }) => {
  const handleClick = () => {
    onOpen();
  };

  return (
    <Box
      as="div"
      onClick={handleClick}
      className="typewriter" // Apply the typewriter animation class
      cursor="pointer"
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      color={textColor}
      _after={{
        borderRight: `2px solid ${caretColor}`,
      }}
    >
      <span>{placeholderText}</span>
    </Box>
  );
};

export default TypewriterPlaceholder;
