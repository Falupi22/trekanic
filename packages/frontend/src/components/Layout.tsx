import { Box, Flex, Image, Link } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import React from "react"

const Layout = () => {
  return (
    <Flex w="100%" h="100%" bg="dark.400" flexFlow="column">
      <Box flex="12%" zIndex={2} bg="dark.500" w="100%">
        <Link href="https://www.ctc.co.il/">
          <Image src="https://www.ctc.co.il/wp-content/uploads/2019/10/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8Flogo-ctc-white-wide-140px.png" />
        </Link>
      </Box>
      <Flex flex="88%" justifyContent="center">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default Layout
