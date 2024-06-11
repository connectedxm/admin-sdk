export type ImageVariant =
  | "public"
  | "thumbnail"
  | "small"
  | "large"
  | "square"
  | "opengraph";

const GetImageVariant = (url: string, variant: ImageVariant = "public") => {
  if (url.endsWith("/public")) {
    const regex = /\/public$/;
    return url.replace(regex, `/${variant}`);
  } else {
    return url;
  }
};

export default GetImageVariant;
