function BookingStepper({
    steps,
    currentStep,
    onStepClick,
}) {
    return (
        <div
            className="card"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                padding: "18px 24px",
                overflowX: "auto",
                gap: "12px",
            }}
        >
            {steps.map((step) => (
                <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                        if (step.id <= currentStep) {
                            onStepClick(step.id);
                        }
                    }}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: step.id <= currentStep ? "pointer" : "default",
                        opacity: step.id > currentStep ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontWeight: currentStep === step.id ? 700 : 500,
                        color:
                            currentStep === step.id
                                ? "var(--primary)"
                                : "inherit",
                    }}
                >
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            background:
                                currentStep >= step.id
                                    ? "var(--primary)"
                                    : "#E5E7EB",
                            color:
                                currentStep >= step.id
                                    ? "#fff"
                                    : "#6B7280",
                            fontSize: "14px",
                            fontWeight: 700,
                        }}
                    >
                        {step.id}
                    </div>

                    <span>{step.title}</span>
                </button>
            ))}
        </div>
    );
}

export default BookingStepper;