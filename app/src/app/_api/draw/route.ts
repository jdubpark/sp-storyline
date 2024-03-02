// import OpenAI, {toFile} from 'openai'
 
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export async function POST(req: Request) {
//   // const res = await fetch('https://data.mongodb-api.com/...', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     'API-Key': process.env.DATA_API_KEY!,
//   //   },
//   //   body: JSON.stringify({ time: new Date().toISOString() }),
//   // })

// 	const { messages } = await req.json()
  
// 	const imageStream = await toFile(imageBlob, "image.png", {
//     type: "image/png",
//   });
//   const maskStream = await toFile(maskBlob, "mask.png", {
//     type: "image/png",
//   });

//   const params: OpenAI.ImageEditParams = {
//     image: imageStream,
//     mask: maskStream,
//     prompt: prompt,
//     n: editNum,
//     size: "512x512",
//     response_format: "b64_json",
//   };
 
//   return Response.json(data)
// }