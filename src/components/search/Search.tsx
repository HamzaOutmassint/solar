import { useState } from "react"
import Input from "../../ui/input/Input"
import "./search.scss"

const Search = () => {
    const [search , setSearch] = useState("");

    return <Input 
                value={search} 
                placeholder="Search an Address"
                onChange={(e)=>setSearch(e.target.value)} 
            />
}

export default Search
