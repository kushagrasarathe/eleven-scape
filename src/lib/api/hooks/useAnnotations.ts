import {
  ANNOTATIONS,
  CREATE_ANNOTATION,
  DELETE_ANNOTATION,
} from '@/lib/constants';
import { TAnnotation } from '@/lib/db/schema';
import { _1Min } from '@/redux/constants/time';
import { useAppDispatch } from '@/redux/hooks';
import { appActions } from '@/redux/slices/app-slice';
import { AudioAnnotation } from '@/types/redux/app-state';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useFetchAnnotations = (audioId: string, dependsOn?: boolean) => {
  const dispatch = useAppDispatch();

  const fetchVoices = async () => {
    const { data } = await axios.get<TAnnotation[]>(
      `/api/annotations?audioVersionId=${audioId}`
    );

    return data;
  };

  function onSuccess(resp?: TAnnotation[]) {
    if (!!resp?.length) {
      dispatch(
        appActions.setAllAnnotations({
          audioId,
          annotations: resp!,
        })
      );
    }
  }

  function onError(error: AxiosError) {
    throw error;
  }

  return useQuery({
    queryKey: [ANNOTATIONS],
    queryFn: fetchVoices,
    keepPreviousData: true,
    onSuccess,
    onError,
    retry: 0,
    staleTime: 15 * _1Min,
    cacheTime: 20 * _1Min,
    enabled: dependsOn,
  });
};

export const useAddAnnotationMutation = (audioVersionId: string) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const createAnnotation = async (annotation: Omit<AudioAnnotation, 'id'>) => {
    const { data } = await axios.post<TAnnotation>('/api/annotations', {
      audio_version_id: audioVersionId,
      annotationTimeframe: annotation.annotationTimeframe,
      text: annotation.text,
    });
    return data;
  };

  function onSuccess(resp: TAnnotation) {
    toast.success('Annotation added successfully');
    queryClient.invalidateQueries([ANNOTATIONS]);
  }

  function onError(error: AxiosError) {
    console.error('Error generating speech:', error);
  }

  return useMutation({
    mutationKey: [CREATE_ANNOTATION],
    mutationFn: createAnnotation,
    onSuccess,
    onError,
    retry: 0,
  });
};

export const useDeleteAnnotationMutation = (audioVersionId: string) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const deleteAnnotation = async (annotationId: string) => {
    const { data } = await axios.delete<{ message: string }>(
      `/api/annotations?audioVersionId=${audioVersionId}&annotationId=${annotationId}`
    );
    return data;
  };

  function onSuccess(resp: { message: string }) {
    toast.success('Annotation deleted successfully');
    queryClient.invalidateQueries([ANNOTATIONS]);
  }

  function onError(error: AxiosError) {
    console.error('Error deleting annotation:', error);
    toast.error('Failed to delete annotation');
  }

  return useMutation({
    mutationKey: [DELETE_ANNOTATION],
    mutationFn: deleteAnnotation,
    onSuccess,
    onError,
    retry: 0,
  });
};
