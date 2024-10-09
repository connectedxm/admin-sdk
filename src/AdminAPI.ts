import axios, { AxiosInstance } from "axios";

export interface AdminApiParams {
  apiUrl:
    | "https://admin-api.connectedxm.com"
    | "https://staging-admin-api.connectedxm.com"
    | "http://localhost:4001";
  organizationId: string;
  getToken: () => Promise<string | undefined> | string | undefined;
  getExecuteAs?: () => Promise<string | undefined> | string | undefined;
}

/**
 * @category Queries
 */
export const GetAdminAPI = async (
  params: AdminApiParams
): Promise<AxiosInstance> => {
  const token = await params.getToken();
  const executeAs = params.getExecuteAs
    ? await params.getExecuteAs()
    : undefined;

  return axios.create({
    baseURL: params.apiUrl,
    headers: {
      organization: params.organizationId,
      authorization: token,
      executeAs: executeAs,
    },
  });
};
