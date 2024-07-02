import { extendTheme } from "@chakra-ui/react"
import { FormLabel, Button, Heading, Link } from "./variants"

const theme = extendTheme({
  components: {
    Button,
    FormLabel,
    Heading,
    Link,
  },
})

export { theme }
