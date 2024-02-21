import useSwr from "swr"

export const useSearch = (query: string) => {
  const { data, error, isValidating, isLoading, mutate } = useSwr(`/search-results/${query}`, async () => {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${query}`)
    const data = await response.json()
    
    return data
  }, {
    revalidateOnFocus: false,
    revalidateOnMount:false,
    revalidateOnReconnect: false,
  })
  
  return {
    data,
    isLoading: isValidating && isLoading,
    error,
    mutate
  }
}