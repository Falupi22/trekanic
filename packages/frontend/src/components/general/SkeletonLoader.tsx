import { Skeleton } from "@chakra-ui/react"
import React from "react"

const SkeletonLoader = () => {
  return (
    <>
      <Skeleton startColor="dark.200" endColor="dark.100" h="18vh" w="50em" mb={2} borderRadius="10px" />
      <Skeleton startColor="dark.200" endColor="dark.100" h="18vh" w="50em" mb={2} borderRadius="10px" />
      <Skeleton startColor="dark.200" endColor="dark.100" h="18vh" w="50em" mb={2} borderRadius="10px" />
    </>
  )
}

export default SkeletonLoader
