import { GetAdminAPI } from '@src/AdminAPI';
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { CONTENT_TYPE_QUERY_KEY } from "./useGetContentType";
import { QueryClient } from "@tanstack/react-query";

export const CONTENT_TYPE_KPI_CONTENTS_QUERY_KEY = (contentTypeId: string) => [
  ...CONTENT_TYPE_QUERY_KEY(contentTypeId),
  "KPI_CONTENTS",
];

export const SET_CONTENT_TYPE_KPI_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_KPI_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeKPIContents>>
) => {
  client.setQueryData(
    CONTENT_TYPE_KPI_CONTENTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeKPIContentsProps {
  contentTypeId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetContentTypeKPIContents = async ({
  contentTypeId,
}: GetContentTypeKPIContentsProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contentTypes/${contentTypeId}/kpi/contents`
  );
  return data;
};

const useGetContentTypeKPIContents = (contentTypeId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentTypeKPIContents>>((
    CONTENT_TYPE_KPI_CONTENTS_QUERY_KEY(contentTypeId),
    () => GetContentTypeKPIContents({ contentTypeId }),
    {
      enabled: !!contentTypeId,
    }
  );
};

export default useGetContentTypeKPIContents;
