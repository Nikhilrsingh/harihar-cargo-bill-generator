function Button({
    text,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false
}) {

    return (

        <button
            type={type}
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >

            {text}

        </button>

    );

}

export default Button;