import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "../useGetGroup";

export const GROUP_TRANSLATIONS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "TRANSLATIONS",
];

export const SET_GROUP_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof GROUP_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupTranslations>>
) => {
  client.setQueryData(GROUP_TRANSLATIONS_QUERY_KEY(...keyParams), response);
};

interface GetGroupTranslationsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
}: GetGroupTranslationsProps): Promise<
  ConnectedXMResponse<GroupTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/translations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetGroupTranslations = (groupId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupTranslations>>
  >(
    GROUP_TRANSLATIONS_QUERY_KEY(groupId),
    (params: any) => GetGroupTranslations(params),
    {
      groupId,
    },
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupTranslations;
