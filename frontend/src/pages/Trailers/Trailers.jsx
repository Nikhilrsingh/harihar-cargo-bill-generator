import { useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import PageHeader from "../../components/common/PageHeader";
import PageToolbar from "../../components/common/PageToolbar";

import TrailerDrawer from "../../components/trailers/TrailerDrawer";
import TrailerTable from "../../components/trailers/TrailerTable";

import useTrailers from "../../hooks/useTrailers";

function Trailers() {

    const { trailers, loading, refreshTrailers } = useTrailers();

    const [search, setSearch] = useState("");

    const [openDrawer, setOpenDrawer] = useState(false);

    const [selectedTrailer, setSelectedTrailer] = useState(null);

    return (

        <MainLayout>

            <div className="dashboard">

                <PageHeader
                    title="Trailers"
                    subtitle="Manage all transport trailers."
                />

                <PageToolbar
                    search={search}
                    setSearch={setSearch}
                    buttonText="Add Trailer"
                    onButtonClick={() => {

                        setSelectedTrailer(null);

                        setOpenDrawer(true);

                    }}
                />

                <TrailerTable
                    trailers={trailers}
                    loading={loading}
                    search={search}
                    refreshTrailers={refreshTrailers}
                    onEdit={(trailer) => {

                        setSelectedTrailer(trailer);

                        setOpenDrawer(true);

                    }}
                />

                <TrailerDrawer
                    open={openDrawer}
                    Trailer={selectedTrailer}
                    refreshTrailers={refreshTrailers}
                    onClose={() => setOpenDrawer(false)}
                />

            </div>

        </MainLayout>

    );

}

export default Trailers;