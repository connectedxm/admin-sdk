import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { LinkPreview, ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group Organization
 */
export interface UpsertLinkPreviewParams extends MutationParams {
  href: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpsertLinkPreview = async ({
  href,
  adminApiParams,
}: UpsertLinkPreviewParams): Promise<ConnectedXMResponse<LinkPreview>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<LinkPreview>>(
    `/organization/link-preview`,
    undefined,
    {
      params: { href },
    }
  );
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpsertLinkPreview = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpsertLinkPreview>>,
      Omit<UpsertLinkPreviewParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpsertLinkPreviewParams,
    Awaited<ReturnType<typeof UpsertLinkPreview>>
  >(UpsertLinkPreview, options);
};
