import { useEffect, useState } from 'react';
import { useSearch } from './helpers/useSearch'
import { SearchBar } from './components/Searchbar';
import { Loader } from 'react-feather';

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState<Array<string>>([])
  const { data, isLoading, mutate } = useSearch(searchTerm);

  const handleSearch = (query: string) => {
    setSearchTerm(query)
    setSearchHistory((prevHistory) => {
      return [
        query,
        ...prevHistory.filter((item) => item !== query).splice(0, 9)
      ]
    })
  }

  const handleRemoveSearchedTerm = (searchTerm: string) => {
    setSearchHistory((prevHistory) => {
      return [
        ...prevHistory.filter((item) => item !== searchTerm).splice(0, 9)
      ]
    })
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  useEffect(() => {
    mutate()
  }, [searchTerm, mutate])

  return (
    <div className="md:max-w-screen-sm mx-auto p-8 text-center flex flex-col justify-center mt-12 md:mt-32 font-medium">
      <h1 className="my-4">
        Wikipedia
      </h1>
      <SearchBar isLoading={isLoading} removeSearchedTerm={handleRemoveSearchedTerm} searchHistory={searchHistory} onSearch={handleSearch} onClearSearch={handleClearSearch} />
      {isLoading ? <div className="w-full flex justify-center text-center mt-4 animate-pulse"><Loader/></div> : <ul className="flex flex-col items-start my-4 gap-y-1">
        {data && data[1] && data[1].map((title: string, index: number) => {
          return (
            <li key={title}>
              <a className="text-white" href={data[3][index]} target="_blank">{title}</a>
            </li>
          )
        })}
      </ul>}
    </div>
  )
}

export default App
