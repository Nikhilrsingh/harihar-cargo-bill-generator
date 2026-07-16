function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    name,
    maxLength,
    disabled = false,
    required = false,
    autoComplete,
    min,
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
                maxLength={maxLength}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete}
                min={min}
            />

        </div>

    );

}

export default Input;