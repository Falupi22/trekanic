import { Flex, Image } from "@chakra-ui/react"
import React from "react"

function Menu() {
    return (
        <Flex className="menu" position="fixed" zIndex={2} flexFlow="row" bg="dark.500" w="100%">
            <a href="https://www.ctc.co.il/"><Image src="https://www.ctc.co.il/wp-content/uploads/2019/10/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8Flogo-ctc-white-wide-140px.png" /></a>
        </Flex >
    )
}

export default Menu