import dotenv from 'dotenv'
dotenv.config()

import { PutObjectCommand, GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({region: 'ap-south-1'});
import { createReadStream, createWriteStream } from "fs"

const writeToFile = async() => {
  const command = new PutObjectCommand({
    Bucket: "mirpur",
    Key: "hello-s3.txt",
    Body: "Hello S3!",
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}


const uploadAFile = async() => {
  const fileStream = createReadStream("./upload-a-file.txt");

  const command = new PutObjectCommand({
    Bucket: "mirpur",
    Key: "upload-a-file.txt",
    Body: fileStream,
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}


const downloadAFile = async() => {
  const fileStream = createWriteStream("./download-test.txt");
  const command = new GetObjectCommand({
    Bucket: "mirpur",
    Key: "download-test.txt",
  });

  const response = await client.send(command);
  response.Body.pipe(fileStream);
  console.log("File downloaded successfully");

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

const displayList = async() => {
  const bucketName = "mirpur"
  const region = "ap-south-1"
  const command = new ListObjectsV2Command({
    Bucket: "mirpur",
    Prefix: "images/",
   });
   try{
    const response = await client.send(command);
    const imageLinks = [];
    for (const item of response.Contents) {
      if (item.Key.endsWith(".png") || item.Key.endsWith(".jpg") || item.Key.endsWith(".jpeg")) {
       // Construct the image link using the bucket name, region, and key
       const imageLink = `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`;
       // Push the image link to the array
       imageLinks.push(imageLink);
      }
     }
     // Display the image links array in JSON format in the console
     console.log(JSON.stringify(imageLinks, null, 2));
   }catch(err){
    console.error(err);
   }
}

const main = async () => {
  // writeToFile();
  // uploadAFile();
  // downloadAFile();
  displayList();
};

main();