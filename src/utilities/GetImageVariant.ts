export type ImageVariant =
  | "public"
  | "thumbnail"
  | "small"
  | "large"
  | "square"
  | "opengraph";

export const GetImageVariant = (
  url: string,
  variant: ImageVariant = "public"
) => {
  if (url.endsWith("/public")) {
    const regex = /\/public$/;
    return url.replace(regex, `/${variant}`);
  } else {
    return url;
  }
};
