function DataTable({
    columns,
    children
}) {

    return (

        <div className="table-card">

            <table className="data-table">

                <thead>

                    <tr>

                        {columns.map((column) => (

                            <th key={column}>

                                {column}

                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {children}

                </tbody>

            </table>

        </div>

    );

}

export default DataTable;