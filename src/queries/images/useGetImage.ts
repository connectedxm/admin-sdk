import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Image } from "@src/interfaces";
import { IMAGES_QUERY_KEY } from "./useGetImages";
import { QueryClient } from "@tanstack/react-query";

export const IMAGE_QUERY_KEY = (imageId: string) => [
  ...IMAGES_QUERY_KEY(),
  imageId,
];

export const SET_IMAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof IMAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetImage>>
) => {
  client.setQueryData(IMAGE_QUERY_KEY(...keyParams), response);
};

interface GetImageParams {
  imageId: string | undefined;
}

export const GetImage = async ({
  imageId,
}: GetImageParams): Promise<ConnectedXMResponse<Image>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/images/${imageId}`);

  return data;
};

const useGetImage = (imageId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetImage>>(
    IMAGE_QUERY_KEY(imageId),
    () => GetImage({ imageId }),
    {
      enabled: !!imageId,
    }
  );
};

export default useGetImage;
