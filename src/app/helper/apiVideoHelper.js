import ApiVideoClient from "@api.video/nodejs-sdk";

export const getApiVideoClient = () => {
    return new ApiVideoClient({ apiKey: process.env.API_VIDEO_API_KEY });
};
