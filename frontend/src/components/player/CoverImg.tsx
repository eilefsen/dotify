interface coverImgProps {
    src: string;
    alt: string;
}

export default function CoverImg({src, alt}: coverImgProps) {
    return (
        <img
            className='object-cover aspect-square'
            src={src}
            alt={alt}
        />
    );
}
