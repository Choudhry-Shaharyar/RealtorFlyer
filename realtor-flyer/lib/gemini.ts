import { GoogleGenerativeAI } from "@google/generative-ai";

// Export parameters interface
export interface FlyerParams {
    listingType: "FOR SALE" | "FOR LEASE" | "SOLD" | "OPEN HOUSE" | "COMING SOON" | "PRICE REDUCTION";
    price: string;
    originalPrice?: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet?: number;
    propertyAddress?: string;
    description?: string;
    agentName: string;
    agentPhone: string;
    agentCompany?: string;
    // Images are passed as base64 data
    propertyImages?: string[]; // Array of base64 strings
    agentPortrait?: string;    // Base64 string
    colorScheme: "navy" | "black" | "green" | "burgundy" | "charcoal" | "purple" | "taupe" | "teal" | "custom";
    customHex?: string;
    style: "modern" | "luxury" | "minimalist" | "classic";
    aspectRatio: "1:1" | "9:16" | "16:9" | "4:5";
}

export function buildFlyerPrompt(params: FlyerParams): string {
    const colors: Record<string, string> = {
        navy: "deep navy blue with white text and gold accents",
        black: "elegant black with white text and silver accents",
        green: "forest green with cream text and gold accents",
        burgundy: "rich burgundy with ivory text and gold accents",
        charcoal: "modern charcoal grey with white text and silver accents",
        purple: "regal royal purple with white text and gold accents",
        taupe: "warm brownish taupe earth tone with dark brown text",
        teal: "deep modern teal with white text and gold accents",
    };

    const colorInstruction = params.colorScheme === "custom" && params.customHex
        ? `custom color scheme matching hex code ${params.customHex} with complementary text color`
        : colors[params.colorScheme] || colors.navy;

    const styles: Record<string, string> = {
        modern: "clean modern layout, sans-serif fonts, lots of white space",
        luxury: "premium luxury design, elegant serif fonts, subtle gradients",
        minimalist: "minimalist layout, very clean, thin typography",
        classic: "classic professional real estate layout, balanced typography",
    };

    const priceBlock =
        params.listingType === "PRICE REDUCTION" && params.originalPrice
            ? `Show original price "$${params.originalPrice}" with a strikethrough, then new price "$${params.price}" larger below`
            : `Display the price "$${params.price}" prominently`;

    const imageCount = params.propertyImages?.length || 0;

    let imageInstructions = "";
    if (imageCount === 0) {
        imageInstructions = `
[LAYOUT: GENERIC STOCK]
No property images provided. Create a high-quality "Coming Soon" or generic real estate flyer style.
- Use generic, modern, abstract real estate background shapes or patterns.
- DO NOT halluncinate a specific house photo.
- Focus on typography and the text information.
- Center the Agent's information if provided.
`;
    } else if (imageCount === 1) {
        imageInstructions = `
[LAYOUT: HERO FEATURE]
The user has provided EXACTLY 1 property photo.
- Use this single image as the main Hero background or central feature.
- Do NOT shrink the image unnecessarily.
- Do NOT duplicate the image to fill space.
- Overlay text stylishly or place text in a solid panel below/overlaying the image.
`;
    } else if (imageCount === 2) {
        imageInstructions = `
[LAYOUT: SPLIT VIEW]
The user has provided EXACTLY 2 property photos.
- Layout: 50/50 Split (Horizontal Top/Bottom OR Vertical Left/Right).
- Top/Left: Image 1
- Bottom/Right: Image 2
- CRITICAL: Do NOT duplicate either image. Use each image exactly once.
- CRITICAL: Do NOT crop important features.
`;
    } else if (imageCount === 3) {
        imageInstructions = `
[LAYOUT: TRIO GRID]
The user has provided EXACTLY 3 property photos.
- Image 1 (Hero): Takes up the top 50-60% of the flyer.
- Image 2 & 3: Placed side-by-side in the bottom section.
- CRITICAL: Use each image exactly once. Do not repeat images.
`;
    } else {
        // 4 or more
        imageInstructions = `
[LAYOUT: GALLERY GRID]
The user has provided ${imageCount} property photos.
- Image 1 (Hero): Large feature image (top 50%).
- Remaining images: Arrange in a neat grid or strip below the hero image.
- CRITICAL: Use each image exactly once. Do not repeat images.
`;
    }

    const agentPortraitInstruction = params.agentPortrait
        ? "Agent portrait photo is provided - include in top-right corner or bottom section clearly."
        : "No agent photo provided.";

    return `
Design a professional real estate social media flyer.

PROPERTY IMAGES PROVIDED: ${imageCount}
${imageInstructions}

AGENT INFORMATION:
${agentPortraitInstruction}
- Agent: "${params.agentName}"
${params.agentPhone ? `- Phone: "${params.agentPhone}"` : ""}
${params.agentCompany ? `- Company: "${params.agentCompany}"` : ""}

PROPERTY DETAILS:
- Listing Type: "${params.listingType}"
- Price: ${priceBlock}
- "${params.bedrooms} Bedrooms / ${params.bathrooms} Bathrooms"
${params.squareFeet ? `- "${params.squareFeet.toLocaleString()} sq ft"` : ""}
${params.description ? `- "${params.description}"` : ""}
${params.propertyAddress ? `- Address: "${params.propertyAddress}"` : ""}

DESIGN RULES:
- Color scheme: ${colorInstruction}
- Style: ${styles[params.style]}
- Aspect Ratio: ${params.aspectRatio}
- Clean alignment and spacing
- All text must be crisp and legible
- Professional, marketing-ready social media design

CRITICAL RULES:
- All user-provided images must appear exactly as uploaded
- Preserve original aspect ratios
- Do NOT distort, crop, or modify user photos
- Simply integrate them into your layout
- Designate the first image as the Hero image.

Generate the final flyer image.
`.trim();
}

