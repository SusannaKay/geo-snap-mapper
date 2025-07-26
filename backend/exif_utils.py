import piexif
from fractions import Fraction


def _to_rational(value: float) -> tuple[int, int]:
    f = Fraction(value).limit_denominator()
    return f.numerator, f.denominator


def _deg_to_dms_rational(deg: float):
    deg = abs(deg)
    d = int(deg)
    m_float = (deg - d) * 60
    m = int(m_float)
    s = (m_float - m) * 60
    return (
        _to_rational(d),
        _to_rational(m),
        _to_rational(s),
    )


def write_gps(image_path: str, lat: float, lon: float) -> None:
    """Write GPS coordinates into JPEG EXIF data."""
    exif_dict = piexif.load(image_path)
    gps = exif_dict.get("GPS", {})

    gps[piexif.GPSIFD.GPSLatitudeRef] = ("N" if lat >= 0 else "S").encode()
    gps[piexif.GPSIFD.GPSLatitude] = _deg_to_dms_rational(lat)

    gps[piexif.GPSIFD.GPSLongitudeRef] = ("E" if lon >= 0 else "W").encode()
    gps[piexif.GPSIFD.GPSLongitude] = _deg_to_dms_rational(lon)

    exif_dict["GPS"] = gps
    exif_bytes = piexif.dump(exif_dict)
    piexif.insert(exif_bytes, image_path)
