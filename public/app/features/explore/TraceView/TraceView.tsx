import { DataFrame, DataFrameView, TraceSpanRow } from '@grafana/data';
import { colors, useTheme } from '@grafana/ui';
import { TraceToLogsData } from 'app/core/components/TraceToLogsSettings';
import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';
import { StoreState } from 'app/types';
import { ExploreId, SplitOpen } from 'app/types/explore';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createSpanLinkFactory } from './createSpanLink';
import { UIElements } from './uiElements';
import { useChildrenState } from './useChildrenState';
import { useDetailState } from './useDetailState';
import { useHoverIndentGuide } from './useHoverIndentGuide';
import { useSearch } from './useSearch';
import { useViewRange } from './useViewRange';

function noop(): {} {
  return {};
}

type Props = {
  dataFrames: DataFrame[];
  splitOpenFn: SplitOpen;
  exploreId: ExploreId;
};

export function TraceView(props: Props) {
  const { expandOne, collapseOne, childrenToggle, collapseAll, childrenHiddenIDs, expandAll } = useChildrenState();
  const {
    detailStates,
    toggleDetail,
    detailLogItemToggle,
    detailLogsToggle,
    detailProcessToggle,
    detailReferencesToggle,
    detailTagsToggle,
    detailWarningsToggle,
    detailStackTracesToggle,
  } = useDetailState();
  const { removeHoverIndentGuideId, addHoverIndentGuideId, hoverIndentGuideIds } = useHoverIndentGuide();
  const { viewRange, updateViewRangeTime, updateNextViewRangeTime } = useViewRange();

  /**
   * Keeps state of resizable name column width
   */
  const [spanNameColumnWidth, setSpanNameColumnWidth] = useState(0.25);
  /**
   * State of the top minimap, slim means it is collapsed.
   */
  const [slim, setSlim] = useState(false);

  const traceProp = useMemo(() => transformDataFrames(props.dataFrames), [props.dataFrames]);
  const { search, setSearch, spanFindMatches } = useSearch(traceProp?.spans);
  const dataSourceName = useSelector((state: StoreState) => state.explore[props.exploreId]?.datasourceInstance?.name);
  const traceToLogsOptions = (getDatasourceSrv().getInstanceSettings(dataSourceName)?.jsonData as TraceToLogsData)
    ?.tracesToLogs;

  const theme = useTheme();

  const traceTimeline: any = useMemo(
    () => ({
      childrenHiddenIDs,
      detailStates,
      hoverIndentGuideIds,
      shouldScrollToFirstUiFindMatch: false,
      spanNameColumnWidth,
      traceID: traceProp?.traceID,
    }),
    [childrenHiddenIDs, detailStates, hoverIndentGuideIds, spanNameColumnWidth, traceProp?.traceID]
  );

  const createSpanLink = useMemo(() => createSpanLinkFactory(props.splitOpenFn, traceToLogsOptions), [
    props.splitOpenFn,
    traceToLogsOptions,
  ]);
  const scrollElement = document.getElementsByClassName('scrollbar-view')[0];
  const onSlimViewClicked = useCallback(() => setSlim(!slim), [slim]);

  if (!props.dataFrames?.length || !traceProp) {
    return null;
  }

  return <div>TEMP</div>;
}

function transformDataFrames(frames: DataFrame[]): any | null {
  // At this point we only show single trace.
  const frame = frames[0];
  if (!frame) {
    return null;
  }
  let data: any =
    frame.fields.length === 1
      ? // For backward compatibility when we sent whole json response in a single field/value
        frame.fields[0].values.get(0)
      : transformTraceDataFrame(frame);
  return data;
}

function transformTraceDataFrame(frame: DataFrame): any {
  const view = new DataFrameView<TraceSpanRow>(frame);
  const processes: Record<string, any> = {};
  for (let i = 0; i < view.length; i++) {
    const span = view.get(i);
    if (!processes[span.serviceName]) {
      processes[span.serviceName] = {
        serviceName: span.serviceName,
        tags: span.serviceTags,
      };
    }
  }

  return {
    traceID: view.get(0).traceID,
    processes,
    spans: view.toArray().map((s) => {
      return {
        ...s,
        duration: s.duration * 1000,
        startTime: s.startTime * 1000,
        processID: s.serviceName,
        flags: 0,
        references: s.parentSpanID ? [{ refType: 'CHILD_OF', spanID: s.parentSpanID, traceID: s.traceID }] : undefined,
        logs: s.logs?.map((l) => ({ ...l, timestamp: l.timestamp * 1000 })) || [],
      };
    }),
  };
}
