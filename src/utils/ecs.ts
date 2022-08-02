export const primitiveToBlocsType = (type: string): string => {
    switch (type) {
        case "signed char":         return "i8"
        case "short":               return "i16"
        case "int":                 return "i32"
        case "long long":           return "i64"
        case "unsigned char":       return "u8"
        case "unsigned short":      return "u16"
        case "unsigned int":        return "u32"
        case "unsigned long long":  return "u64"
        case "float":               return "f32"
        case "double":              return "f64"
        case "unsigned long":       return "size"
        case "std::string":         return "str"
        case "char *const":         return "cstr"
        default:                    return type
    }
}
