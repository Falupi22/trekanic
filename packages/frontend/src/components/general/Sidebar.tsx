"use client"

import { EmailIcon, InfoIcon, TimeIcon } from "@chakra-ui/icons"
import { Avatar, Box, BoxProps, Flex, FlexProps, HStack, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import React, { ReactElement, ReactText } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../../api"
import { LogOutIcon } from "../../assets/icons"
import { requestFailedToast } from "../alerts"

interface LinkItemProps {
  name: string
  icon: ReactElement
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: <TimeIcon /> },
  { name: "History", icon: <EmailIcon /> },
  { name: "Stats", icon: <InfoIcon /> },
]

export default function Sidebar({ username, isAdmin }) {
  const toast = useToast()
  const navigate = useNavigate()

  const logout = () => {
    api
      .logout()
      .then((res) => {
        console.log("sidebar" + window.location.href)
        navigate("/login", { state: { prevURL: window.location.href } })
      })
      .catch((error) => {
        toast(requestFailedToast)
      })
  }

  const { onClose } = useDisclosure()
  return (
    <Box minH="100vh" bg={"dark.500"} display="flex">
      <SidebarContent
        username={username}
        isAdmin={isAdmin}
        logOutCallback={logout}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      {/* mobilenav */}

      <Box ml={{ base: 0, md: 60 }} p="4">
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
      mt={20}
      bg={"dark.500"}
      borderRight="1px"
      borderRightColor={"dark.500"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <HStack ml={15} mb="5">
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
        <Box onClick={logOutCallback} as="a" href="#" style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
          <Flex {...rest}>
            <HStack
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              color="white"
              mt="370"
              _hover={{
                bg: "dark.400",
                color: "white",
              }}
            >
              <LogOutIcon />
              <Text ml={2} color="while">
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
