import { useCallback, useState } from 'react';
// import { DetailState } from '@jaegertracing/jaeger-ui-components';
// import { TraceLog } from '@jaegertracing/jaeger-ui-components/src/types/trace';

/**
 * Keeps state of the span detail. This means whether span details are open but also state of each detail subitem
 * like logs or tags.
 */
export function useDetailState() {
  const [detailStates, setDetailStates] = useState(new Map<string, any>());

  const toggleDetail = useCallback(
    function toggleDetail(spanID: string) {
      const newDetailStates = new Map(detailStates);
      if (newDetailStates.has(spanID)) {
        newDetailStates.delete(spanID);
      } else {
        //newDetailStates.set(spanID, new DetailState());
      }
      setDetailStates(newDetailStates);
    },
    [detailStates]
  );

  const detailLogItemToggle = useCallback(
    function detailLogItemToggle(spanID: string, log: any) {
      const old = detailStates.get(spanID);
      if (!old) {
        return;
      }
      const detailState = old.toggleLogItem(log);
      const newDetailStates = new Map(detailStates);
      newDetailStates.set(spanID, detailState);
      return setDetailStates(newDetailStates);
    },
    [detailStates]
  );

  return {
    detailStates,
    toggleDetail,
    detailLogItemToggle,
    detailLogsToggle: useCallback(
      (spanID: string) => makeDetailSubsectionToggle('logs', detailStates, setDetailStates)(spanID),
      [detailStates]
    ),
    detailWarningsToggle: useCallback(
      (spanID: string) => makeDetailSubsectionToggle('warnings', detailStates, setDetailStates)(spanID),
      [detailStates]
    ),
    detailStackTracesToggle: useCallback(
      (spanID: string) => makeDetailSubsectionToggle('stackTraces', detailStates, setDetailStates)(spanID),
      [detailStates]
    ),
    detailReferencesToggle: useCallback(
      (spanID: string) => makeDetailSubsectionToggle('references', detailStates, setDetailStates)(spanID),
      [detailStates]
    ),
    detailProcessToggle: useCallback(
      (spanID: string) => makeDetailSubsectionToggle('process', detailStates, setDetailStates)(spanID),
      [detailStates]
    ),
    detailTagsToggle: useCallback(
      (spanID: string) => makeDetailSubsectionToggle('tags', detailStates, setDetailStates)(spanID),
      [detailStates]
    ),
  };
}

function makeDetailSubsectionToggle(
  subSection: 'tags' | 'process' | 'logs' | 'warnings' | 'references' | 'stackTraces',
  detailStates: Map<string, any>,
  setDetailStates: (detailStates: Map<string, any>) => void
) {
  return (spanID: string) => {
    const old = detailStates.get(spanID);
    if (!old) {
      return;
    }
    let detailState;
    if (subSection === 'tags') {
      detailState = old.toggleTags();
    } else if (subSection === 'process') {
      detailState = old.toggleProcess();
    } else if (subSection === 'warnings') {
      detailState = old.toggleWarnings();
    } else if (subSection === 'references') {
      detailState = old.toggleReferences();
    } else if (subSection === 'stackTraces') {
      detailState = old.toggleStackTraces();
    } else {
      detailState = old.toggleLogs();
    }
    const newDetailStates = new Map(detailStates);
    newDetailStates.set(spanID, detailState);
    setDetailStates(newDetailStates);
  };
}
