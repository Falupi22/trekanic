"use client"

import { EmailIcon, InfoIcon, TimeIcon } from "@chakra-ui/icons"
import { Avatar, Box, BoxProps, Flex, FlexProps, HStack, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import React, { ReactElement, ReactText } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { LogOutIcon } from "../assets/icons"
import { requestFailedToast } from "./alerts"
import { useUserInfoStore } from "../storage"
import { ROUTE_LOGIN } from "../utils/routes"

interface LinkItemProps {
  name: string
  icon: ReactElement
  link?: string
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: <TimeIcon /> },
  { name: "History", icon: <EmailIcon /> },
  { name: "Stats", icon: <InfoIcon /> },
]

export default function Sidebar({ username, isAdmin }) {
  const toast = useToast()
  const navigate = useNavigate()
  const reset = useUserInfoStore((state) => state.reset)

  const logout = () => {
    api
      .logout()
      .then((res) => {
        reset()
        navigate(ROUTE_LOGIN, { state: { prevURL: window.location.href } })
      })
      .catch((error) => {
        toast(requestFailedToast)
      })
  }

  const { onClose } = useDisclosure()
  return (
    <Box minH="100%" bg={"dark.500"} display="flex">
      <SidebarContent
        username={username}
        isAdmin={isAdmin}
        logOutCallback={logout}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      {/* mobilenav */}

      <Box ml={{ base: 0, md: 60 }} h="100%" display={{ base: "none", md: "block" }} p="4">
        {/* Content */}
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
  logOutCallback: () => void
  username: string
  isAdmin: boolean
}

const SidebarContent = ({ onClose, logOutCallback, username, isAdmin, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={"dark.500"}
      borderRight="1px"
      borderRightColor={"dark.500"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <HStack mb="5" ml={3}>
        <Avatar size={"sm"} />
        <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
          <Text fontSize="sm">{username}</Text>
          {isAdmin ? <Text fontSize="sm">Admin</Text> : null}
        </VStack>
      </HStack>
      <Box h="100%">
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
        <Box h="55%" _focus={{ boxShadow: "none" }}>
          <Flex h="100%" w="100%" flex="1" flexDirection="column" justifyContent="flex-end">
            <HStack
              onClick={logOutCallback}
              w="100%"
              mt="auto"
              p="4"
              mx="4"
              borderRadius="lg"
              cursor="pointer"
              color="white"
              _hover={{
                bg: "dark.400",
                color: "white",
              }}
            >
              <LogOutIcon />
              <Text ml={2} color="white">
                Log out
              </Text>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon: ReactElement
  children: ReactText
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box as="a" href="#" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color="white"
        _hover={{
          bg: "dark.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && <Box mr={4}>{icon}</Box>}
        {children}
      </Flex>
    </Box>
  )
}
