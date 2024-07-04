import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react"
import React from "react"

interface EnsureDialogProps {
  isOpen: boolean
  onCommit: () => void
  onCancel: () => void
  cancelRef: React.MutableRefObject<HTMLButtonElement>
}

function EnsureDialog({ isOpen, onCommit, onCancel, cancelRef }: EnsureDialogProps) {
  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onCancel}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} variant="alert" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onCommit} variant="alert" ml={6}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default EnsureDialog
