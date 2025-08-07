import { ImageProps } from "@/interfaces";
import { useState } from "react";

// Define a constraint for the request body when dealing with image generation
interface ImageGenerationRequest {
    prompt: string;
}

const useFetchData = <T, R extends Record<string, any> = any>() => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);

    const fetchData = async (endpoint: string, body: R, shouldTrackImage = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!resp.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await resp.json();
            setResponseData(result);

            // Only track image if explicitly requested and if the body has a prompt property
            if (shouldTrackImage && 'prompt' in body && result?.message) {
                setGeneratedImages((prev) => [...prev, {
                    imageUrl: result.message,
                    prompt: body.prompt as string
                }]);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        responseData,
        error,
        fetchData,
        generatedImages
    };
};

export default useFetchData;