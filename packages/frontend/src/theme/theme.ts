import { extendTheme } from "@chakra-ui/react"
import { FormLabel, Button, Heading, Link, IconButton, Text, Input, Textarea, TextBox, Select } from "./variants"
import * as icons from "../assets/icons"
import colors from "./colors"

const theme = extendTheme({
  components: {
    Button,
    IconButton,
    FormLabel,
    Heading,
    Link,
    Text,
    Input,
    Textarea,
    TextBox, Select
  },
  icons: {
    ...icons,
  },
  colors: {
    ...colors,
  },
  shadows: {
    xs: "1px 1px 5px rgba(66, 66, 66, 0.5)",
    sm: "0 1px 2px rgba(66, 66, 66, 0.5)",
    base: "0 1px 3px rgba(66, 66, 66, 0.5)",
    md: "0 4px 6px rgba(66, 66, 66, 0.5)",
    lg: "0 10px 15px rgba(66, 66, 66, 0.5)",
    xl: "0 20px 25px rgba(66, 66, 66, 0.5)",
    "2xl": "0 25px 50px rgba(66, 66, 66, 0.5)",
    "dark-lg": "0 20px 25px rgba(66, 66, 66, 0.5)",
    outline: "0 0 0 3px rgba(66, 66, 66, 0.6)",
    inner: "inset 0 2px 4px 0 rgba(66, 66, 66, 0.5)",
  },
})

export { theme }
