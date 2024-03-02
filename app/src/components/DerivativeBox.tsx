"use client";

import { CheckIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import mergeImages from "merge-images";
import NextImage from "next/image";
import { useCallback } from "react";

import { MOCK_NFT_ADDRESS, mockERC721ABI } from "@/constants";
import { useWriteContract } from "wagmi";

export type DerivativeBoxProps = {
  images: Array<string>;
};

export default function DerivativeBox({ images }: DerivativeBoxProps) {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { writeContractAsync } = useWriteContract();

  const handleMintAsNFT = useCallback(async () => {
    // const dataUrl = await mergeImages(["/body.png", "/eyes.png", "/mouth.png"]);
		const canvas = document.querySelector('canvas');
		if (!canvas) return
		const context = canvas.getContext('2d');
		if (!context) return

		// var image1 = new Image;
		// image1.onload = checkload;
		// image1.src = 'data:image/gif;base64,R0lGODdhAgACALMAAAAAAP///wAAAAAAAP8AAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAAgACAAAEAxBJFAA7';


		// var image2 = new Image;
		// image2.onload = checkload;

		// context.drawImage(image1, 0, 0, 50, 50);
		// context.drawImage(image2, 50, 50, 100, 100);
	
		// var combined = new Image;
		// combined.src = canvas.toDataURL('data/gif');

    // const args = nftUri && nftUri.trim() ? [address, nftUri] : [address];
    // const txHash = await writeContractAsync({
    //   abi: mockERC721ABI,
    //   address: MOCK_NFT_ADDRESS,
    //   functionName: "mint",
    //   args,
    // });
  }, [images]);

  return (
    <>
      <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(4, 1fr)" gap={4}>
        <GridItem colSpan={2} bg="tomato">
          {images[0] ? <NextImage src={images[0]} alt="" width={300} height={300} /> : null}
        </GridItem>
        <GridItem colSpan={2} bg="papayawhip">
          {images[1] ? <NextImage src={images[1]} alt="" width={300} height={300} /> : null}
        </GridItem>
        <GridItem colSpan={2} bg="papayawhip">
          {images[2] ? <NextImage src={images[2]} alt="" width={300} height={300} /> : null}
        </GridItem>
        <GridItem colSpan={2} bg="tomato">
          {images[3] ? <NextImage src={images[3]} alt="" width={300} height={300} /> : null}
        </GridItem>
      </Grid>
      <Button mt={3} colorScheme="teal" variant="solid" onClick={onModalOpen}>
        Register as Derivative IP!
      </Button>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent pb={6}>
          <ModalHeader>Register Derivative IP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion defaultIndex={0}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Text fontWeight="bold">1. Mint the new image as an NFT</Text>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FormControl>
                    <Button
                      mt={3}
                      colorScheme="teal"
                      variant="solid"
                      // onClick={handleMintAsNFT}
                    >
                      Mint as NFT
                    </Button>
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Text fontWeight="bold">2. Acquire a Social Remix license from the IP owner</Text>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FormControl>
                    <LicenseTerms />
                    <Button variant="ghost">Get License</Button>
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Text fontWeight="bold">3. Register the minted NFT as a derivative IP</Text>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <FormControl>
                    <Button variant="ghost">Secondary Action</Button>
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function LicenseTerms() {
  return (
    <Stack spacing={3} m="auto" p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="md">
        PIP Social Remixing License
      </Heading>
      <Text>
        Let the world build on play with your creation. This license allows for endless free remixing while tracking all
        the uses of your work and giving you full credit.
      </Text>
      <Divider my={2} />

      <Heading as="h2" size="md">
        Permissions
      </Heading>
      <List>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          Derivatives Allowed
        </ListItem>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          Derivatives Reciprocal
        </ListItem>
        <ListItem>
          <ListIcon as={CheckIcon} color="green.500" />
          Transferable
        </ListItem>
      </List>

      <Heading as="h2" size="md">
        Limitations
      </Heading>
      <List>
        <ListItem>
          <ListIcon as={CloseIcon} color="red.500" />
          Commercial Use
        </ListItem>
        <ListItem>
          <ListIcon as={CloseIcon} color="red.500" />
          Derivatives Approval Needed
        </ListItem>
      </List>

      <Heading as="h2" size="md">
        Conditions
      </Heading>
      <List>
        <ListItem>
          <ListIcon as={InfoIcon} color="blue.500" />
          Derivatives Attribution Needed
        </ListItem>
      </List>
    </Stack>
  );
}
