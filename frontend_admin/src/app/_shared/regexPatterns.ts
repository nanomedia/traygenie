
export const RegexPatterns = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i,
    CELULAR: /^9[\d]{8}$/,
    DNI: /^\d{8}$/,
    RUC: /^\d{11}$/,
    // DOMAIN: /^([a-zA-Z]+[0-9]*([._-]?[a-zA-Z]+[0-9]*)*)$/,
    DOMAIN: /^([a-z]+([-_]?[a-z0-9])*([.]{1}[a-z]+([-_]?[a-z0-9])*)+)$/,
    URL: /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
}