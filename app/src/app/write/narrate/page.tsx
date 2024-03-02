"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRegisterDerivativeIp } from "@story-protocol/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { useWriteContract } from "wagmi";

import {
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  EXPECTED_EDITED_DATA_NUM,
  STORAGE_KEY__IMAGE_BASE64,
  STORAGE_KEY__IMAGE_URL,
  STORAGE_KEY__TOKEN_ID,
} from "@/constants";
import { b64ToBlob, combineCanvasDrawing, editImageDalle } from "@/utils";
import DerivativeBox from "@/components/DerivativeBox";

export default function WriteNarratePage() {
  const router = useRouter();
  const saveableCanvas = useRef<CanvasDraw | null>(null);
  const [fourImages, setFourImages] = useState<string[]>([]);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>();
  const { writeContractAsync: registerDerivativeIp, isPending: isPendingRegisterDerivativeIp } =
    useRegisterDerivativeIp();
  const { writeContractAsync, isPending } = useWriteContract();

  const [editedDataURLs, setEditedDataURLs] = useState<string[]>([
    JSON.parse(localStorage.getItem(STORAGE_KEY__IMAGE_BASE64) || ""),
    JSON.parse(localStorage.getItem(STORAGE_KEY__IMAGE_BASE64) || ""),
    JSON.parse(localStorage.getItem(STORAGE_KEY__IMAGE_BASE64) || ""),
  ]);
  const [isDalleEditing, setIsDalleEditing] = useState(false);

  const [imageBase64, setImageBase64] = useState<string>(
    JSON.parse(localStorage.getItem(STORAGE_KEY__IMAGE_BASE64) || "")
  );
  const [imageUrl, setImageUrl] = useState<string>(JSON.parse(localStorage.getItem(STORAGE_KEY__IMAGE_URL) || ""));
  const tokenId = useRef<string>(JSON.parse(localStorage.getItem(STORAGE_KEY__TOKEN_ID) || ""));

  const handleEditNft = useCallback(async () => {
    if (isDalleEditing || !saveableCanvas.current || !imageBase64) return;
    if (!prompt || prompt.trim() === "") return;
    setIsDalleEditing(true);

    const { blob: maskBlob } = combineCanvasDrawing(saveableCanvas.current);
    const imageBlob = await b64ToBlob(imageBase64, IMAGE_WIDTH, IMAGE_HEIGHT);

    try {
      const editedImageBase64s = await editImageDalle(imageBlob, maskBlob, prompt, EXPECTED_EDITED_DATA_NUM);

      if (editedImageBase64s) {
        setEditedDataURLs(editedImageBase64s.map((b64) => `data:image/png;base64,${b64}`));
      }
    } catch (error) {
      setEditedDataURLs([]);
      console.error(error);
    } finally {
      setIsDalleEditing(false);
    }
  }, [imageBase64, prompt, isDalleEditing]);

  const handleNextImage = useCallback(
    (selectedDataUrl: string) => {
      if (imgIndex < 4) {
        setFourImages([...fourImages, selectedDataUrl]);
      }
      setImgIndex(imgIndex + 1);

      setImageUrl(selectedDataUrl);
      setImageBase64(selectedDataUrl.split(",")[1]);

      if (saveableCanvas.current) {
        saveableCanvas.current.clear();
      }
    },
    [saveableCanvas, imgIndex]
  );

  useEffect(() => {
    if (!tokenId.current || !imageBase64 || !imageUrl) {
      router.push("/write/select");
    }
  }, [tokenId, imageBase64, imageUrl, router]);

  if (!imageUrl || !imageBase64 || !tokenId.current)
    return (
      <Box>
        <Text>First Select the IP to write a story on!</Text>
      </Box>
    );

  return (
    <>
      <Stack direction="column" spacing={4} alignItems="center">
        <Heading>Write a Story using IP</Heading>
        <Text>
          Draw a mask on the image. Then, write a description of how you want to edit the masked region.
          <br />
          Write your NFT story!
        </Text>
        <section>
          <Stack direction="row" spacing={10} alignItems="top">
            <Box className="border-4 border-teal-500 rounded-sm overflow-hidden">
              <CanvasDraw
                ref={(canvasDraw: CanvasDraw) => (saveableCanvas.current = canvasDraw)}
                brushColor="rgba(255,255,255,1)"
                imgSrc={imageUrl}
                hideGrid
                canvasWidth={IMAGE_WIDTH}
                canvasHeight={IMAGE_HEIGHT}
              />
            </Box>
            {!isDalleEditing &&
              editedDataURLs.length === EXPECTED_EDITED_DATA_NUM && ( // +1 for original image
                <Tabs align="center" variant="soft-rounded" colorScheme="teal" borderLeft="1px solid #ccc" pl={6}>
                  <TabList px={3}>
                    <Tab>Original</Tab>
                    <Tab>Opt. 1</Tab>
                    <Tab>Opt. 2</Tab>
                    <Tab>Opt. 3</Tab>
                  </TabList>
                  <TabPanels>
                    {[imageUrl, ...editedDataURLs].map((editedDataURL, index) => (
                      <TabPanel key={index}>
                        <Box className="border-4 border-teal-500 rounded-sm overflow-hidden">
                          <NextImage src={editedDataURL} alt={`Edited Image ${index + 1}`} width={380} height={380} />
                        </Box>
                        {index > 0 && (
                          <ButtonGroup orientation="vertical" spacing={2}>
                            <Button
                              mt={3}
                              colorScheme="teal"
                              variant="outline"
                              onClick={() => handleNextImage(editedDataURL)}
                            >
                              Select as Next Image
                            </Button>
                          </ButtonGroup>
                        )}
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              )}
          </Stack>
          <ButtonGroup mt={5} spacing={2} alignItems="center" width="100%">
            <Button
              colorScheme="red"
              onClick={() => {
                if (!saveableCanvas.current) return;
                saveableCanvas.current.clear();
              }}
            >
              Clear Mask
            </Button>
            <Button
              onClick={() => {
                if (!saveableCanvas.current) return;
                saveableCanvas.current.undo();
              }}
            >
              Undo
            </Button>
          </ButtonGroup>
        </section>
        <section className="mt-4">
          <Stack direction="column" spacing={4} alignItems="center">
            <Box>
              <Text>
                Describe the new image! Your description will be used to maintain the original image and edit the masked
                region.
              </Text>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="p-2 border-2 border-gray-300"
                placeholder="Write your NFT story..."
                size="md"
                mt={4}
              />
            </Box>
            <Button colorScheme="teal" onClick={handleEditNft} isDisabled={isDalleEditing}>
              {isDalleEditing ? "Creating..." : "Create a story"}
            </Button>
          </Stack>
        </section>
      </Stack>
      <Divider mt={5} />
      <DerivativeBox images={fourImages} />
    </>
  );
}
