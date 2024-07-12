import { Box, Flex, Image, Link } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import React from "react"

const Layout = () => {
  return (
    <Flex w="100%" minH="100%">
      <Box className="menu" position="fixed" zIndex={2} flexFlow="row" bg="dark.500" w="100%">
        <Link href="https://www.ctc.co.il/">
          <Image src="https://www.ctc.co.il/wp-content/uploads/2019/10/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8Flogo-ctc-white-wide-140px.png" />
        </Link>
      </Box>
      <Flex justifyContent="center" alignItems="center" w="100%" minH="100%">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default Layout
