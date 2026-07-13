import Button from "./Button";
import SearchInput from "./SearchInput";
import { Plus } from "lucide-react";

function PageToolbar({
    search,
    setSearch,
    buttonText,
    onButtonClick,
}) {

    return (

        <div className="page-toolbar">

            <SearchInput
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search customers..."
/>

            <Button
    text={`+ ${buttonText}`}
    onClick={onButtonClick}
/>

        </div>

    );

}

export default PageToolbar;