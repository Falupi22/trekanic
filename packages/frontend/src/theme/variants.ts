import { defineStyleConfig } from "@chakra-ui/react"
import colors from "./colors"

const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    textTransform: "uppercase",
    borderRadius: "base", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    xs: {
      fontSize: "xs",
      px: 3, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 4, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 6, // <-- these values are tokens from the design system
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
      size: "xs",
      bg: colors.dark[100],
      color: "black",
      _hover: { bg: colors.dark[75] },
    },
    square: {
      size: "xs",
      color: colors.dark[100],
      p: "0",
      bg: colors.dark[400],
      _hover: { bg: colors.dark[200] },
    },
    alert: {
      _hover: { bg: colors.dark[200] },
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
})

const IconButton = Button

const FormLabel = defineStyleConfig({
  baseStyle: {
    color: colors.dark['50'],
    alignContent: "center",
  },
})

const Heading = defineStyleConfig({
  baseStyle: {
    margin: "1em 1em 1em 1em",
    color: colors.dark[100],
    fontFamily: "Arial"
  }
})

const Text = defineStyleConfig({
  baseStyle: {
    color: colors.dark[50],
    fontFamily: "Arial",
    foreText:
      { color: colors.dark[50], }
  }, variants: {
    error: {
      color: "red.300",
    }, errorDark: {
      color: "red.700",
    }
  }
})

const Input = defineStyleConfig({
  baseStyle: {
    color: colors.dark[500],
    bg: "white",
  }, variants: {
    normal:
      { bg: "white" }
  }
})

const Select = defineStyleConfig({
  baseStyle: {
    bg: "white",
  }, variants: {
    normal:
      { bg: "white" }
  }
})

const TextBox = defineStyleConfig({
  baseStyle: {
    bg: "white",
    color: colors.dark[500],
    _placeholder: { color: colors.dark[200] }
  }, variants: {
    normal:
      { bg: "white" }
  }
})

const Textarea = defineStyleConfig({
  baseStyle: {
    bg: "white",
    _placeholder: { color: colors.dark[200] }
  }, variants: {
    normal:
      { bg: "white", _placeholder: { color: colors.dark[200] } }
  }
})


const Link = defineStyleConfig({
  baseStyle: {
    color: "red.500",
    href: "#",
  },
})

const Flex = defineStyleConfig({
  baseStyle: {
    color: "gray.200",
  },
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
    square: {
      bg: "red.500",
    },
  },
})

export { Button, IconButton, FormLabel, Heading, Link, Flex, Text, Input, Textarea, TextBox, Select }
