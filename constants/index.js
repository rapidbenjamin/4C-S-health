import COLORS from "./colors"
import { SIZES, FONTS_FAMILY, FONTS } from "./size"
import ICONS from "./icons"

const SHADOW = {
    borderRadius: SIZES.smallRadius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
}

export { COLORS, SIZES, FONTS_FAMILY, FONTS, SHADOW, ICONS };