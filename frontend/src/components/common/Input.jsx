function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name
}) {

    return (

        <div className="input-group">

            {label && <label>{label}</label>}

            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>

    );

}

export default Input;