import { Search } from "lucide-react";

function SearchInput({
    value,
    onChange,
    placeholder = "Search..."
}) {

    return (

        <div className="search-input">

            <Search size={18} />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

        </div>

    );

}

export default SearchInput;