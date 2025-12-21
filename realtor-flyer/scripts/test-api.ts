
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is not set in .env");
        process.exit(1);
    }


    console.log("Testing API key with model: gemini-1.5-pro");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    try {
        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Error testing gemini-1.5-pro:", error);
    }

    console.log("\nTesting API key with model: gemini-2.5-flash-image");
    // Verify that the model can be instantiated and basic text generation works
    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
        const prompt = "Describe a house";
        const result = await model2.generateContent(prompt);
        const response = await result.response;
        console.log("Success with gemini-2.5-flash-image!");
        // We aren't testing image output here because we don't have a valid base64 image to send, 
        // but verifying the connection to the model is the goal.
    } catch (error: any) {
        console.error("Error testing gemini-2.5-flash-image:", error.message);
    }
}

testGemini();
