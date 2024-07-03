import { extendTheme } from "@chakra-ui/react"
import { FormLabel, Button, Heading, Link } from "./variants"
import * as icons from "../assets/icons"

const theme = extendTheme({
  components: {
    Button,
    FormLabel,
    Heading,
    Link,
  },
  icons: {
    ...icons,
  },
})

export { theme }
