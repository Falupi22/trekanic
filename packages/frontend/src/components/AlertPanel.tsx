import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"

interface AlertInfo {
  date: string
  title: string
}

interface AlertsProps {
  alerts: AlertInfo[]
}

const AlertPanel = ({ alerts }: AlertsProps) => {
  return (
    <Flex
      mr={2}
      ml="auto"
      w="20%"
      display={{ base: "none", md: "block" }}
      borderRadius="5px"
      flexFlow="column"
      border="3px solid white"
      p={5}
    >
      {alerts && alerts.length > 0 ? (
        alerts.map((alert) => (
          <Box key={alert.title} mt={3}>
            <Text fontStyle="italic" fontWeight="bold">
              {new Date(alert.date).toJSON().slice(0, 10)}
            </Text>
            <Text>{alert.title}</Text>
          </Box>
        ))
      ) : (
        <Text fontStyle="italic" fontWeight="bold">
          Alerts will appear here!
        </Text>
      )}
    </Flex>
  )
}

export default AlertPanel
