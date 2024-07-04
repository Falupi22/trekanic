import { Skeleton } from "@chakra-ui/react"
import React from "react"

const SkeletonLoader = () => {
  return (
    <>
      <Skeleton h="23vh" w="40em" mb={2} />
      <Skeleton h="23vh" w="40em" mb={2} />
      <Skeleton h="23vh" w="40em" mb={2} />
    </>
  )
}

export default SkeletonLoader
