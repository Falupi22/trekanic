import { Flex, Skeleton } from "@chakra-ui/react"
import React from "react"

interface SkeletonLoaderProps {
  count: number // Number of Skeletons to render
}

const SkeletonLoader = ({ count }: SkeletonLoaderProps) => {
  return (
    <Flex gap={5} flexDir="column">
      {Array.from({ length: count }, (_, index) => index).map((index) => (
        <Skeleton key={index} startColor="dark.200" endColor="dark.100" h="12vh" w="60em" mb={2} borderRadius="10px" />
      ))}
    </Flex>
  )
}

export default SkeletonLoader
