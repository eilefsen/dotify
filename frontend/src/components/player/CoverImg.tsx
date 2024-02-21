interface coverImgProps {
    src: string;
    alt: string;
    className?: string;
}

export default function CoverImg({src, alt, className}: coverImgProps) {
    return (
        <img
            className={'aspect-square' + className}
            src={src}
            alt={alt}
        />
    );
}