export async function generateFlyerImage(
    params: FlyerParams
): Promise<{ base64: string; mimeType: string }> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Using gemini-2.5-flash-image which supports image input calling
    const model = genAI.getGenerativeModel({
        model: "gemini-3-pro-image-preview",
    });

    const promptText = buildFlyerPrompt(params);

    // Prepare content parts: Text prompt + Images
    const parts: any[] = [{ text: promptText }];


    // Add property images
    if (params.propertyImages && params.propertyImages.length > 0) {
        console.log(`Processing ${params.propertyImages.length} property images...`);
        await Promise.all(params.propertyImages.map(async (imgData, index) => {
            let cleanBase64 = "";
            let mimeType = "image/jpeg"; // default

            if (imgData.startsWith("http")) {
                // It's a URL, fetch and convert
                console.log(`Image ${index}: Fetching from URL...`);
                cleanBase64 = await urlToBase64(imgData);
                console.log(`Image ${index}: Base64 length after fetch: ${cleanBase64.length}`);
            } else {
                // It's likely base64 (with or without header)
                console.log(`Image ${index}: Processing data URL, length: ${imgData.length}`);
                // Extract MIME type from data URL if present (e.g., "data:image/png;base64,xxx")
                if (imgData.startsWith("data:")) {
                    const matches = imgData.match(/^data:([^;]+);base64,/);
                    if (matches && matches[1]) {
                        mimeType = matches[1];
                        console.log(`Image ${index}: Detected MIME type: ${mimeType}`);
                    }
                }
                cleanBase64 = imgData.split(',').pop() || "";
                console.log(`Image ${index}: Base64 length after extraction: ${cleanBase64.length}`);
            }

            if (cleanBase64) {
                console.log(`Image ${index}: Adding to parts with mimeType: ${mimeType}, data length: ${cleanBase64.length}`);
                parts.push({
                    inlineData: {
                        data: cleanBase64,
                        mimeType: mimeType
                    }
                });
            } else {
                console.error(`Image ${index}: EMPTY base64 data! Skipping.`);
            }
        }));
    }

    // Add agent portrait if exists
    if (params.agentPortrait) {
        console.log("Processing agent portrait...");
        let cleanBase64 = "";
        let mimeType = "image/jpeg"; // default

        if (params.agentPortrait.startsWith("http")) {
            // It's a URL, fetch and convert
            console.log("Agent portrait: Fetching from URL...");
            cleanBase64 = await urlToBase64(params.agentPortrait);
            console.log(`Agent portrait: Base64 length after fetch: ${cleanBase64.length}`);
        } else {
            // It's likely base64
            console.log(`Agent portrait: Processing data URL, length: ${params.agentPortrait.length}`);
            // Extract MIME type from data URL if present (e.g., "data:image/png;base64,xxx")
            if (params.agentPortrait.startsWith("data:")) {
                const matches = params.agentPortrait.match(/^data:([^;]+);base64,/);
                if (matches && matches[1]) {
                    mimeType = matches[1];
                    console.log(`Agent portrait: Detected MIME type: ${mimeType}`);
                }
            }
            cleanBase64 = params.agentPortrait.split(',').pop() || "";
            console.log(`Agent portrait: Base64 length after extraction: ${cleanBase64.length}`);
        }

        if (cleanBase64) {
            console.log(`Agent portrait: Adding to parts with mimeType: ${mimeType}, data length: ${cleanBase64.length}`);
            parts.push({
                inlineData: {
                    data: cleanBase64,
                    mimeType: mimeType
                }
            });
        } else {
            console.error("Agent portrait: EMPTY base64 data! Skipping.");
        }
    }

    try {
        console.log("Calling Gemini API (AI Studio) with images...");

        const result = await model.generateContent(parts);
        const response = result.response;
        const candidates = response.candidates;

        if (!candidates || candidates.length === 0) {
            throw new Error("No candidates returned");
        }

        const responseParts = candidates[0].content?.parts || [];
        const imagePart = responseParts.find(
            (p: any) => p.inlineData && p.inlineData.mimeType?.startsWith("image/")
        );

        if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
            console.error("Gemini response:", JSON.stringify(response, null, 2));
            throw new Error("Gemini did not return an image. Ensure the model supports image generation.");
        }

        return {
            base64: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType || "image/png",
        };

    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}

// Helper to convert URL to Base64
async function urlToBase64(url: string): Promise<string> {
    try {
        console.log(`urlToBase64: Fetching ${url}`);
        const response = await fetch(url);
        console.log(`urlToBase64: Response status: ${response.status}`);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        console.log(`urlToBase64: ArrayBuffer size: ${arrayBuffer.byteLength} bytes`);
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        console.log(`urlToBase64: Base64 length: ${base64.length}`);
        return base64;
    } catch (error) {
        console.error("urlToBase64: Error converting URL to Base64:", error);
        return ""; // Return empty string on failure to avoid crashing, though arguably should throw
    }
}

