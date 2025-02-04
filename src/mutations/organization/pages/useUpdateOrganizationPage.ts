import { GetAdminAPI } from "@src/AdminAPI";
import { PageType, Page, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { OrganizationPageUpdateInputs } from "@src/params";
import { SET_ORGANIZATION_PAGE_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Organization-Pages
 */
export interface UpdateOrganizationPageParams extends MutationParams {
  type: PageType;
  page: OrganizationPageUpdateInputs;
}

/**
 * @category Methods
 * @group Organization-Pages
 */
export const UpdateOrganizationPage = async ({
  type,
  page,
  adminApiParams,
  queryClient,
}: UpdateOrganizationPageParams): Promise<ConnectedXMResponse<Page>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Page>>(
    `/organization/pages/${type}`,
    page
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_PAGE_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Pages
 */
export const useUpdateOrganizationPage = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationPage>>,
      Omit<UpdateOrganizationPageParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationPageParams,
    Awaited<ReturnType<typeof UpdateOrganizationPage>>
  >(UpdateOrganizationPage, options, {
    domain: "org",
    type: "update",
  });
};
