import { useRef, useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react"
import { Clock, Loader, Search, X } from 'react-feather';
import useClickOutside from "../helpers/useClickOutside";

interface Props {
  onSearch: (query: string) => void
  isLoading: boolean
  searchHistory: Array<string>
  removeSearchedTerm: (query: string) => void
  onClearSearch: () => void
}

export const SearchBar = ({ onSearch, isLoading, searchHistory, removeSearchedTerm, onClearSearch }: Props) => {
  const [query, setQuery] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyContainerRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
      
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleSearch = () => {
    if (query.length > 0) {
      onSearch(query)
      setIsInputFocused(false)
    }
  }

  const searchPreviousQuery = (previousQuery: string) => () => {
    setQuery(previousQuery)
    onSearch(previousQuery)
    setIsInputFocused(false)
  }

  const onRemoveSearchedTerm = (previousQuery: string) => (event: MouseEvent<SVGElement>) => {
    event.stopPropagation()
    removeSearchedTerm(previousQuery)
  }

  const handleFocus = () => {
    setIsInputFocused(true)
  }

  const clearSearch = () => {
    setQuery('')
    onClearSearch()
  }

  useClickOutside(historyContainerRef, () => {
    setIsInputFocused(false);
  });

  return (
    <div className="flex gap-4">
      <div className="relative w-full" ref={historyContainerRef}>
        <input ref={inputRef} className="p-2 w-full pl-10 focus:outline-white rounded-lg h-full" type="text" onFocus={handleFocus} value={query} onChange={handleInputChange} onKeyPress={handleKeyPress} placeholder="Search Wikipedia..." />
        <Search className="absolute left-2 top-3" size={20} />
        {isInputFocused && <span className="z-0 absolute shadow-lg top-12 left-0 bg-slate-700 overflow-hidden w-full rounded-lg">
          <ul className="w-full flex flex-col">
            {searchHistory.length > 0 && 
            searchHistory.map((query, index) => (
              <li key={`${query}-${index}`} className="hover:bg-slate-500 select-none flex items-center w-full text-left">
                <span onClick={searchPreviousQuery(query)} className="flex items-center pl-2 py-2 gap-x-3 flex-1 hover:cursor-pointer">
                  <Clock size={18} />
                  {query}
                </span>
                <X className="hover:cursor-pointer mr-3 hover:bg-slate-400 rounded" size={20} onClick={onRemoveSearchedTerm(query)} />
              </li>
            ))}
          </ul>
        </span>}
        {query.length > 0 && <X className="hover:cursor-pointer hover:bg-slate-400 rounded absolute right-3 top-3" size={20} onClick={clearSearch} />}
      </div>
      <button disabled={isLoading} className="text-white bg-slate-500" onClick={handleSearch}>
        {isLoading ? <Loader className="animate-pulse" /> : <Search />}
      </button>
    </div>
  )
}