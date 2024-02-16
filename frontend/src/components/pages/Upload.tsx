import {Input} from "@/components/ui/input";
import {ForwardedRef, forwardRef, useRef, useState} from "react";
import jsmediatags from "jsmediatags";
import {Tags} from "jsmediatags/types";

export default function Upload() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File>(new File([], ""));
    const [fileTags, setFileTags] = useState<Tags>();
    function handleInputChange() {
        if (!fileRef.current) {
            return;
        }
        if (fileRef.current.type != "file") {
            return;
        }
        const file = fileRef.current.files![0];
        setFile(file);
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                setFileTags(tag.tags);
            },
            onError: function (error) {
                console.log(':(', error.type, error.info);
            }
        });
    }

    return (
        <>
            <div className="inline-block rounded-xl bg-neutral-900 border border-white text-center">
                <div className="text-neutral-100 p-2">
                    <div className="metadata h-28 text-neutral-200 font-thin">
                        {file.name &&
                            <>
                                Title: {fileTags?.title}<br />
                                Artist: {fileTags?.artist}<br />
                                Album: {fileTags?.album}<br />
                                Year: {fileTags?.year}<br />
                            </>
                        }
                    </div>
                    {file.name || "No File Selected"}
                </div>
                <InputFile onChange={handleInputChange} ref={fileRef} />
            </div>
        </>
    );
}

interface inputFileProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputFile = forwardRef(({onChange}: inputFileProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <>
            <Input
                ref={ref}
                className="rounded-t-none w-full"
                id="audio"
                name="audio"
                type="file"
                accept=".mp3,.aac,.m4a"
                onChange={onChange}
            />
        </>
    );
});
