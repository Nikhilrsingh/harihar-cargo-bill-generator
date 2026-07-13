function Button({
    text,
    children,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    loading = false
}) {

    return (

        <button
            type={type}
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled || loading}
        >

            {loading ? "Please wait..." : (children || text)}

        </button>

    );

}

export default Button;