import { useState } from "react"
import Input from "../../ui/input/Input"
import "./search.scss"

const Search = () => {
    const [search , setSearch] = useState("");

    return <Input 
                value={search} 
                onChange={(e)=>setSearch(e.target.value)} 
                placeholder="Search an Address"
            />
}

export default Search
