import React, { Children } from "react";
import { Card as ChakraCard } from "@chakra-ui/react";

const Card = ({ children, ShowCards = false, ...props }) => {
  return (
    <ChakraCard
      bg={{
        base: ShowCards ? "white" : "transparent",
        md: "white",
      }}
      p={{
        base: ShowCards ? "4" : "0",
        md: "6",
      }}
      borderRadius={{
        base: ShowCards ? "1rem" : "none",
        md: "1rem",
      }}
      w={"456px"}
      boxShadow={{
        base: ShowCards ? "md" : "none",
        md: "lg",
      }}
      {...props}
    >
      {children}
    </ChakraCard>
  );
};

export default Card;
