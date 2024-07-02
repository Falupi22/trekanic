import { defineStyleConfig } from "@chakra-ui/react"

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    borderRadius: "base", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "opx solid",
      borderColor: "gray.500",
      color: "gray.500",
      height: "1em",
      width: "1em",
    },
    solid: {
      bg: "red.500",
      color: "whiteAlpha.900",
      _hover: { bg: "red.600" },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
})

const FormLabel = defineStyleConfig({
  baseStyle: {
    alignContent: "center",
  },
})

const Heading = defineStyleConfig({
  baseStyle: {
    margin: "1em 1em 1em 1em",
  },
})

const Link = defineStyleConfig({
  baseStyle: {
    color: "red.500",
    href: "#",
  },
})

export { Button, FormLabel, Heading, Link }
