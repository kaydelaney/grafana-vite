import { useMemo, useState } from 'react';

/**
 * Controls the state of search input that highlights spans if they match the search string.
 * @param spans
 */
export function useSearch(spans?: any[]) {
  const [search, setSearch] = useState('');
  const spanFindMatches: Set<string> | undefined | null = useMemo(() => {
    return search && spans ? undefined : undefined;
  }, [search, spans]);

  return { search, setSearch, spanFindMatches };
}
