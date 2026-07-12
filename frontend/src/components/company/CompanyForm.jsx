import {
    saveCompany,
    getCompany
} from "../../services/companyService";
import { useEffect, useState } from "react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

function CompanyForm() {

    const [company, setCompany] = useState({
        companyName: "",
        gst: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    useEffect(() => {

    const loadCompany = async () => {

        const data = await getCompany();

        if (data) {
            setCompany(data);
        }

    };

    loadCompany();

}, []);

    const handleChange = (e) => {

        setCompany({
            ...company,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await saveCompany(company);

alert("Company saved successfully.");

    };

    return (

        <Card>

            <h2>Company Information</h2>

            <form
                className="company-form"
                onSubmit={handleSubmit}
            >

                <Input
                    label="Company Name"
                    name="companyName"
                    value={company.companyName}
                    onChange={handleChange}
                    placeholder="Harihar Car Carriers"
                />

                <Input
                    label="GST Number"
                    name="gst"
                    value={company.gst}
                    onChange={handleChange}
                    placeholder="GST Number"
                />

                <Input
                    label="Email"
                    name="email"
                    value={company.email}
                    onChange={handleChange}
                    placeholder="Company Email"
                />

                <Input
                    label="Phone Number"
                    name="phone"
                    value={company.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />

                <Input
                    label="Website"
                    name="website"
                    value={company.website}
                    onChange={handleChange}
                    placeholder="Website"
                />

                <Input
                    label="Address"
                    name="address"
                    value={company.address}
                    onChange={handleChange}
                    placeholder="Company Address"
                />

                <Input
                    label="City"
                    name="city"
                    value={company.city}
                    onChange={handleChange}
                    placeholder="City"
                />

                <Input
                    label="State"
                    name="state"
                    value={company.state}
                    onChange={handleChange}
                    placeholder="State"
                />

                <Input
                    label="PIN Code"
                    name="pincode"
                    value={company.pincode}
                    onChange={handleChange}
                    placeholder="PIN Code"
                />

                <Button
                    type="submit"
                    text="Save Company"
                />

            </form>

        </Card>

    );

}

export default CompanyForm;