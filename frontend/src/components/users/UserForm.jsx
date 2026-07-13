import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

import { userRoles } from "../../data/userRoles";

function UserForm() {

    return (

        <Card>

            <h2>Create User</h2>

            <form className="company-form">

                <Input
                    label="Full Name"
                    name="name"
                    placeholder="Enter full name"
                />

                <Input
                    label="Email"
                    name="email"
                    placeholder="Enter email"
                />

                <Input
                    label="Phone Number"
                    name="phone"
                    placeholder="Enter phone number"
                />

                <div className="input-group">

                    <label>Role</label>

                    <select>

                        {userRoles.map((role) => (

                            <option key={role}>
                                {role}
                            </option>

                        ))}

                    </select>

                </div>

                <Button
                    text="Create User"
                />

            </form>

        </Card>

    );

}

export default UserForm;